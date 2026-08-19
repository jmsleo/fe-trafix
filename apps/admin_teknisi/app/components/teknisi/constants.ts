export const KIND_LABELS: Record<string, string> = {
  controller: 'Controller',
  lpr: 'Kamera LPR',
  camera: 'Camera',
  reader: 'Reader',
  signage: 'Signage',
  other: 'Lainnya',
};

export const STATUS_LABELS: Record<string, string> = {
  online: 'ONLINE',
  offline: 'OFFLINE',
  trouble: 'TROUBLE',
};

export function formatTime(iso: string | number | null | undefined): string {
  if (!iso) return '-';
  const date = typeof iso === 'number' ? new Date(iso) : new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date
    .toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/\./g, ':');
}