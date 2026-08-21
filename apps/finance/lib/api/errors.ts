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

function cleanMessage(msg: string): string {
  return msg.replace(/^Value error,\s*/i, '');
}

function extractFromResponse(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const obj = data as { detail?: unknown; errors?: unknown };
  if (Array.isArray(obj.errors)) {
    const first = obj.errors[0] as ValidationIssue | undefined;
    if (first && typeof first.msg === 'string') {
      const message = cleanMessage(first.msg);
      if (message) return message;
    }
  }
  return cleanMessage(extractDetail(obj.detail));
}

export function getApiErrorMessage(error: unknown, fallback = 'Terjadi kesalahan. Coba lagi.'): string {
  if (error instanceof AxiosError) {
    const message = extractFromResponse(error.response?.data);
    if (message) return message;
  }
  return fallback;
}
