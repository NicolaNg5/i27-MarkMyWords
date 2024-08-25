// src/components/DashboardLayout.tsx

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>

    // <div className="relative min-h-screen flex">
    //       <Sidebar />
    //       <div className="flex-1 flex flex-col">
    //           <Header />
    //           <main className="p-8 mt-[64px]">{children}</main> {/* Adjusting for header height */}
    //       </div>
    //   </div>
  );
};

export default DashboardLayout;
