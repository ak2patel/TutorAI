'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Sidebar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '100%', minWidth: 0 }}>
        <Header />
        
        <div style={{ flex: 1, padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
