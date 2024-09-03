// components/ViewSelectionButtons.tsx
import React from 'react';

interface ViewSelectionButtonsProps {
  isStudentView: boolean;
  selectedView: 'Performance Trend' | 'Area of Difficulty' | 'Score Distribution' | 'Class Ranking';
  setSelectedView: (view: 'Performance Trend' | 'Area of Difficulty' | 'Score Distribution' | 'Class Ranking') => void;
}

const ViewSelectionButtons: React.FC<ViewSelectionButtonsProps> = ({ isStudentView, selectedView, setSelectedView }) => {
  return (
    <div className="flex justify-center mb-6 space-x-4">
      {isStudentView ? (
        <>
          <button
            className={`px-4 py-2 rounded-lg ${selectedView === 'Performance Trend' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedView('Performance Trend')}
          >
            Performance Trend
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedView === 'Area of Difficulty' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedView('Area of Difficulty')}
          >
            Area of Difficulty
          </button>
        </>
      ) : (
        <>
          <button
            className={`px-4 py-2 rounded-lg ${selectedView === 'Score Distribution' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedView('Score Distribution')}
          >
            Score Distribution
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedView === 'Class Ranking' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedView('Class Ranking')}
          >
            Class Ranking
          </button>
        </>
      )}
    </div>
  );
};

export default ViewSelectionButtons;
