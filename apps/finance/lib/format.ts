export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return dateTimeFormatter.format(date);
}

export function durationMinutes(entryIso: string, exitIso: string | null | undefined): number | null {
  if (!exitIso) return null;
  const entry = new Date(entryIso).getTime();
  const exit = new Date(exitIso).getTime();
  if (Number.isNaN(entry) || Number.isNaN(exit)) return null;
  return Math.max(0, Math.round((exit - entry) / 60_000));
}
