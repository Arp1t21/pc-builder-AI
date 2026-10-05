import { useState } from 'react';
import { X, Save, Globe, Info } from 'lucide-react';

// Компонент Tooltip
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SaveBuildModal({ onClose, onSave, totalPrice, componentsCount }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    published: true, // По умолчанию публичная
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите название сборки';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    }

    if (formData.published && !formData.description.trim()) {
      newErrors.description = 'Описание обязательно для публичных сборок';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        published: formData.published,
      });
      onClose();
    } catch (error) {
      console.error('Error saving build:', error);
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Убираем ошибку при изменении поля
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Сохранить сборку</h2>
            <p className="text-sm text-gray-600 mt-1">
              Компонентов: {componentsCount} • Стоимость: {new Intl.NumberFormat('ru-KZ', {
                style: 'currency',
                currency: 'KZT',
                minimumFractionDigits: 0,
              }).format(totalPrice)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={saving}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Название сборки <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Например: Игровая сборка 2024"
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              disabled={saving}
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/100 символов
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание {formData.published && <span className="text-red-500">*</span>}
              </label>
              <Tooltip text="Подробное описание поможет другим пользователям понять преимущества вашей сборки">
                <Info size={16} className="text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Расскажите о вашей сборке: для каких задач, особенности, преимущества..."
              rows={5}
              className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
              disabled={saving}
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 символов
            </p>
          </div>

          {/* Visibility Toggle - Changes color based on checkbox */}
          <div 
            className={`card border transition-colors duration-200 ${
              formData.published 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange('published', e.target.checked)}
                className="mt-1 h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={saving}
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <Globe 
                    size={20} 
                    className={formData.published ? 'text-green-600' : 'text-gray-400'}
                  />
                  <span className="font-semibold text-gray-900">Публичная сборка</span>
                  <Tooltip text="Публичные сборки доступны всем пользователям. Приватные - только вам">
                    <Info size={16} className="text-gray-400 hover:text-gray-600" />
                  </Tooltip>
                </div>
                <p className={`text-sm ${formData.published ? 'text-gray-700' : 'text-gray-500'}`}>
                  Сборка будет доступна всем пользователям в разделе "Публичные сборки"
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              disabled={saving}
            >
              <Save size={20} />
              {saving ? 'Сохранение...' : 'Сохранить сборку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}