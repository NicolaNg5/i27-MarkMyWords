// src/components/Card.tsx

import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  color: string;
  icon: string;
  link: string; 
}

const Card: React.FC<CardProps> = ({ title, color, icon, link }) => {
    return (
      <Link href={link}>
        <div
          className={`${color} rounded-lg shadow-md p-6 flex items-center justify-center text-black text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl duration-300`}
          style={{ minHeight: "150px" }}
        >
          <div>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-semibold">{title}</div>
          </div>
        </div>
      </Link>
    );
};

export default Card;
