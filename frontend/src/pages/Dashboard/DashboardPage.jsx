import React, { useEffect, useState } from 'react';
import { petService } from '../../services/petService';
import { vaccineService } from '../../services/vaccineService';

export function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({ petsCount: 0, vaccinesCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [pets, vaccines] = await Promise.all([
          petService.getAll(),
          vaccineService.getAll()
        ]);
        setStats({ petsCount: pets.length, vaccinesCount: vaccines.length });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <div>Carregando dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Renders KPIs and Shortcuts */}
    </div>
  );
}