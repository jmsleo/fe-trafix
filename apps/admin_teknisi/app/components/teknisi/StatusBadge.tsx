import React from 'react';
import { STATUS_LABELS } from './constants';

export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    online: {
      label: STATUS_LABELS.online,
      cls: 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]',
    },
    offline: {
      label: STATUS_LABELS.offline,
      cls: 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]',
    },
    trouble: {
      label: STATUS_LABELS.trouble,
      cls: 'border-[#FFC15C] bg-[#FF990059] text-[#FFC15C]',
    },
  };
  const s = map[status] ?? map.offline;
  return (
    <div className={`inline-flex items-center justify-center w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${s.cls}`}>
      {s.label}
    </div>
  );
}