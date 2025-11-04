import { useState } from 'react';
import { X, Save, User as UserIcon, Mail, FileText, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

// Функция для сжатия изображения
const compressImage = (file, maxWidth = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Масштабируем если изображение больше maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в Base64 с сжатием
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    email: user.email || '',
    bio: user.bio || '',
    avatarUrl: user.avatarUrl || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Размер файла не должен превышать 10MB');
      return;
    }

    setAvatarFile(file);
    
    try {
      // Создаем превью (сжатое)
      const compressedImage = await compressImage(file);
      setAvatarPreview(compressedImage);
      setError('');
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Не удалось обработать изображение');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.bio.length > 500) {
      setError('Описание не должно превышать 500 символов');
      return;
    }

    setSaving(true);
    try {
      let avatarUrl = formData.avatarUrl;
      
      // Если есть новый файл аватара, сжимаем и сохраняем
      if (avatarFile) {
        setUploading(true);
        try {
          // Сжимаем изображение до 400x400 с качеством 0.8
          avatarUrl = await compressImage(avatarFile, 400, 0.8);
        } catch (err) {
          setError('Не удалось обработать изображение. Попробуйте другой файл.');
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Сохраняем профиль
      await api.put('/users/me', {
        email: formData.email,
        bio: formData.bio,
        avatarUrl,
      });
      
      onUpdate();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Не удалось обновить профиль';
      setError(errorMsg);
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Редактировать профиль</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={saving || uploading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} />
                Аватар
              </div>
            </label>
            
            <div className="flex items-center gap-4">
              {/* Avatar Preview */}
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={40} className="text-gray-400" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-grow">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <Upload size={18} />
                  Загрузить фото
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={saving || uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG или GIF. Максимум 10MB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Изображение будет автоматически сжато
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                Email
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="input-field"
              disabled={saving || uploading}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                О себе
              </div>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Расскажите о себе, своих интересах и опыте..."
              rows={4}
              maxLength={500}
              className="input-field resize-none"
              disabled={saving || uploading}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio.length}/500 символов
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={saving || uploading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              disabled={saving || uploading}
            >
              <Save size={20} />
              {uploading ? 'Обработка изображения...' : saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}