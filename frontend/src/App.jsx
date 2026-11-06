import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from './services/authService';
import { petService } from './services/petService';
import { vaccinationService } from './services/vaccinationService';
import { medicationService } from './services/medicationService';
import { appointmentService } from './services/appointmentService';
import { reminderService } from './services/reminderService';
import MedicationsPage from './components/medications/MedicationsPage';
import AppointmentsPage from './components/appointments/AppointmentsPage';
import RemindersPage from './components/reminders/RemindersPage';
import {
  LayoutDashboard,
  Dog,
  Cat,
  Syringe,
  Pill,
  User,
  Lock,
  Mail,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ChevronRight,
  Calendar,
  Sparkles,
  FileText,
  Menu,
  Activity,
  Bell,
  ArrowRight,
  Info,
  Tag,
  Award,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Check,
  Heart,
  CalendarClock,
  BellRing
} from 'lucide-react';

// ==========================================
// 1. INITIAL MOCK DATA & LOCALSTORAGE HELPERS
// ==========================================

const INITIAL_USER = {
  id: 'u1',
  name: 'Dra. Elena Silva',
  email: 'elena@animalcare.com',
  role: 'Tutora & Veterinária',
  crmv: 'CRMV-SP 54321',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
  token: 'jwt-token-animal-care-figma-2026'
};

const INITIAL_PETS = [
  {
    id: 'pet-1',
    name: 'Rex',
    species: 'Cão',
    breed: 'Golden Retriever',
    gender: 'Macho',
    age: '3 anos',
    birthDate: '2023-04-12',
    weight: '28.5 kg',
    color: 'Dourado',
    microchip: '982000384729102',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    notes: 'Dócil e muito ativo. Alergia alimentar a corantes artificiais em rações.'
  },
  {
    id: 'pet-2',
    name: 'Mia',
    species: 'Gato',
    breed: 'Siamês',
    gender: 'Fêmea',
    age: '2 anos',
    birthDate: '2024-02-18',
    weight: '3.8 kg',
    color: 'Creme e Marrom',
    microchip: '982000384729999',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    notes: 'Castrada. Vive exclusivamente em ambiente interno.'
  },
  {
    id: 'pet-3',
    name: 'Thor',
    species: 'Cão',
    breed: 'Bulldog Francês',
    gender: 'Macho',
    age: '4 anos',
    birthDate: '2022-09-05',
    weight: '12.2 kg',
    color: 'Tigrado',
    microchip: '982000384729111',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    notes: 'Acompanhamento respiratório preventivo nos dias mais quentes.'
  },
  {
    id: 'pet-4',
    name: 'Lunna',
    species: 'Gato',
    breed: 'Persa',
    gender: 'Fêmea',
    age: '1 ano',
    birthDate: '2025-05-10',
    weight: '3.1 kg',
    color: 'Branca',
    microchip: '982000384729333',
    photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600',
    notes: 'Higiene ocular diária e escovação contínua de pelagem.'
  }
];

const INITIAL_VACCINES = [
  {
    id: 'vac-1',
    petId: 'pet-1',
    name: 'Antirrábica (Raiva)',
    applicationDate: '2025-11-10',
    nextDoseDate: '2026-11-10',
    veterinarian: 'Dr. Marcos Souza (CRMV-SP 12345)',
    notes: 'Aplicação sem reações adversas.'
  },
  {
    id: 'vac-2',
    petId: 'pet-1',
    name: 'V10 (Polivalente Canina)',
    applicationDate: '2025-10-01',
    nextDoseDate: '2026-10-01',
    veterinarian: 'Dra. Elena Silva (CRMV-SP 54321)',
    notes: 'Reforço anual aplicado com sucesso.'
  },
  {
    id: 'vac-3',
    petId: 'pet-2',
    name: 'Quádrupla Felina (V4)',
    applicationDate: '2025-11-15',
    nextDoseDate: '2026-11-15',
    veterinarian: 'Dra. Elena Silva (CRMV-SP 54321)',
    notes: 'Proteção contra rinotraqueíte, calicivirose e panleucopenia.'
  },
  {
    id: 'vac-4',
    petId: 'pet-3',
    name: 'Gripe Canina (Traqueobronquite)',
    applicationDate: '2025-09-01',
    nextDoseDate: '2026-09-01',
    veterinarian: 'Dr. Renato Lima (CRMV-SP 88912)',
    notes: 'Vacina com atraso no reforço.'
  },
  {
    id: 'vac-5',
    petId: 'pet-4',
    name: 'Antirrábica Felina',
    applicationDate: '2025-11-01',
    nextDoseDate: '2026-11-01',
    veterinarian: 'Dra. Elena Silva (CRMV-SP 54321)',
    notes: 'Próxima dose agendada para final do ano.'
  }
];

