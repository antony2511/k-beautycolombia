interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Material icon name
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  className?: string;
}

const colorConfig = {
  primary: {
    gradient: 'from-primary to-primary/80',
    bg: 'bg-primary',
    light: 'bg-primary/10',
  },
  secondary: {
    gradient: 'from-secondary to-secondary/80',
    bg: 'bg-secondary',
    light: 'bg-secondary/10',
  },
  success: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-500',
    light: 'bg-green-50',
  },
  warning: {
    gradient: 'from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-500',
    light: 'bg-yellow-50',
  },
  info: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
  },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className = '',
}: StatCardProps) {
  const colors = colorConfig[color];

  return (
    <div className={`bg-white rounded-xl shadow-md border border-accent-light/30 p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
          <span className="material-icons text-white text-2xl">{icon}</span>
        </div>

        {/* Trend */}
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span className="material-icons text-xs">
              {trend.isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-primary">{value}</h3>
        <p className="text-sm text-accent mt-1">{title}</p>
      </div>
    </div>
  );
}
