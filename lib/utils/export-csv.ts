export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const csv = convertToCSV(data, headers);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Obtener headers (de las keys del primer objeto o usar headers provistas)
  const keys = headers || Object.keys(data[0]);

  // Crear fila de headers
  const headerRow = keys.map(escapeCSVValue).join(',');

  // Crear filas de datos
  const dataRows = data.map((row) => {
    return keys
      .map((key) => {
        const value = row[key];
        return escapeCSVValue(value);
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

function escapeCSVValue(value: any): string {
  if (value == null) {
    return '';
  }

  const stringValue = String(value);

  // Si contiene coma, comilla doble, o salto de línea, encerrar en comillas y escapar las comillas
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function prepareDataForExport(data: any[], columnMap: Record<string, string | ((value: any) => string)>): any[] {
  return data.map((row) => {
    const newRow: any = {};
    Object.entries(columnMap).forEach(([key, valueOrFn]) => {
      if (typeof valueOrFn === 'function') {
        newRow[key] = valueOrFn(row);
      } else {
        newRow[key] = row[valueOrFn];
      }
    });
    return newRow;
  });
}
