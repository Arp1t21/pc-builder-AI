import { Eye, Edit, Trash2, Globe, Lock } from 'lucide-react';
import BuildReactions from './BuildReactions';

export default function BuildCard({ build, showActions = false, onView, onEdit, onDelete, onPublish }) {
  const formatPrice = (price) => {
    if (!price) return 'Не указано';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getComponentsCount = () => {
    try {
      const components = JSON.parse(build.componentsJson || '{}');
      return Object.values(components).filter(c => c && c.name).length;
    } catch {
      return 0;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex-grow">
          {build.name || 'Без названия'}
        </h3>
        {build.published ? (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <Globe size={12} />
            Публичная
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            <Lock size={12} />
            Приватная
          </span>
        )}
      </div>

      {build.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {build.description}
        </p>
      )}

      {/* Info */}
      <div className="space-y-1 mb-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Цена:</span>
          <span className="font-semibold">{formatPrice(build.totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Компонентов:</span>
          <span className="font-semibold">{getComponentsCount()}</span>
        </div>
        {build.owner && (
          <div className="flex justify-between">
            <span className="text-gray-600">Автор:</span>
            <span className="font-semibold">{build.owner.username}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Создано:</span>
          <span>{formatDate(build.createdAt)}</span>
        </div>
      </div>

      {/* Reactions */}
      {!showActions && build.published && (
        <div className="mb-3 pb-3 border-t border-gray-200 pt-3">
          <BuildReactions 
            buildId={build.id}
            initialLikes={build.likesCount || 0}
            initialDislikes={build.dislikesCount || 0}
          />
        </div>
      )}

      {/* Actions */}
      {showActions ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onView(build)}
            className="btn-secondary text-sm flex items-center justify-center gap-1"
          >
            <Eye size={14} />
            Подробнее
          </button>
          <button
            onClick={() => onEdit(build)}
            className="btn-secondary text-sm flex items-center justify-center gap-1"
          >
            <Edit size={14} />
            Редактировать
          </button>
          <button
            onClick={() => onPublish(build)}
            className={`text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
              build.published
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {build.published ? 'Снять' : 'Опубликовать'}
          </button>
          <button
            onClick={() => onDelete(build)}
            className="text-sm px-3 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 size={14} />
            Удалить
          </button>
        </div>
      ) : (
        <button
          onClick={() => onView(build)}
          className="btn-primary w-full"
        >
          Подробнее
        </button>
      )}
    </div>
  );
}