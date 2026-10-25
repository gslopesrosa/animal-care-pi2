
import {
  LayoutDashboard,
  PawPrint,
  Syringe,
  Pill,
  CalendarDays,
  UserRound,
  Heart,
} from 'lucide-react';

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
  mobile?: boolean;
  onClose?: () => void;
};

const menuItems = [
  { label: 'Início', icon: LayoutDashboard },
  { label: 'Meus pets', icon: PawPrint },
  { label: 'Vacinação', icon: Syringe },
  { label: 'Medicamentos', icon: Pill },
  { label: 'Consultas', icon: CalendarDays },
  { label: 'Meu perfil', icon: UserRound },
];

export default function Sidebar({
  activePage,
  onNavigate,
  mobile = false,
  onClose,
}: SidebarProps) {
  function handleNavigate(page: string) {
    onNavigate(page);
    onClose?.();
  }

  return (
    <aside className={`sidebar ${mobile ? 'sidebar-mobile' : ''}`}>
      <button
        className="brand"
        onClick={() => handleNavigate('Início')}
        aria-label="Ir para o início"
      >
        <span className="brand-icon">
          <PawPrint size={27} />
        </span>

        <span className="brand-name">
          Animal <strong>Care</strong>
        </span>
      </button>

      <p className="menu-caption">MENU PRINCIPAL</p>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {menuItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${
              activePage === label ? 'nav-item-active' : ''
            }`}
            onClick={() => handleNavigate(label)}
            aria-current={activePage === label ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-tip">
        <Heart size={21} />
        <strong>Cuidar é um ato de amor.</strong>
        <p>Pequenos cuidados fazem uma grande diferença.</p>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <span>Animal Care</span>
        <span className="version">v1.0</span>
      </div>
    </aside>
  );
}
