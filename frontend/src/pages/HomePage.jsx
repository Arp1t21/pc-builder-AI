import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Конструктор ПК',
      description: 'Создайте свою идеальную конфигурацию с проверкой совместимости'
    },
    {
      title: 'Проверка совместимости',
      description: 'Автоматическая проверка совместимости компонентов'
    },
    {
      title: 'Публичные сборки',
      description: 'Делитесь своими сборками и смотрите работы других'
    },
    {
      title: 'Калькулятор цен',
      description: 'Подсчет общей стоимости вашей конфигурации'
    },
    {
      title: 'Сообщество',
      description: 'Общайтесь с другими энтузиастами ПК'
    },
    {
      title: 'Рейтинги',
      description: 'Оценивайте сборки и получайте обратную связь'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-2xl">
              <Cpu className="text-white" size={64} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Создайте свой идеальный ПК
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Мощный конструктор для создания конфигураций компьютеров
            с проверкой совместимости и калькулятором цен
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/builder')}
              className="btn-primary text-lg px-8 py-4"
            >
              Начать сборку
            </button>
            <button
              onClick={() => navigate('/builds')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Смотреть сборки
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-gradient-to-r from-primary to-primary-dark text-white">
            <h2 className="text-3xl font-bold mb-4">
              Готовы создать свою сборку?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Присоединяйтесь к тысячам пользователей, которые уже создали свои идеальные конфигурации
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}