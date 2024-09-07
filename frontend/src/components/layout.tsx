// src/components/layout.tsx

import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-white">
          <SideBar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
