import axios from 'axios';

import { apiClient } from './client';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export type ReportName =
  | 'transactions'
  | 'pending-tickets'
  | 'revenue'
  | 'vehicles'
  | 'operator-performance'
  | 'members'
  | 'gate-events';

function parseContentDisposition(header: string | undefined): string | null {
  if (!header) return null;
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }
  const plainMatch = header.match(/filename="?([^";]+)"?/i);
  return plainMatch ? plainMatch[1] : null;
}

async function extractErrorMessage(error: unknown): Promise<string> {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Gagal mengunduh file.';
  }
  const data = error.response?.data;
  if (data instanceof Blob && data.type.includes('application/json')) {
    try {
      const parsed = JSON.parse(await data.text());
      if (typeof parsed.detail === 'string') return parsed.detail;
    } catch {
      // fall through to generic message
    }
  }
  return error.message || 'Gagal mengunduh file.';
}

export async function downloadReportExport(
  report: ReportName,
  format: ExportFormat,
  params: Record<string, unknown> = {},
): Promise<void> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

  let response;
  try {
    response = await apiClient.get(`/finance/reports/${report}/export`, {
      params: { ...cleanParams, format },
      responseType: 'blob',
    });
  } catch (error) {
    throw new Error(await extractErrorMessage(error));
  }

  const disposition = response.headers['content-disposition'] as string | undefined;
  const filename =
    parseContentDisposition(disposition) ?? `${report}-${new Date().toISOString().slice(0, 10)}.${format}`;

  const contentType = response.headers['content-type'];
  const blob = new Blob([response.data], {
    type: typeof contentType === 'string' ? contentType : 'application/octet-stream',
  });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
