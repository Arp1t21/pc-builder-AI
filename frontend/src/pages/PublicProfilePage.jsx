import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Package, ArrowLeft, Edit, LogOut } from 'lucide-react';
import BuildCard from '../components/builds/BuildCard';
import BuildDetailsModal from '../components/builds/BuildDetailsModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import Avatar from '../components/common/Avatar';
import { useAuthStore } from '../store/authStore';
import { useBuilderStore } from '../store/builderStore';
import api from '../api/axios';

export default function PublicProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { setComponent } = useBuilderStore();
  
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Проверяем, является ли это профилем текущего пользователя
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    loadProfile();
    if (isAuthenticated) {
      loadCurrentUser();
    }
  }, [username, isAuthenticated]);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      // Загружаем профиль пользователя
      const profileResponse = await api.get(`/users/${username}`);
      setUserProfile(profileResponse.data);
      
      // Загружаем публичные сборки пользователя
      const buildsResponse = await api.get('/builds/public');
      const userBuilds = buildsResponse.data.filter(
        build => build.owner?.username === username
      );
      setBuilds(userBuilds);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Пользователь не найден');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBuild = (build) => {
    setSelectedBuild(build);
    setShowDetails(true);
  };

  const handleEditBuild = (build) => {
    const components = JSON.parse(build.componentsJson);
    Object.entries(components).forEach(([category, component]) => {
      if (component) {
        setComponent(category, component);
      }
    });
    navigate('/builder');
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMembershipDuration = (registeredAt) => {
    if (!registeredAt) return 'Недавно';
    
    const now = new Date();
    const registered = new Date(registeredAt);
    const diffTime = Math.abs(now - registered);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} дн.`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес.`;
    return `${Math.floor(diffDays / 365)} г.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Назад
        </button>

        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar 
                username={userProfile?.username} 
                avatarUrl={userProfile?.avatarUrl}
                size="xl"
              />
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile?.username}
                    {isOwnProfile && (
                      <span className="ml-3 text-sm font-normal text-gray-500">(Вы)</span>
                    )}
                  </h1>
                  
                  {userProfile?.bio ? (
                    <p className="text-gray-600 mb-4 max-w-2xl">
                      {userProfile.bio}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic mb-4">
                      {isOwnProfile ? 'Добавьте описание профиля' : 'Пользователь не добавил описание'}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Зарегистрирован {formatDate(userProfile?.registeredAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      <span>
                        На сайте {getMembershipDuration(userProfile?.registeredAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions - показываем только для своего профиля */}
                {isOwnProfile && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Edit size={20} />
                      Редактировать
                    </button>
                    <button
                      onClick={handleLogout}
                      className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <LogOut size={20} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-1">
                  Публичных сборок
                </p>
                <p className="text-4xl font-bold">{builds.length}</p>
              </div>
              <Package size={48} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-1">
                  Всего просмотров
                </p>
                <p className="text-4xl font-bold">{userProfile?.totalViews || 0}</p>
              </div>
              <TrendingUp size={48} className="text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100 mb-1">
                  Всего сборок
                </p>
                <p className="text-4xl font-bold">{userProfile?.totalBuilds || 0}</p>
              </div>
              <Package size={48} className="text-green-200" />
            </div>
          </div>
        </div>

        {/* Public Builds */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Публичные сборки
          </h2>

          {builds.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">
                {isOwnProfile 
                  ? 'У вас пока нет публичных сборок' 
                  : 'У этого пользователя пока нет публичных сборок'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build) => (
                <BuildCard
                  key={build.id}
                  build={build}
                  showActions={isOwnProfile}
                  onView={handleViewBuild}
                  onEdit={isOwnProfile ? handleEditBuild : undefined}
                  onDelete={isOwnProfile ? async (b) => {
                    if (window.confirm(`Удалить сборку "${b.name}"?`)) {
                      try {
                        await api.delete(`/builds/${b.id}`);
                        loadProfile();
                      } catch (err) {
                        alert('Не удалось удалить сборку');
                      }
                    }
                  } : undefined}
                  onPublish={isOwnProfile ? async (b) => {
                    try {
                      await api.put(`/builds/${b.id}`, {
                        published: !b.published,
                      });
                      loadProfile();
                    } catch (err) {
                      alert('Не удалось изменить статус публикации');
                    }
                  } : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetails && (
        <BuildDetailsModal
          build={selectedBuild}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEditModal && userProfile && isOwnProfile && (
        <EditProfileModal
          user={userProfile}
          onClose={() => setShowEditModal(false)}
          onUpdate={loadProfile}
        />
      )}
    </div>
  );
}