// src/components/Card.tsx

import React from "react";
interface LoadingProps {
  size?: string;
  margin?: string;
  extraStyles?: string;
}

const Loading: React.FC<LoadingProps> = ({size = "16", margin = "5", extraStyles}) => {
  
  return (
    <div className="flex justify-center items-center">
        <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-gray-900 mt-${margin} mb-${margin} ${extraStyles}`}></div>
    </div>
)
};

export default Loading;
