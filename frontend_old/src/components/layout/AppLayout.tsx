
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type AppLayoutProps = {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
};

export default function AppLayout({
  activePage,
  onNavigate,
  children,
}: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="app-main">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main>{children}</main>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <Sidebar
              activePage={activePage}
              onNavigate={onNavigate}
              mobile
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
