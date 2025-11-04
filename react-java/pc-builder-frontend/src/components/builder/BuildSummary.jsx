import { Save, Sparkles, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/constants';
import { useBuilderStore } from '../../store/builderStore';

export default function BuildSummary({ onAnalyze, onSave, analyzing }) {
  const { selectedComponents, totalPrice, clearBuild } = useBuilderStore();

  const selectedCount = Object.values(selectedComponents).filter(
    (comp) => comp !== null
  ).length;

  return (
    <div className="card sticky top-20">
      <h3 className="text-xl font-bold mb-4">Итого</h3>

      {/* Selected Components Summary */}
      <div className="space-y-3 mb-6">
        {Object.entries(selectedComponents).map(([category, component]) => (
          <div key={category} className="flex justify-between text-sm">
            <span className="text-gray-600">{category}:</span>
            <span className="font-medium text-gray-900">
              {component ? formatPrice(component.price) : '—'}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Общая стоимость:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Выбрано компонентов: {selectedCount} из 7
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onAnalyze}
          disabled={selectedCount === 0 || analyzing}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={20} />
          {analyzing ? 'Анализируем...' : 'Получить AI-анализ'}
        </button>

        <button
          onClick={onSave}
          disabled={selectedCount === 0}
          className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          Сохранить сборку
        </button>

        <button
          onClick={clearBuild}
          disabled={selectedCount === 0}
          className="w-full text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={20} />
          Очистить
        </button>
      </div>
    </div>
  );
}