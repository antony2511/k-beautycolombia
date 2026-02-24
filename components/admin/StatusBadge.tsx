type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusConfig: Record<Status, { label: string; color: string; bgColor: string }> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100 border-yellow-200',
  },
  processing: {
    label: 'Procesando',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
  },
  shipped: {
    label: 'Enviado',
    bgColor: 'bg-purple-100 border-purple-200',
    color: 'text-purple-700',
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-200',
  },
  active: {
    label: 'Activo',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
  },
  inactive: {
    label: 'Inactivo',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-200',
  },
};

export default function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.color} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label || config.label}
    </span>
  );
}
