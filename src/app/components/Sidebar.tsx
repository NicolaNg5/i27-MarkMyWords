// src/components/Sidebar.tsx
"use client"; // This is a client component 👈🏽

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
    const router = useRouter();

  const menuItems = [
    { icon: "📄", route: "/dashboard" },
    { icon: "⚙️", route: "/settings" },
    { icon: "👥", route: "/users" },
    { icon: "📋", route: "/Assessment" },
  ];

  return (
    <nav className="flex flex-col z-0 items-center bg-gray-100 w-16 h-screen">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.route}
          className={`p-4 cursor-pointer hover:bg-gray-200`}
        >
          <span role="img" aria-label="icon" className="text-2xl">
            {item.icon}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
