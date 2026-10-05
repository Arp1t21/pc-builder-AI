import { useState, useEffect } from 'react';
import api from '../../api/axios';
import BuildCard from './BuildCard';
import { AlertCircle } from 'lucide-react';

export default function BuildsList({ onEdit, onView }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBuilds();
  }, []);

  const loadBuilds = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/builds/my');
      setBuilds(response.data);
    } catch (err) {
      setError('Не удалось загрузить сборки');
      console.error('Error loading builds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (build) => {
    if (!window.confirm(`Удалить сборку "${build.name || 'Без названия'}"?`)) {
      return;
    }

    try {
      await api.delete(`/builds/${build.id}`);
      setBuilds(builds.filter((b) => b.id !== build.id));
    } catch (err) {
      alert('Не удалось удалить сборку');
      console.error('Error deleting build:', err);
    }
  };

  const handlePublish = async (build) => {
    if (build.published) {
      // Снять с публикации
      if (!window.confirm(`Снять сборку "${build.name}" с публикации?`)) {
        return;
      }
      
      try {
        await api.put(`/builds/${build.id}`, {
          published: false,
        });
        loadBuilds();
      } catch (err) {
        alert('Не удалось снять с публикации');
        console.error('Error unpublishing build:', err);
      }
      return;
    }

    // Опубликовать
    const name = prompt('Введите название сборки:', build.name || '');
    if (!name) return;

    const description = prompt('Введите описание сборки (расскажите о преимуществах, использовании):', build.description || '');

    try {
      await api.put(`/builds/${build.id}`, {
        name,
        description,
        published: true,
      });
      loadBuilds();
      alert('Сборка успешно опубликована!');
    } catch (err) {
      alert('Не удалось опубликовать сборку');
      console.error('Error publishing build:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Загрузка сборок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (builds.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600 mb-4">У вас пока нет сохраненных сборок</p>
        <a href="/builder" className="btn-primary inline-block">
          Создать сборку
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Сборок: {builds.length}/10
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builds.map((build) => (
          <BuildCard
            key={build.id}
            build={build}
            showActions={true}
            onView={onView}
            onEdit={onEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        ))}
      </div>
    </div>
  );
}