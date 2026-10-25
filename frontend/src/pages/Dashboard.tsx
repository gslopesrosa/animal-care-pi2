
import { useState } from 'react';
import {
  PawPrint,
  Syringe,
  CalendarDays,
  Heart,
  Plus,
  ArrowRight,
} from 'lucide-react';

import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/ui/StatCard';
import PetCard, { type Pet } from '../components/ui/PetCard';

const demoPets: Pet[] = [
  {
    id: 1,
    name: 'Rex',
    species: 'Cachorro',
    breed: 'Labrador',
    age: '2 anos',
  },
  {
    id: 2,
    name: 'Mimi',
    species: 'Gato',
    breed: 'SRD',
    age: '1 ano',
  },
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Início');

  function handlePetOpen(pet: Pet) {
    window.alert(`Detalhes de ${pet.name} serão implementados em breve.`);
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      <div className="page-content">
        <section className="welcome-banner">
          <div>
            <span className="welcome-label">
              SEU ESPAÇO DE CUIDADO
            </span>
            <h1>Olá, Maria! <span>♡</span></h1>
            <p>
              Cada pequeno cuidado faz parte de uma vida mais saudável
              para quem você ama.
            </p>
          </div>

          <div className="welcome-paw" aria-hidden="true">
            <PawPrint size={76} strokeWidth={1.2} />
          </div>
        </section>

        <section className="stats-grid" aria-label="Resumo">
          <StatCard
            title="Meus pets"
            value={2}
            description="Animais cadastrados"
            icon={PawPrint}
            variant="green"
          />

          <StatCard
            title="Vacinações"
            value={0}
            description="Próximas doses identificadas"
            icon={Syringe}
            variant="yellow"
          />

          <StatCard
            title="Consultas"
            value={0}
            description="Compromissos registrados"
            icon={CalendarDays}
            variant="neutral"
          />

          <StatCard
            title="Bem-estar"
            value="Em dia"
            description="Continue cuidando com carinho"
            icon={Heart}
            variant="green"
          />
        </section>

        <section className="pets-section">
          <div className="section-heading">
            <div>
              <h2>Meus companheiros</h2>
              <p>Conheça os pets cadastrados no seu espaço.</p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                window.alert('O formulário de cadastro será implementado na próxima etapa.')
              }
            >
              <Plus size={18} />
              <span>Adicionar pet</span>
            </button>
          </div>

          <div className="pets-grid">
            {demoPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onOpen={handlePetOpen}
              />
            ))}
          </div>
        </section>

        <section className="care-tip">
          <div className="care-tip-icon">
            <Heart size={24} />
          </div>

          <div>
            <h3>Um cuidado de cada vez</h3>
            <p>
              Mantenha os registros dos seus pets organizados para
              consultar o histórico quando precisar.
            </p>
          </div>

          <ArrowRight className="care-tip-arrow" size={22} />
        </section>

        <p className="demo-notice">
          Protótipo inicial: os dados apresentados são ilustrativos.
          Os indicadores de saúde ainda não estão conectados à API.
        </p>
      </div>
    </AppLayout>
  );
}
