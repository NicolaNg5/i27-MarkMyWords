// src/components/Card.tsx

import Link from "next/link";
import React from "react";

interface CardProps {
  title: string;
  color: string;
  icon: any;
  link?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, color, icon, link, onClick }) => {
  const cardContent = (
    <div
      className={`${color} rounded-lg shadow-md p-6 flex items-center justify-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl duration-300`}
      style={{ minHeight: "150px" }}
      onClick={onClick || (() => {})}
    >
      <div className="flex-col text flex items-center justify-center" >
        <div className="text-3xl mb-2">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
    </div>
  );

  return link ? (
    <Link href={link}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default Card;
