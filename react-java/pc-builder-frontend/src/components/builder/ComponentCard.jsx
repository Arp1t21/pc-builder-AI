import { Plus, Check, X } from 'lucide-react';
import { formatPrice } from '../../utils/constants';

export default function ComponentCard({ component, isSelected, onSelect, onRemove }) {
  return (
    <div
      className={`card hover:shadow-md transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {component.imageUrl ? (
            <img
              src={component.imageUrl}
              alt={component.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-3xl">📦</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {component.name}
              </h3>
              {component.brand && (
                <p className="text-sm text-gray-500">{component.brand}</p>
              )}
            </div>
            {isSelected ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            ) : (
              <button className="p-2 text-primary hover:bg-orange-50 rounded-lg transition-colors">
                <Plus size={20} />
              </button>
            )}
          </div>

          {/* Specs */}
          {component.specs && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {component.specs}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(component.price)}
            </span>
            {isSelected && (
              <span className="flex items-center text-sm text-green-600 font-medium">
                <Check size={16} className="mr-1" />
                Выбрано
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}