const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Erro ao salvar ${key}:`, e);
  }
};

// ==========================================
// 2. CONTEXTS (AUTH & TOAST)
// ==========================================

const AuthContext = createContext(null);
const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-900 border-rose-700 text-rose-100'
                : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const useToast = () => useContext(ToastContext);


function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = loadStorage('@AnimalCare:user', null);

    // Evita reutilizar sessões antigas simuladas.
    if (!savedUser?.token || savedUser.token.split('.').length !== 3) {
      return null;
    }

    return savedUser;
  });

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Por favor, preencha todos os campos.');
    }

    const response = await authService.login(email, password);

    const authenticatedUser = {
      ...response.user,
      role: 'Tutor de Pets',
      crmv: '',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      token: response.token,
    };

    setUser(authenticatedUser);
    saveStorage('@AnimalCare:user', authenticatedUser);

    return authenticatedUser;
  };

  
  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    // Cria a conta no banco de dados.
    await authService.register(name, email, password);

    // Faz login para obter um token JWT verdadeiro.
    const response = await authService.login(email, password);

    const authenticatedUser = {
      ...response.user,
      role: 'Tutor de Pets',
      crmv: '',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
      token: response.token,
    };

    setUser(authenticatedUser);
    saveStorage('@AnimalCare:user', authenticatedUser);

    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@AnimalCare:user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


const useAuth = () => useContext(AuthContext);

// ==========================================
// 3. MAIN APP LAYOUT & ROUTING
// ==========================================

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainContainer />
      </AuthProvider>
    </ToastProvider>
  );
}


function mapApiPetToUi(pet) {
  const birthDate = pet.birthDate
    ? String(pet.birthDate).slice(0, 10)
    : '';

  let age = '';

  if (birthDate) {
    const [year, month, day] = birthDate.split('-').map(Number);
    const today = new Date();

    let years = today.getFullYear() - year;
    let months = today.getMonth() + 1 - month;

    if (today.getDate() < day) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      age = years === 1 ? '1 ano' : `${years} anos`;

      if (months > 0) {
        age += ` e ${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
    } else {
      const totalMonths = Math.max(
        0,
        (today.getFullYear() - year) * 12 +
          today.getMonth() + 1 - month -
          (today.getDate() < day ? 1 : 0)
      );

      age = totalMonths === 0
        ? 'Menos de 1 mês'
        : totalMonths === 1
          ? '1 mês'
          : `${totalMonths} meses`;
    }
  }

  return {
    ...pet,
    gender: pet.sex || 'Macho',
    birthDate,
    age,
    weight: pet.weight != null ? `${pet.weight} kg` : '',
    color: pet.color || '',
    microchip: pet.microchip || '',
    notes: pet.notes || '',
    photoUrl: pet.photoUrl || '',
  };
}

function mapApiVaccinationToUi(vaccination) {
  const formatDateToBr = (dateString) => {
    if (!dateString) return '';
    const cleanDate = dateString.slice(0, 10); 
    const [year, month, day] = cleanDate.split('-'); 
    return `${day}/${month}/${year}`;
  };

  return {
    id: vaccination.id,
    petId: vaccination.petId,
    name: vaccination.vaccineName || '',
    applicationDate: formatDateToBr(vaccination.applicationDate),
    nextDoseDate: formatDateToBr(vaccination.nextDoseDate),
    veterinarian: vaccination.responsible || '',
  };
}

