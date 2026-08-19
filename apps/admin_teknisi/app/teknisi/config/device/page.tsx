'use client';

import React from 'react';
import DeviceConfigPage from '@/app/components/teknisi/DeviceConfigPage';

export default function KonfigurasiDevicePage() {
  return (
    <DeviceConfigPage
      title="Konfigurasi Device"
      defaultType="controller"
      searchPlaceholder="Cari Device..."
    />
  );
}