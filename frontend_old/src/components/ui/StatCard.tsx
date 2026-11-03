
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: 'green' | 'yellow' | 'neutral';
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'green',
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${variant}`}>
        <Icon size={23} />
      </div>

      <p className="stat-title">{title}</p>
      <strong className="stat-value">{value}</strong>
      <p className="stat-description">{description}</p>
    </article>
  );
}
