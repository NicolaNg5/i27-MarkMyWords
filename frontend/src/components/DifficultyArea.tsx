import React from 'react';

interface DifficultyAreaProps {
  difficulty: 'HARD' | 'MEDIUM' | 'EASY';
  incorrectCount: number;
}

const DifficultyArea: React.FC<DifficultyAreaProps> = ({ difficulty, incorrectCount }) => {
  // Adjust the oval size based on incorrectCount
  const size = incorrectCount * 20; // Example size calculation

  const getColor = () => {
    if (incorrectCount==0) {return 'bg-gray-200'}
    else {
        switch (difficulty) {
        case 'HARD':
            return 'bg-red-500';
        case 'MEDIUM':
            return 'bg-orange-400';
        case 'EASY':
            return 'bg-green-400';
        default:
            return 'bg-gray-200';
        }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center ${getColor()} rounded-full mb-2`}
        style={{ width: `${size+70}px`, height: `50px` }}
      >
        <span className="text-white font-bold">{difficulty}</span>
      </div>
    </div>
  );
};

export default DifficultyArea;
