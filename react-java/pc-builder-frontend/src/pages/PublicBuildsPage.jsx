import { useState } from 'react';
import PublicBuilds from '../components/builds/PublicBuilds';
import BuildDetailsModal from '../components/builds/BuildDetailsModal';

export default function PublicBuildsPage() {
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewBuild = (build) => {
    setSelectedBuild(build);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Публичные сборки
          </h1>
          <p className="text-gray-600">
            Исследуйте конфигурации компьютеров от нашего сообщества
          </p>
        </div>

        {/* Public Builds Component */}
        <PublicBuilds onView={handleViewBuild} />
      </div>

      {/* Build Details Modal */}
      {showDetails && selectedBuild && (
        <BuildDetailsModal
          build={selectedBuild}
          onClose={() => {
            setShowDetails(false);
            setSelectedBuild(null);
          }}
        />
      )}
    </div>
  );
}