
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between z-10 items-center p-4 bg-primary text-white">
      <div className="text-lg font-semibold">Mark My Words</div>
      <div className="flex items-center">
        <a href="#" className="mr-4 text-sm">
          User Guides
        </a>
        <div className="flex items-center">
          <span className="mr-2">Username</span>
          <div className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
