export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PC Builder</h3>
            <p className="text-gray-400 text-sm">
              Платформа для создания идеальной конфигурации ПК с AI-анализом
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/builder" className="hover:text-white">Конфигуратор</a></li>
              <li><a href="/public-builds" className="hover:text-white">Публичные сборки</a></li>
              <li><a href="/profile" className="hover:text-white">Профиль</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">О проекте</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Социальные сети</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Telegram</a></li>
              <li><a href="#" className="hover:text-white">VK</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 PC Builder. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}