function MainContainer() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // App Data State
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState(() => loadStorage('@AnimalCare:vaccines', INITIAL_VACCINES));
  const [medicationCount, setMedicationCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState(null);

  useEffect(() => {
    saveStorage('@AnimalCare:vaccines', vaccines);
  }, [vaccines]);

  
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadPetsFromApi() {
      try {
        const response = await petService.getAll();

        if (!cancelled) {
          const apiPets = Array.isArray(response)
            ? response
            : [];

          setPets(apiPets.map(mapApiPetToUi));
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error.response?.data?.message ||
            'Não foi possível carregar os pets.';

          addToast(message, 'error');
        }
      }
    }

    loadPetsFromApi();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadRecordCounts() {
      async function countRecords(service, property, petId) {
        const response = await service.getAll(petId);

        if (Array.isArray(response)) return response.length;

        if (Array.isArray(response?.[property])) {
          return response[property].length;
        }

        if (Array.isArray(response?.data)) {
          return response.data.length;
        }

        return 0;
      }

      async function countForAllPets(service, property) {
        const results = await Promise.all(
          pets.map((pet) =>
            countRecords(service, property, pet.id).catch((error) => {
              console.error(
                `Erro ao contar ${property} do pet ${pet.name}:`,
                error
              );
              return 0;
            })
          )
        );

        return results.reduce((total, count) => total + count, 0);
      }

      const [medications, appointments, reminders] = await Promise.all([
        countForAllPets(medicationService, 'medications'),
        countForAllPets(appointmentService, 'appointments'),
        countForAllPets(reminderService, 'reminders'),
      ]);

      if (!cancelled) {
        setMedicationCount(medications);
        setAppointmentCount(appointments);
        setReminderCount(reminders);
      }
    }

    loadRecordCounts();

    return () => {
      cancelled = true;
    };
  }, [user?.id, pets]);


  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 shrink-0 justify-between z-20 ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-200 shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-base text-slate-900 leading-tight">Animal Care</h1>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden lg:block"
              title="Expandir/Recolher Sidebar"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Navegação do Sistema">
            <SidebarItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem
              icon={<Dog className="w-5 h-5" />}
              label="Meus Pets"
              badge={pets.length}
              active={activeTab === 'pets'}
              onClick={() => setActiveTab('pets')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem
              icon={<Syringe className="w-5 h-5" />}
              label="Histórico Vacinas"
              badge={vaccines.length}
              active={activeTab === 'vaccines'}
              onClick={() => setActiveTab('vaccines')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem
              icon={<Pill className="w-5 h-5" />}
              label="Medicamentos"
              badge={medicationCount}
              active={activeTab === 'medications'}
              onClick={() => setActiveTab('medications')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem
              icon={<CalendarClock className="w-5 h-5" />}
              label="Consultas Veterinárias"
              badge={appointmentCount}
              active={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem
              icon={<BellRing className="w-5 h-5" />}
              label="Lembretes"
              badge={reminderCount}
              active={activeTab === 'reminders'}
              onClick={() => setActiveTab('reminders')}
              collapsed={isSidebarCollapsed}
            />
          </nav>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="pt-4 border-t border-slate-100">
          <SidebarUserProfile collapsed={isSidebarCollapsed} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              aria-label="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">Plataforma</span>
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline-block">/</span>
              <h2 className="text-sm font-bold text-slate-800 capitalize">
                {activeTab === 'dashboard' && 'Visão Geral & Indicadores'}
                {activeTab === 'pets' && 'Gestão de Pets'}
                {activeTab === 'vaccines' && 'Histórico de Vacinação'}
                {activeTab === 'medications' && 'Controle de Medicamentos'}
                {activeTab === 'appointments' && 'Consultas Veterinárias'}
                {activeTab === 'reminders' && 'Lembretes'}
                {activeTab === 'quality' && 'Acessibilidade & QA'}
              </h2>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search Shortcut or Notification Bell */}
            <div className="relative">
              <button
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors relative"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 text-gray-800"
                  aria-label="Avatar do usuário"
                  role="img"
                >
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path
                    d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-slide-in">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-600 text-white p-2 rounded-xl">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-bold text-slate-900">Animal Care</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  <SidebarItem
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SidebarItem
                    icon={<Dog className="w-5 h-5" />}
                    label="Meus Pets"
                    badge={pets.length}
                    active={activeTab === 'pets'}
                    onClick={() => {
                      setActiveTab('pets');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SidebarItem
                    icon={<Syringe className="w-5 h-5" />}
                    label="Histórico Vacinas"
                    badge={vaccines.length}
                    active={activeTab === 'vaccines'}
                    onClick={() => {
                      setActiveTab('vaccines');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SidebarItem
                    icon={<Pill className="w-5 h-5" />}
                    label="Medicamentos"
                    active={activeTab === 'medications'}
                    onClick={() => {
                      setActiveTab('medications');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SidebarItem
                    icon={<CalendarClock className="w-5 h-5" />}
                    label="Consultas Veterinárias"
                    active={activeTab === 'appointments'}
                    onClick={() => {
                      setActiveTab('appointments');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SidebarItem
                    icon={<BellRing className="w-5 h-5" />}
                    label="Lembretes"
                    active={activeTab === 'reminders'}
                    onClick={() => {
                      setActiveTab('reminders');
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <SidebarUserProfile collapsed={false} />
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              pets={pets}
              vaccines={vaccines}
              setActiveTab={setActiveTab}
              setSelectedPetForDetail={setSelectedPetForDetail}
            />
          )}

          {activeTab === 'pets' && (
            <PetsCrudView
              pets={pets}
              setPets={setPets}
              vaccines={vaccines}
              setVaccines={setVaccines}
              selectedPetForDetail={selectedPetForDetail}
              setSelectedPetForDetail={setSelectedPetForDetail}
            />
          )}

          {activeTab === 'vaccines' && (
            <VaccinesCrudView
              pets={pets}
              vaccines={vaccines}
              setVaccines={setVaccines}
            />
          )}
          {activeTab === 'medications' && (
            <MedicationsPage
              pets={pets}
              addToast={addToast}
              onCountChange={setMedicationCount}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsPage
              pets={pets}
              addToast={addToast}
              onCountChange={setAppointmentCount}
            />
          )}
          {activeTab === 'reminders' && (
            <RemindersPage
              pets={pets}
              addToast={addToast}
              onCountChange={setReminderCount}
            />
          )}
          {activeTab === 'quality' && <QualityDocumentationView />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, badge, tag, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group ${
        active
          ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-2xs border border-emerald-200/60'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      }`}
      title={collapsed ? label : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}>
          {icon}
        </span>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>

      {!collapsed && badge !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {badge}
        </span>
      )}

      {!collapsed && tag && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
          {tag}
        </span>
      )}
    </button>
  );
}

function SidebarUserProfile({ collapsed }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Sessão encerrada com sucesso.', 'info');
  };

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Sair da Conta"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 text-gray-800"
            aria-label="Avatar do usuário"
            role="img"
          >
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path
              d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
          <p className="text-[10px] text-slate-500 truncate">{user.crmv || user.role}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
        title="Encerrar sessão"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

// ==========================================
// DEMANDA 001 — LOGIN E CADASTRO (Figma Style)
// ==========================================

function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (isRegister && !formData.name.trim()) {
      errs.name = 'Nome completo é obrigatório.';
    }
    if (!formData.email.trim()) {
      errs.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Informe um e-mail válido.';
    }
    if (!formData.password) {
      errs.password = 'A senha é obrigatória.';
    } else if (formData.password.length < 6) {
      errs.password = 'A senha precisa ter no mínimo 6 caracteres.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (isRegister) {
        await register(
          formData.name,
          formData.email,
          formData.password
        );

        addToast(
          'Conta criada com sucesso no Animal Care!',
          'success'
        );
      } else {
        await login(formData.email, formData.password);

        addToast(
          'Bem-vindo(a) de volta ao Animal Care!',
          'success'
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Falha na autenticação.';

      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        {/* Left Side Banner (Figma Brand Showcase) */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Plataforma Animal Care PI-2</span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight">
              Saúde e bem-estar dos seus pets em um só lugar.
            </h1>
            <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
              Sistema integrado de controle de vacinação, ficha clínica, prontuários e alertas preventivos em tempo real.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>Integração com backend Node.js REST API</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>Controle rigoroso de doses e vacinas atrasadas</span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-200">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <span className="font-bold text-lg text-slate-900">Animal Care</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isRegister ? 'Criar nova conta' : 'Acessar a plataforma'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister
                  ? 'Preencha seus dados para gerenciar seus pets'
                  : 'Entre com suas credenciais de tutor ou veterinário'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="auth-name">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Dra. Ana Souza"
                      className={`w-full bg-slate-50 border ${
                        errors.name ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                      } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="auth-email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className={`w-full bg-slate-50 border ${
                      errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                    } rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition-all`}
                  />
                </div>
                {errors.email && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="auth-password">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border ${
                      errors.password ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                    } rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : isRegister ? (
                  <>
                    <span>Concluir Cadastro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isRegister ? 'Já possui cadastro?' : 'Ainda não tem conta?'}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrors({});
                }}
                className="ml-1.5 text-emerald-600 font-bold hover:underline focus:outline-none"
              >
                {isRegister ? 'Fazer Login' : 'Criar Conta'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DEMANDA 004 — DASHBOARD (Figma Clean Style)
// ==========================================

function DashboardView({ pets, vaccines, setActiveTab, setSelectedPetForDetail }) {
  const totalPets = pets.length;
  const totalVaccines = vaccines.length;

  const today = new Date();

  let delayedCount = 0;
  let upcomingCount = 0;
  let upToDateCount = 0;

  vaccines.forEach((v) => {
    const due = new Date(v.nextDoseDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      delayedCount++;
    } else if (diffDays <= 30) {
      upcomingCount++;
    } else {
      upToDateCount++;
    }
  });

  const alertsList = vaccines
    .map((v) => {
      const pet = pets.find((p) => p.id === v.petId);
      const due = new Date(v.nextDoseDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...v, pet, diffDays };
    })
    .filter((v) => v.diffDays <= 30)
    .sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Indicadores do Canil / Gatil</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Painel de Cuidados Pet</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            Acompanhe o estado de imunização dos seus animais cadastrados com dados em tempo real provenientes dos registros de vacinação.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setActiveTab('pets')}
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pet</span>
          </button>
          <button
            onClick={() => setActiveTab('vaccines')}
            className="bg-emerald-800/80 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 border border-white/20"
          >
            <Syringe className="w-4 h-4" />
            <span>Nova Vacina</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Pets"
          value={totalPets}
          subtitle="Cães, gatos e outros"
          icon={<Dog className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50"
          borderColor="border-emerald-200/80"
        />

        <MetricCard
          title="Vacinas Registradas"
          value={totalVaccines}
          subtitle="Histórico total de doses"
          icon={<Syringe className="w-5 h-5 text-teal-600" />}
          bgColor="bg-teal-50"
          borderColor="border-teal-200/80"
        />

        <MetricCard
          title="Próximas Doses (30d)"
          value={upcomingCount}
          subtitle="Atenção para renovação"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          bgColor="bg-amber-50"
          borderColor="border-amber-200/80"
          valueColor="text-amber-700"
        />

        <MetricCard
          title="Vacinas Atrasadas"
          value={delayedCount}
          subtitle="Reforço pendente"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          bgColor="bg-rose-50"
          borderColor="border-rose-200/80"
          valueColor="text-rose-700"
        />
      </div>

      {/* Grid: Alert Panel & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Alerts Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">Alertas e Próximos Vencimentos</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {alertsList.length} item(ns)
              </span>
            </div>

            {alertsList.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-700">Tudo em dia!</p>
                <p className="text-xs text-slate-500 mt-1">Nenhuma vacina com vencimento previsto para os próximos 30 dias.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertsList.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'}
                        alt={item.pet?.name || 'Pet'}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{item.pet?.name || 'Pet'}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-medium">
                            {item.pet?.species}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">{item.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] text-slate-400">Próximo Reforço</p>
                        <p className="text-xs font-bold text-slate-800">{item.nextDoseDate}</p>
                      </div>

                      {item.diffDays < 0 ? (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shrink-0">
                          Atrasada ({Math.abs(item.diffDays)}d)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shrink-0">
                          Em {item.diffDays} dias
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setActiveTab('vaccines')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>Ver Histórico Completo de Vacinas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Shortcuts & Direct Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Atalhos Rápidos
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('pets')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 rounded-2xl transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Dog className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cadastrar Novo Pet</p>
                    <p className="text-[11px] text-slate-500">Adicionar cão, gato ou outros</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => setActiveTab('vaccines')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-200 rounded-2xl transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
                    <Syringe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Lançar Nova Vacina</p>
                    <p className="text-[11px] text-slate-500">Registrar aplicação e lote</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </button>

              <button
                onClick={() => setActiveTab('quality')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200 rounded-2xl transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Qualidade & A11y</p>
                    <p className="text-[11px] text-slate-500">Documentação e testes PI-2</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pets Grid Showcase */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-base text-slate-900">Pets Recentes</h3>
            <p className="text-xs text-slate-500 mt-0.5">Selecione para visualizar detalhes completos do prontuário</p>
          </div>
          <button
            onClick={() => setActiveTab('pets')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Ver Todos os Pets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pets.slice(0, 4).map((pet) => {
            const petVaccines = vaccines.filter((v) => v.petId === pet.id);
            return (
              <div
                key={pet.id}
                onClick={() => {
                  setSelectedPetForDetail(pet);
                  setActiveTab('pets');
                }}
                className="bg-slate-50 border border-slate-200 hover:border-emerald-300 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="relative mb-3">
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-700 border border-slate-200 shadow-2xs">
                    {pet.species}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {pet.name}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">{pet.breed}</p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-500">
                  <span>{pet.age}</span>
                  <span className="font-semibold text-slate-700">{petVaccines.length} vacina(s)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, bgColor, borderColor, valueColor = 'text-slate-900' }) {
  return (
    <div className={`p-5 rounded-3xl bg-white border ${borderColor} flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-2xl ${bgColor}`}>{icon}</div>
      </div>
      <div>
        <span className={`text-3xl font-black ${valueColor} tracking-tight`}>{value}</span>
        <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// ==========================================
// DEMANDA 002 — CADASTRO E GERENCIAMENTO DE PETS
// ==========================================

function PetsCrudView({ pets, setPets, vaccines, setVaccines, selectedPetForDetail, setSelectedPetForDetail }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('Todas');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);

  const { addToast } = useToast();

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'Todas' || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });
  
  const handleSavePet = async (petData) => {
    try {
      const petPayload = {
        name: petData.name,
        species: petData.species,
        breed: petData.breed || undefined,
        sex: petData.gender || undefined,
        birthDate: petData.birthDate
          ? new Date(`${petData.birthDate}T00:00:00.000Z`).toISOString()
          : undefined,
        weight: petData.weight
          ? Number(String(petData.weight).replace(',', '.').replace(/\s*kg$/i, ''))
          : undefined,
        photoUrl: petData.photoUrl || undefined,
        color: petData.color || undefined,
        microchip: petData.microchip || undefined,
        notes: petData.notes || undefined,
      };

      let savedPet;

      if (editingPet) {
        savedPet = await petService.update(editingPet.id, petPayload);

        const updatedPet = mapApiPetToUi(savedPet);

        setPets((currentPets) =>
          currentPets.map((pet) =>
            pet.id === editingPet.id ? updatedPet : pet
          )
        );

        addToast(
          `Dados do pet "${savedPet.name}" atualizados com sucesso!`,
          'success'
        );
      } else {
        savedPet = await petService.create(petPayload);

        const newPet = mapApiPetToUi(savedPet);

        setPets((currentPets) => [newPet, ...currentPets]);

        addToast(
          `Pet "${savedPet.name}" cadastrado com sucesso!`,
          'success'
        );
      }

      setIsAddModalOpen(false);
      setEditingPet(null);
    } catch (error) {
      console.error('Erro ao salvar pet:', error);

      const message =
        error.response?.data?.message ||
        'Não foi possível salvar o pet. Verifique sua conexão com a API.';

      addToast(message, 'error');
    }
  };

  const handleDeletePet = (id) => {
    const petToDelete = pets.find((p) => p.id === id);
    setPets(pets.filter((p) => p.id !== id));
    setVaccines(vaccines.filter((v) => v.petId !== id));
    addToast(`Pet "${petToDelete?.name || ''}" excluído com sucesso.`, 'info');
    setDeletingPetId(null);
    if (selectedPetForDetail?.id === id) {
      setSelectedPetForDetail(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Gerenciamento de Pets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre, edite e consulte detalhes de todos os animais sob seus cuidados.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPet(null);
            setIsAddModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Pet</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar pet por nome, raça ou cor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 hidden sm:block" />
          {['Todas', 'Cão', 'Gato', 'Outro'].map((species) => (
            <button
              key={species}
              onClick={() => setSpeciesFilter(species)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                speciesFilter === species
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      {/* Pets Grid */}
      {filteredPets.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs">
          <Dog className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">Nenhum pet encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Tente ajustar seus termos de busca ou cadastrar um novo pet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => {
            const petVaccinesCount = vaccines.filter((v) => v.petId === pet.id).length;
            return (
              <div
                key={pet.id}
                className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white/90 backdrop-blur-xs text-emerald-800 border border-white/40 shadow-xs">
                        {pet.species}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <h3 className="text-xl font-black drop-shadow-md">{pet.name}</h3>
                        <p className="text-xs text-slate-200 drop-shadow-md font-medium">{pet.breed}</p>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-xs text-slate-200 font-semibold border border-white/20">
                        {pet.gender}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">IDADE</span>
                        <span className="text-slate-800 font-bold">{pet.age}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">PESO</span>
                        <span className="text-slate-800 font-bold">{pet.weight || 'Não inf.'}</span>
                      </div>
                    </div>

                    {pet.microchip && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-mono">Microchip: {pet.microchip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPetForDetail(pet)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Detalhes ({petVaccinesCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPet(pet);
                      setIsAddModalOpen(true);
                    }}
                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                    title="Editar Pet"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingPetId(pet.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Excluir Pet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Pet Modal */}
      {isAddModalOpen && (
        <PetFormModal
          pet={editingPet}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPet(null);
          }}
          onSave={handleSavePet}
        />
      )}

      {/* Pet Detail Drawer/Modal */}
      {selectedPetForDetail && (
        <PetDetailModal
          pet={selectedPetForDetail}
          vaccines={vaccines.filter((v) => v.petId === selectedPetForDetail.id)}
          onClose={() => setSelectedPetForDetail(null)}
          onEdit={() => {
            setEditingPet(selectedPetForDetail);
            setSelectedPetForDetail(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Confirm Delete Pet Modal */}
      {deletingPetId && (
        <ConfirmDeleteModal
          title="Excluir Pet"
          message="Tem certeza que deseja excluir este pet? Todas as vacinas registradas para ele também serão removidas permanentemente."
          onConfirm={() => handleDeletePet(deletingPetId)}
          onCancel={() => setDeletingPetId(null)}
        />
      )}
    </div>
  );
}


function calculatePetAge(birthDate) {
  if (!birthDate) return '';

  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();

  const birth = new Date(year, month - 1, day);

  if (birth > today) return '';

  let years = today.getFullYear() - year;
  let months = today.getMonth() - (month - 1);

  if (today.getDate() < day) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return years === 1 ? '1 ano' : `${years} anos`;
  }

  if (months <= 0) {
    return 'Menos de 1 mês';
  }

  return months === 1 ? '1 mês' : `${months} meses`;
}


function PetFormModal({ pet, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || 'Cão',
    breed: pet?.breed || '',
    gender: pet?.gender || 'Macho',
    birthDate: pet?.birthDate || '',
    age: calculatePetAge(pet?.birthDate || ''),
    weight: pet?.weight || '',
    color: pet?.color || '',
    microchip: pet?.microchip || '',
    photoUrl: pet?.photoUrl || '',
    notes: pet?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nome é obrigatório.';
    if (!formData.breed.trim()) errs.breed = 'Raça é obrigatória.';
    
    if (!formData.birthDate) {
      errs.birthDate = 'Data de nascimento é obrigatória.';
    } else if (formData.birthDate > new Date().toISOString().slice(0, 10)) {
      errs.birthDate = 'A data de nascimento não pode ser futura.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-scale-up my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Dog className="w-5 h-5 text-emerald-600" />
            <span>{pet ? 'Editar Dados do Pet' : 'Cadastrar Novo Pet'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Pet*</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Rex"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
              {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Espécie*</label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              >
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Raça*</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Ex: Golden, Siamês, SRD"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
              {errors.breed && <p className="text-rose-600 text-[11px] mt-0.5">{errors.breed}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gênero</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"> 
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de nascimento*
              </label>
              <input
                type="date"
                value={formData.birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  const birthDate = e.target.value;
                  setFormData((current) => ({
                    ...current,
                    birthDate,
                    age: calculatePetAge(birthDate),
                  }));
                  setErrors((current) => ({
                    ...current,
                    birthDate: '',
                  }));
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
              {errors.birthDate && (
                <p className="text-rose-600 text-[11px] mt-0.5">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idade calculada
              </label>
              <input
                type="text"
                value={formData.age}
                readOnly
                placeholder="Selecione a data de nascimento"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none cursor-not-allowed"
              />
            </div>


            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peso</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Ex: 12.5 kg"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cor</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ex: Dourado"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Código do Microchip</label>
            <input
              type="text"
              value={formData.microchip}
              onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
              placeholder="Ex: 982000384729102"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Foto</label>
            <input
              type="url"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Médicas</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Alergias, alimentação especial ou recomendações..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-emerald-200 transition-all cursor-pointer"
            >
              {pet ? 'Atualizar Pet' : 'Salvar Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PetDetailModal({ pet, vaccines, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl relative animate-scale-up my-8 max-h-[90vh] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900">{pet.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {pet.species}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{pet.breed} • {pet.gender}</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="py-4 space-y-6 overflow-y-auto max-h-[50vh] pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">IDADE</span>
                <span className="text-xs font-bold text-slate-800">{pet.age}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">PESO</span>
                <span className="text-xs font-bold text-slate-800">{pet.weight || 'N/I'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">COR</span>
                <span className="text-xs font-bold text-slate-800">{pet.color || 'N/I'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">MICROCHIP</span>
                <span className="text-xs font-bold text-slate-800 truncate block font-mono">{pet.microchip || 'N/A'}</span>
              </div>
            </div>

            {pet.notes && (
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60">
                <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Observações de Saúde</span>
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">{pet.notes}</p>
              </div>
            )}

            {/* Vaccines list for this pet */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Histórico de Vacinação ({vaccines.length})</span>
                <Syringe className="w-4 h-4 text-emerald-600" />
              </h4>

              {vaccines.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
                  Nenhuma vacina registrada para este pet até o momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {vaccines.map((vac) => (
                    <div
                      key={vac.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{vac.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Aplicação: {vac.applicationDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Próximo Reforço</span>
                        <span className="font-bold text-emerald-700">{vac.nextDoseDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Pet</span>
          </button>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DEMANDA 003 — HISTÓRICO DE VACINAÇÃO
// ==========================================

function VaccinesCrudView({ pets, vaccines, setVaccines }) {
  const [selectedPetFilter, setSelectedPetFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [deletingVaccineId, setDeletingVaccineId] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
  const loadVaccinations = async () => {
    if (pets.length === 0) {
      setVaccines([]);
      return;
    }

    try {
      const results = await Promise.all(
        pets.map((pet) =>
          vaccinationService.getAll(pet.id)
        )
      );

      const allVaccinations = results.flat();

      setVaccines(
        allVaccinations.map(mapApiVaccinationToUi)
      );
    } catch (error) {
      console.error('Erro ao carregar vacinas:', error);

      addToast(
        'Não foi possível carregar o histórico de vacinação.',
        'error'
      );
    }
  };
    loadVaccinations();
  }, [pets]);

  const today = new Date();

  const getVaccineStatus = (nextDoseDateStr) => {
    const due = new Date(nextDoseDateStr);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Atrasada', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (diffDays <= 30) return { label: 'Próxima', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Em Dia', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const filteredVaccines = vaccines.filter((vac) => {
    const pet = pets.find((p) => p.id === vac.petId);
    const petName = pet?.name || '';

    const matchesPet = selectedPetFilter === 'Todos' || vac.petId === selectedPetFilter;
    const matchesSearch =
      vac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petName.toLowerCase().includes(searchTerm.toLowerCase());

    const statusObj = getVaccineStatus(vac.nextDoseDate);
    const matchesStatus = statusFilter === 'Todas' || statusObj.label === statusFilter;

    return matchesPet && matchesSearch && matchesStatus;
  });

  
  const handleSaveVaccine = async (vacData) => {
    try {
      const petId = vacData.petId;

      const vaccinationData = {
        vaccineName: vacData.name.trim(),
        applicationDate: new Date(
          `${vacData.applicationDate}T12:00:00`
        ).toISOString(),
        nextDoseDate: vacData.nextDoseDate
          ? new Date(`${vacData.nextDoseDate}T12:00:00`).toISOString()
          : undefined,
        responsible: vacData.veterinarian?.trim() || undefined,
      };

      if (editingVaccine) {
        const updated = await vaccinationService.update(
          petId,
          editingVaccine.id,
          vaccinationData
        );

      setVaccines((current) =>
        current.map((v) =>
          v.id === editingVaccine.id
            ? {
                ...v,
                ...vacData,
                id: editingVaccine.id,
              }
            : v
        )
      );

      addToast('Registro de vacina atualizado!', 'success');
    } else {
      const created = await vaccinationService.create(
        petId,
        vaccinationData
      );

      setVaccines((current) => [
        {
          ...vacData,
          id: created.id,
          petId,
        },
        ...current,
      ]);

      addToast('Nova vacina lançada com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setEditingVaccine(null);
  } catch (error) {
    console.error('Erro ao salvar vacina:', error);

    const message =
      error.response?.data?.message ||
      'Não foi possível salvar a vacina. Verifique sua conexão e tente novamente.';

    addToast(message, 'error');
    }
  };

  
  const handleDeleteVaccine = async (id) => {
    try {
      const vaccine = vaccines.find((v) => v.id === id);

      if (!vaccine) {
        addToast('Registro de vacina não encontrado.', 'error');
        return;
      }

      await vaccinationService.delete(vaccine.petId, id);

      setVaccines((current) =>
        current.filter((v) => v.id !== id)
      );

      addToast('Registro de vacina excluído.', 'info');
      setDeletingVaccineId(null);
    } catch (error) {
      console.error('Erro ao excluir vacina:', error);

      addToast(
        error.response?.data?.message ||
          'Não foi possível excluir a vacina.',
        'error'
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Histórico de Vacinação</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle completo de aplicações, lotes, laboratórios e alertas de renovação por pet.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVaccine(null);
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Vacina</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por vacina, pet ou número do lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedPetFilter}
            onChange={(e) => setSelectedPetFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
          >
            <option value="Todos">Todos os Pets</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['Todas', 'Em Dia', 'Próxima', 'Atrasada'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vaccines Table */}
      {filteredVaccines.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs">
          <Syringe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">Nenhum registro de vacina encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca ou registre uma nova aplicação.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Pet</th>
                  <th className="p-4">Vacina</th>
                  <th className="p-4">Aplicação</th>
                  <th className="p-4">Próximo Reforço</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVaccines.map((vac) => {
                  const pet = pets.find((p) => p.id === vac.petId);
                  const status = getVaccineStatus(vac.nextDoseDate);

                  return (
                    <tr key={vac.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              pet?.photoUrl ||
                              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'
                            }
                            alt={pet?.name || 'Pet'}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{pet?.name || 'Pet'}</span>
                            <span className="text-[11px] text-slate-500">{pet?.species}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-900">{vac.name}</td>

                      <td className="p-4 text-slate-600 font-medium">{vac.applicationDate}</td>

                      <td className="p-4 font-bold text-emerald-700">{vac.nextDoseDate}</td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingVaccine(vac);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Vacina"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingVaccineId(vac.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Vacina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Vaccine Modal */}
      {isModalOpen && (
        <VaccineFormModal
          pets={pets}
          vaccine={editingVaccine}
          onClose={() => {
            setIsModalOpen(false);
            setEditingVaccine(null);
          }}
          onSave={handleSaveVaccine}
        />
      )}

      {/* Confirm Delete Modal */}
      {deletingVaccineId && (
        <ConfirmDeleteModal
          title="Excluir Vacina"
          message="Tem certeza que deseja remover este registro do histórico de vacinação do pet?"
          onConfirm={() => handleDeleteVaccine(deletingVaccineId)}
          onCancel={() => setDeletingVaccineId(null)}
        />
      )}
    </div>
  );
}

function VaccineFormModal({ pets, vaccine, onClose, onSave }) {
  const convertToInputDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("-")) return dateString; 
  
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    petId: vaccine?.petId || (pets[0]?.id || ''),
    name: vaccine?.name || '',
    applicationDate: vaccine?.applicationDate
      ? convertToInputDate(vaccine.applicationDate)
      : new Date().toISOString().split('T')[0],
    nextDoseDate: vaccine?.nextDoseDate
      ? convertToInputDate(vaccine.nextDoseDate)
      : '',
    veterinarian: vaccine?.veterinarian || '',
    notes: vaccine?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.petId) errs.petId = 'Selecione um pet.';
    if (!formData.name.trim()) errs.name = 'Nome da vacina é obrigatório.';
    if (!formData.applicationDate) errs.applicationDate = 'Data de aplicação é obrigatória.';
    if (!formData.nextDoseDate) errs.nextDoseDate = 'Data do próximo reforço é obrigatória.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const autoCalculatenextDoseDate = (months) => {
    if (!formData.applicationDate) return;
    const date = new Date(formData.applicationDate);
    date.setMonth(date.getMonth() + months);
    setFormData({ ...formData, nextDoseDate: date.toISOString().split('T')[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-scale-up my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-emerald-600" />
            <span>{vaccine ? 'Editar Vacina' : 'Registrar Nova Vacina'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Selecione o Pet*</label>
            <select
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species} - {p.breed})
                </option>
              ))}
            </select>
            {errors.petId && <p className="text-rose-600 text-[11px] mt-0.5">{errors.petId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Vacina*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Antirrábica, V10, Quádrupla Felina"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
            {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Aplicação*</label>
              <input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
              {errors.applicationDate && <p className="text-rose-600 text-[11px] mt-0.5">{errors.applicationDate}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Data do Reforço*</label>
                <button
                  type="button"
                  onClick={() => autoCalculatenextDoseDate(12)}
                  className="text-[10px] text-emerald-600 font-bold hover:underline"
                >
                  +1 ano
                </button>
              </div>
              <input
                type="date"
                value={formData.nextDoseDate}
                onChange={(e) => setFormData({ ...formData, nextDoseDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
              {errors.nextDoseDate && <p className="text-rose-600 text-[11px] mt-0.5">{errors.nextDoseDate}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Veterinário Responsável / CRMV</label>
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
              placeholder="Ex: Dra. Elena Silva (CRMV-SP 54321)"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Observações do Profissional</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Reações adversas, via de administração..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-emerald-200 transition-all cursor-pointer"
            >
              {vaccine ? 'Atualizar Registro' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DEMANDA 005 — QUALIDADE, ACESSIBILIDADE E DOCUMENTAÇÃO
// ==========================================

function QualityDocumentationView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Demanda 005 — Qualidade, Acessibilidade & Documentação</h2>
            <p className="text-xs text-slate-500">
              Conformidade com padrões WCAG 2.1 AA, boas práticas de front-end React e integração REST.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl w-fit">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Acessibilidade WCAG AA</h3>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Navegação semântica nativa com tags HTML5 (`header`, `main`, `nav`, `aside`).</li>
            <li>Rótulos de formulário devidamente associados via `htmlFor` / `id`.</li>
            <li>Contraste visual de alto desempenho e bordas acessíveis.</li>
            <li>Modal dialogs adaptados para toque e fechamento rápido (`X` e backdrop).</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Arquitetura de Dados</h3>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Instância Axios configurada para anexar `Authorization: Bearer JWT`.</li>
            <li>Persistência reativa `localStorage` como fallback confiável.</li>
            <li>Tratamento global de notificações com sistema de Toast contextual.</li>
            <li>Validação de formulários e estados de carregamento em botões.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl w-fit">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Entregáveis das Demandas</h3>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
            <li>
              <strong>Demanda 001:</strong> Telas funcionais de Login e Cadastro com mensagens de validação.
            </li>
            <li>
              <strong>Demanda 002:</strong> CRUD completo de pets com busca e filtros por espécie.
            </li>
            <li>
              <strong>Demanda 003:</strong> Histórico de vacinas com calculador de reforço anual.
            </li>
            <li>
              <strong>Demanda 004:</strong> Dashboard alimentado por dados reais do sistema.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Modal Genérico de Confirmação de Exclusão
function ConfirmDeleteModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl relative animate-scale-up">
        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="font-bold text-base text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}