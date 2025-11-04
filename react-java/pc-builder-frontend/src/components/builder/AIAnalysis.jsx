import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function AIAnalysis({ analysis, onClose }) {
  if (!analysis) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">AI-Анализ сборки</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="card bg-gradient-to-r from-primary to-orange-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Общая оценка</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">
                {analysis.score || 'N/A'}/10
              </div>
              <p className="text-white/90">
                {analysis.overallAssessment || 'Сборка проанализирована'}
              </p>
            </div>
          </div>

          {/* Balance Analysis */}
          {analysis.balance && (
            <div className="card border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <Info className="text-blue-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Баланс системы
                  </h4>
                  <p className="text-gray-700">{analysis.balance}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="card border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24} />
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Рекомендации
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings/Issues */}
          {analysis.warnings && analysis.warnings.length > 0 && (
            <div className="card border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" size={24} />
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Предупреждения
                  </h4>
                  <ul className="space-y-2">
                    {analysis.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">⚠</span>
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Use Cases */}
          {analysis.useCases && (
            <div className="card bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">
                Рекомендуемое использование
              </h4>
              <p className="text-gray-700">{analysis.useCases}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button onClick={onClose} className="w-full btn-primary">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}