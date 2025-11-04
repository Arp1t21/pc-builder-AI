export const CATEGORIES = [
  { id: 'CPU', name: 'Процессор', icon: '🖥️' },
  { id: 'GPU', name: 'Видеокарта', icon: '🎮' },
  { id: 'RAM', name: 'Оперативная память', icon: '💾' },
  { id: 'Motherboard', name: 'Материнская плата', icon: '⚡' },
  { id: 'SSD', name: 'Накопитель', icon: '💿' },
  { id: 'PSU', name: 'Блок питания', icon: '🔌' },
  { id: 'Case', name: 'Корпус', icon: '📦' },
];

export const formatPrice = (price) => {
  if (!price) return '0 ₸';
  
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};