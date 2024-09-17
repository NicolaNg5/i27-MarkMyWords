// src/components/Card.tsx

import React from "react";

const Loading: React.FC = ( ) => {
  
  return (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mt-5 mb-5"></div>
    </div>
)
};

export default Loading;
