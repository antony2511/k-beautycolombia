export function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: Date | string): string {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatShortDate(date: Date | string): string {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

export function formatTime(date: Date | string): string {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function getRelativeTime(date: Date | string): string {
  if (!date) return 'N/A';
  const now = new Date();
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) return 'N/A';
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'hace un momento';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} mes${diffInMonths !== 1 ? 'es' : ''}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} año${diffInYears !== 1 ? 's' : ''}`;
}
