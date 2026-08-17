import { AxiosError } from 'axios';

interface ValidationIssue {
  msg?: unknown;
}

function extractDetail(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const first = detail[0] as ValidationIssue | undefined;
    if (first && typeof first.msg === 'string') return first.msg;
  }
  return '';
}

export function getApiErrorMessage(error: unknown, fallback = 'Terjadi kesalahan. Coba lagi.'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'detail' in data) {
      const message = extractDetail((data as { detail: unknown }).detail);
      if (message) return message;
    }
  }
  return fallback;
}
