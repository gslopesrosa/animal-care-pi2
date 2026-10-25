
import { Bell, Menu, Search } from 'lucide-react';

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu-button icon-button"
        onClick={onMenuClick}
        aria-label="Abrir menu de navegação"
      >
        <Menu size={23} />
      </button>

      <div className="topbar-search">
        <Search size={19} />
        <input
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar"
        />
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button notification-button"
          aria-label="Notificações (demonstração)"
          title="Notificações"
        >
          <Bell size={21} />
          <span className="notification-dot" />
        </button>

        <div className="user-summary">
          <div className="avatar">M</div>
          <div className="user-info">
            <strong>Maria Silva</strong>
            <span>Tutora</span>
          </div>
        </div>
      </div>
    </header>
  );
}
