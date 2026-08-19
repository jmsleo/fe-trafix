'use client';

import React from 'react';
import DeviceConfigPage from '@/app/components/teknisi/DeviceConfigPage';

export default function KonfigurasiSignagePage() {
  return (
    <DeviceConfigPage
      title="Konfigurasi Signage"
      defaultType="signage"
      searchPlaceholder="Cari Signage..."
    />
  );
}