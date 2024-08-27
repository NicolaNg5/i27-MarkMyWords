"use client"
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBook, FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const Sidebar: React.FC = () => {
    const router = useRouter();

  const menuItems = [
    { icon: <MdDashboard color="grey"/>, route: "/dashboard" },
    { icon: <IoIosSettings color="grey"/>, route: "/settings" },
    { icon: <FaUsers color="grey"/>, route: "/users" },
    { icon: <FaBook color="grey"/>, route: "/assessment" },
    { icon: "", route: "/create-quiz"},
    { icon: "", route: "/test-supabase"},
    { icon: "", route: "/test-api"},
  ];

  return (
    <nav className="flex flex-col z-0 items-center bg-gray-100 w-16 h-screen" style={{paddingTop:"5em"}}>
        {menuItems.map((item, index) => (
            <Link
          key={index}
          href={item.route}
          className={`p-4 cursor-pointer hover:bg-gray-200`}
        >
            {item.icon}
        </Link>
        ))}
    </nav>
  );
};

export default Sidebar;

