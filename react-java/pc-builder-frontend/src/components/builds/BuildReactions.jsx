import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';

export default function BuildReactions({ buildId, initialLikes = 0, initialDislikes = 0 }) {
  const { isAuthenticated } = useAuthStore();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [buildId]);

  const loadReactions = async () => {
    try {
      const response = await api.get(`/builds/${buildId}/reaction`);
      setLikes(response.data.likesCount || 0);
      setDislikes(response.data.dislikesCount || 0);
      setUserReaction(response.data.userReaction);
      setError(false);
    } catch (err) {
      console.error('Error loading reactions:', err);
      // Используем начальные значения при ошибке
      setLikes(initialLikes);
      setDislikes(initialDislikes);
      setError(true);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Войдите, чтобы оценить сборку');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/builds/${buildId}/like`);
      setLikes(response.data.likesCount || 0);
      setDislikes(response.data.dislikesCount || 0);
      setUserReaction(response.data.userReaction);
      setError(false);
    } catch (err) {
      console.error('Error liking build:', err);
      alert('Не удалось поставить лайк. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert('Войдите, чтобы оценить сборку');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/builds/${buildId}/dislike`);
      setLikes(response.data.likesCount || 0);
      setDislikes(response.data.dislikesCount || 0);
      setUserReaction(response.data.userReaction);
      setError(false);
    } catch (err) {
      console.error('Error disliking build:', err);
      alert('Не удалось поставить дизлайк. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Если произошла ошибка загрузки, показываем базовый интерфейс
  if (error) {
    return (
      <div className="flex items-center gap-3 opacity-50">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
          <ThumbsUp size={20} />
          <span className="font-semibold">{likes}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
          <ThumbsDown size={20} />
          <span className="font-semibold">{dislikes}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          userReaction === 'LIKE'
            ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 border-2 border-transparent'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ThumbsUp size={20} className={userReaction === 'LIKE' ? 'fill-current' : ''} />
        <span className="font-semibold">{likes}</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          userReaction === 'DISLIKE'
            ? 'bg-red-100 text-red-700 border-2 border-red-500 shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-transparent'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ThumbsDown size={20} className={userReaction === 'DISLIKE' ? 'fill-current' : ''} />
        <span className="font-semibold">{dislikes}</span>
      </button>
    </div>
  );
}