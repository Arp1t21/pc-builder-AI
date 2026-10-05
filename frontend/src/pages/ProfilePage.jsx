import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Calendar, TrendingUp, Package, Edit } from 'lucide-react';
import BuildsList from '../components/builds/BuildsList';
import BuildDetailsModal from '../components/builds/BuildDetailsModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import Avatar from '../components/common/Avatar';
import { useAuthStore } from '../store/authStore';
import { useBuilderStore } from '../store/builderStore';
import api from '../api/axios';

export default function ProfilePage() {
  const { logout } = useAuthStore();
  const { setComponent } = useBuilderStore();
  const navigate = useNavigate();
  
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBuilds: 0,
    publicBuilds: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/me');
      setUserProfile(response.data);
      
      // Загружаем сборки для статистики
      const buildsResponse = await api.get('/builds/my');
      const builds = buildsResponse.data;
      
      setStats({
        totalBuilds: builds.length,
        publicBuilds: builds.filter(b => b.published).length,
        totalViews: builds.reduce((sum, b) => sum + (b.views || 0), 0),
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
      navigate('/');
    }
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

  const handleViewBuild = (build) => {
    setSelectedBuild(build);
    setShowDetails(true);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  </h1>
                  
                  {userProfile?.bio ? (
                    <p className="text-gray-600 mb-4 max-w-2xl">
                      {userProfile.bio}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic mb-4">
                      Добавьте описание профиля
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

                {/* Actions */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100 mb-1">
                  Всего сборок
                </p>
                <p className="text-4xl font-bold">{stats.totalBuilds}</p>
              </div>
              <Package size={48} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100 mb-1">
                  Публичных
                </p>
                <p className="text-4xl font-bold">{stats.publicBuilds}</p>
              </div>
              <Settings size={48} className="text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100 mb-1">
                  Просмотров
                </p>
                <p className="text-4xl font-bold">{stats.totalViews}</p>
              </div>
              <TrendingUp size={48} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Builds List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Мои сборки
          </h2>
          <BuildsList onEdit={handleEditBuild} onView={handleViewBuild} />
        </div>
      </div>

      {/* Modals */}
      {showDetails && (
        <BuildDetailsModal
          build={selectedBuild}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEditModal && userProfile && (
        <EditProfileModal
          user={userProfile}
          onClose={() => setShowEditModal(false)}
          onUpdate={loadProfile}
        />
      )}
    </div>
  );
}