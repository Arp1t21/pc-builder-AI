import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../utils/constants';
import ComponentSelector from '../components/builder/ComponentSelector';
import BuildSummary from '../components/builder/BuildSummary';
import AIAnalysis from '../components/builder/AIAnalysis';
import SaveBuildModal from '../components/builder/SaveBuildModal';
import { useBuilderStore } from '../store/builderStore';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

export default function BuilderPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const { selectedComponents, totalPrice, setAIAnalysis, aiAnalysis, clearBuild } = useBuilderStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    const selectedCount = Object.values(selectedComponents).filter(c => c !== null).length;
    
    if (selectedCount === 0) {
      alert('Выберите хотя бы один компонент для анализа');
      return;
    }

    setAnalyzing(true);
    try {
      // TODO: Реализовать запрос к AI API
      // const response = await api.post('/ai/analyze', {
      //   components: selectedComponents,
      // });
      // setAIAnalysis(response.data);
      
      // Mock data для демонстрации
      const mockAnalysis = {
        score: 8.5,
        overallAssessment: 'Отличная сбалансированная сборка для игр и работы',
        balance: 'Процессор и видеокарта хорошо сбалансированы. Объем оперативной памяти достаточен для большинства задач.',
        recommendations: [
          'Рассмотрите возможность добавления SSD большего объема для игр',
          'Блок питания имеет хороший запас мощности',
          'Материнская плата поддерживает разгон',
        ],
        warnings: [
          'Убедитесь, что видеокарта физически помещается в корпус',
        ],
        useCases: 'Идеально подходит для гейминга в 1440p, стриминга, видеомонтажа и 3D-моделирования',
      };
      setAIAnalysis(mockAnalysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing build:', error);
      alert('Не удалось выполнить анализ');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      if (window.confirm('Для сохранения сборок нужно войти в аккаунт. Перейти на страницу входа?')) {
        navigate('/auth');
      }
      return;
    }

    const selectedCount = Object.values(selectedComponents).filter(c => c !== null).length;
    
    if (selectedCount === 0) {
      alert('Выберите хотя бы один компонент для сохранения');
      return;
    }

    setShowSaveModal(true);
  };

  const handleSave = async (formData) => {
    try {
      const response = await api.post('/builds', {
        name: formData.name,
        description: formData.description,
        componentsJson: JSON.stringify(selectedComponents),
        totalPrice: totalPrice,
        published: formData.published,
      });

      // Показываем успешное уведомление
      alert(`Сборка "${formData.name}" успешно сохранена!`);
      
      // Очищаем конфигуратор
      clearBuild();
      
      // Перенаправляем в профиль
      navigate('/profile');
    } catch (error) {
      console.error('Error saving build:', error);
      const errorMsg = error.response?.data?.error || 'Не удалось сохранить сборку';
      throw new Error(errorMsg);
    }
  };

  const selectedCount = Object.values(selectedComponents).filter(c => c !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Конфигуратор ПК
          </h1>
          <p className="text-gray-600">
            Выберите компоненты для вашего компьютера
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Component Selectors */}
          <div className="lg:col-span-2 space-y-4">
            {CATEGORIES.map((category) => (
              <ComponentSelector key={category.id} category={category} />
            ))}
          </div>

          {/* Right Column - Build Summary */}
          <div className="lg:col-span-1">
            <BuildSummary
              onAnalyze={handleAnalyze}
              onSave={handleSaveClick}
              analyzing={analyzing}
            />
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAnalysis && (
        <AIAnalysis
          analysis={aiAnalysis}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      {/* Save Build Modal */}
      {showSaveModal && (
        <SaveBuildModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
          totalPrice={totalPrice}
          componentsCount={selectedCount}
        />
      )}
    </div>
  );
}