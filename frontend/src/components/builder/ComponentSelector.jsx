import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import api from '../../api/axios';
import ComponentCard from './ComponentCard';
import { useBuilderStore } from '../../store/builderStore';
import { formatPrice } from '../../utils/constants'; // Добавьте этот импорт

export default function ComponentSelector({ category }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { selectedComponents, setComponent, removeComponent } = useBuilderStore();
  const selectedComponent = selectedComponents[category.id];

  useEffect(() => {
    if (isOpen) {
      loadComponents();
    }
  }, [isOpen, category.id]);

  const loadComponents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/components/category/${category.id}`);
      setComponents(response.data);
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComponents = components.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
            {selectedComponent && (
              <p className="text-sm text-gray-600 truncate max-w-md">
                {selectedComponent.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedComponent && (
            <span className="text-lg font-bold text-primary">
              {formatPrice(selectedComponent.price)}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="text-gray-400" />
          ) : (
            <ChevronDown className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Components List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Загрузка...
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Компоненты не найдены
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onSelect={() => setComponent(category.id, component)}
                  onRemove={() => removeComponent(category.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}