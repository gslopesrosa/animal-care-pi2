// src/utils/vaccineStatus.js
export function getVaccineStatus(nextDateStr) {
  if (!nextDateStr) return { label: 'Sem Registro', tone: 'slate' };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(nextDateStr);
  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Atrasada', tone: 'rose', diffDays };
  if (diffDays <= 30) return { label: 'Próxima', tone: 'amber', diffDays };
  return { label: 'Em dia', tone: 'emerald', diffDays };
}