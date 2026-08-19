'use client';

import React from 'react';
import DeviceConfigPage from '@/app/components/teknisi/DeviceConfigPage';

export default function KonfigurasiKameraLprPage() {
  return (
    <DeviceConfigPage
      title="Konfigurasi Kamera LPR"
      defaultType="lpr"
      searchPlaceholder="Cari Kamera LPR..."
    />
  );
}