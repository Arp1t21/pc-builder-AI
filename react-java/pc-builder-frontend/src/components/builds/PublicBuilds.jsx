import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import BuildCard from './BuildCard';

export default function PublicBuilds({ onView }) {
  const [builds, setBuilds] = useState([]);
  const [filteredBuilds, setFilteredBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    loadPublicBuilds();
  }, []);

  useEffect(() => {
    filterBuilds();
  }, [searchQuery, priceFilter, builds]);

  const loadPublicBuilds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/builds/public');
      setBuilds(response.data);
    } catch (err) {
      console.error('Error loading public builds:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBuilds = () => {
    let filtered = [...builds];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (build) =>
          build.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          build.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter((build) => {
        const price = build.totalPrice || 0;
        switch (priceFilter) {
          case 'budget':
            return price < 250000;
          case 'mid':
            return price >= 250000 && price < 500000;
          case 'high':
            return price >= 500000 && price < 1000000;
          case 'ultra':
            return price >= 1000000;
          default:
            return true;
        }
      });
    }

    setFilteredBuilds(filtered);
  };

  const handleView = (build) => {
    if (onView) {
      onView(build);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Загрузка публичных сборок...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Price Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">Все цены</option>
              <option value="budget">До 250 000 ₸ (Бюджет)</option>
              <option value="mid">250 000 - 500 000 ₸ (Средний)</option>
              <option value="high">500 000 - 1 000 000 ₸ (Высокий)</option>
              <option value="ultra">От 1 000 000 ₸ (Премиум)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredBuilds.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Сборки не найдены</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Найдено сборок: {filteredBuilds.length}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuilds.map((build) => (
              <BuildCard
                key={build.id}
                build={build}
                showActions={false}
                onView={handleView}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}