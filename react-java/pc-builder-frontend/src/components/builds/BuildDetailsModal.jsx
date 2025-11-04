import { X } from 'lucide-react';
import BuildReactions from './BuildReactions';

export default function BuildDetailsModal({ build, onClose }) {
  if (!build) return null;

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
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getComponents = () => {
    try {
      return JSON.parse(build.componentsJson || '{}');
    } catch {
      return {};
    }
  };

  const components = getComponents();

  const categoryNames = {
    cpu: 'Процессор',
    motherboard: 'Материнская плата',
    ram: 'Оперативная память',
    gpu: 'Видеокарта',
    storage: 'Накопитель',
    psu: 'Блок питания',
    case: 'Корпус',
    cooling: 'Охлаждение',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div className="flex-grow pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {build.name || 'Без названия'}
            </h2>
            {build.description && (
              <p className="text-gray-600">{build.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg text-sm">
            {build.owner && (
              <div>
                <p className="text-gray-500 mb-1">Автор</p>
                <p className="font-semibold">{build.owner.username}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 mb-1">Создано</p>
              <p className="font-semibold">{formatDate(build.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Общая стоимость</p>
              <p className="font-semibold text-primary">{formatPrice(build.totalPrice)}</p>
            </div>
          </div>

          {/* Reactions */}
          {build.published && (
            <div className="mb-6">
              <BuildReactions 
                buildId={build.id}
                initialLikes={build.likesCount || 0}
                initialDislikes={build.dislikesCount || 0}
              />
            </div>
          )}

          {/* Components */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Компоненты</h3>
            
            {Object.keys(components).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Компоненты не добавлены</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(components).map(([category, component]) => {
                  if (!component || !component.name) return null;
                  
                  return (
                    <div
                      key={category}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <p className="text-xs text-gray-500 mb-1">
                            {categoryNames[category] || category}
                          </p>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {component.name}
                          </h4>
                          
                          {component.specs && (
                            <div className="text-sm text-gray-600">
                              {Object.entries(component.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-1 border-t border-gray-100">
                                  <span className="text-gray-500">{key}:</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="font-bold text-primary">
                            {formatPrice(component.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mt-6 p-4 bg-primary text-white rounded-lg flex justify-between items-center">
            <span className="text-lg font-semibold">Итоговая стоимость:</span>
            <span className="text-2xl font-bold">{formatPrice(build.totalPrice)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}