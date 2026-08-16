'use client';

import React, { useState } from 'react';
import Button from '../../components/ui/Button';

interface Tarif {
  id: number;
  jenis: string;
  tipe: string;
  tarifDasar: number;
  tarifJam: number;
  maksTarif: number;
  status: 'AKTIF' | 'NON AKTIF';
  tanggalUpdate: string;
}

export default function TarifParkirPage() {
  const [dataTarif, setDataTarif] = useState<Tarif[]>([
    { id: 1, jenis: 'Mobil', tipe: 'Reguler', tarifDasar: 10000, tarifJam: 5000, maksTarif: 15000, status: 'AKTIF', tanggalUpdate: '01/08/26 14:03:05' },
    { id: 2, jenis: 'Mobil', tipe: 'VIP', tarifDasar: 10000, tarifJam: 5000, maksTarif: 20000, status: 'AKTIF', tanggalUpdate: '01/08/26 14:03:05' },
    { id: 3, jenis: 'Motor', tipe: 'Reguler', tarifDasar: 3000, tarifJam: 2000, maksTarif: 10000, status: 'NON AKTIF', tanggalUpdate: '01/08/26 14:03:05' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    jenis: 'Mobil',
    tipe: 'Reguler',
    tarifDasar: '',
    tarifJam: '',
    maksTarif: ''
  });

  const [itemYangDihapus, setItemYangDihapus] = useState<Tarif | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ jenis: 'Mobil', tipe: 'Reguler', tarifDasar: '', tarifJam: '', maksTarif: '' });
    setIsModalOpen(true);
  };

  const handleKlikEdit = (tarif: Tarif) => {
    setIdYangDiedit(tarif.id);
    setFormData({
      jenis: tarif.jenis,
      tipe: tarif.tipe,
      tarifDasar: tarif.tarifDasar.toString(),
      tarifJam: tarif.tarifJam.toString(),
      maksTarif: tarif.maksTarif.toString()
    });
    setIsModalOpen(true);
  };

  const handleSimpanTarif = () => {
    if (!formData.tarifDasar || !formData.tarifJam || !formData.maksTarif) {
      alert("Harap isi semua kolom harga!");
      return;
    }

    const waktuSekarang = new Date().toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\./g, ':');

    if (idYangDiedit !== null) {
      // EDIT
      const dataTerbaru = dataTarif.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            jenis: formData.jenis,
            tipe: formData.tipe,
            tarifDasar: Number(formData.tarifDasar),
            tarifJam: Number(formData.tarifJam),
            maksTarif: Number(formData.maksTarif),
            tanggalUpdate: waktuSekarang
          };
        }
        return item;
      });
      setDataTarif(dataTerbaru);
    } else {
      // TAMBAH BARU
      const tarifBaru: Tarif = {
        id: Date.now(), 
        jenis: formData.jenis,
        tipe: formData.tipe,
        tarifDasar: Number(formData.tarifDasar),
        tarifJam: Number(formData.tarifJam),
        maksTarif: Number(formData.maksTarif),
        status: 'AKTIF',
        tanggalUpdate: waktuSekarang
      };
      setDataTarif([...dataTarif, tarifBaru]);
    }

    setIsModalOpen(false);
    setIdYangDiedit(null);
    setFormData({ jenis: 'Mobil', tipe: 'Reguler', tarifDasar: '', tarifJam: '', maksTarif: '' });
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataTarif.filter((tarif) => tarif.id !== itemYangDihapus.id);
      setDataTarif(dataTerbaru);
      setItemYangDihapus(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Manajemen Tarif</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-[190px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
          </svg>
          <span className="text-[18px] leading-none text-[#17130E]">
            Tambah Tarif
          </span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <select className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
              <option>Semua Kendaraan</option>
              <option>Mobil</option>
              <option>Motor</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
            <select className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
              <option>Semua Tipe</option>
              <option>Reguler</option>
              <option>VIP</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>
        </div>
        <div className="relative w-full lg:w-[280px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" placeholder="Cari Jenis, Tipe..." className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
        </div>
      </div>

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center">NO.</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">TIPE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">SKEMA TARIF</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Maks. Tarif</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Tanggal update</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataTarif.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data tarif.</td></tr>
              ) : (
                dataTarif.map((tarif, index) => (
                  <tr key={tarif.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    <td className="px-6 py-4 font-medium text-center">{index + 1}.</td>
                    <td className="px-6 py-4 text-center">{tarif.jenis}</td>
                    <td className="px-6 py-4 text-center">{tarif.tipe}</td>
                    <td className="px-6 py-4 text-center">
                      Rp {tarif.tarifDasar.toLocaleString('id-ID')} +<br/>
                      <span className="text-gray-400 text-xs">Rp {tarif.tarifJam.toLocaleString('id-ID')}/jam</span>
                    </td>
                    <td className="px-6 py-4 text-center">Rp {tarif.maksTarif.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${tarif.status === 'AKTIF' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {tarif.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs">{tarif.tanggalUpdate}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(tarif)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(tarif)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-[#B5884D]/30 bg-[#231F1A]">
              <h2 className="text-xl font-bold text-[#EAE1D8]">{idYangDiedit ? 'Edit Tarif' : 'Tambah Tarif Baru'}</h2>
              <button onClick={() => {setIsModalOpen(false); setIdYangDiedit(null);}} className="text-gray-400 hover:text-[#FF5656] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-gray-300">Jenis Kendaraan</label><select name="jenis" value={formData.jenis} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"><option value="Mobil">Mobil</option><option value="Motor">Motor</option><option value="Kendaraan Besar">Kendaraan Besar</option></select></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-gray-300">Tipe</label><select name="tipe" value={formData.tipe} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"><option value="Reguler">Reguler</option><option value="VIP">VIP</option><option value="Bulanan">Bulanan</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-gray-300">Tarif Dasar (Rp)</label><input type="number" name="tarifDasar" value={formData.tarifDasar} onChange={handleInputChange} placeholder="Contoh: 10000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-gray-300">Tarif Berikutnya/Jam</label><input type="number" name="tarifJam" value={formData.tarifJam} onChange={handleInputChange} placeholder="Contoh: 5000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-sm font-medium text-gray-300">Maksimal Tarif (Rp)</label><input type="number" name="maksTarif" value={formData.maksTarif} onChange={handleInputChange} placeholder="Contoh: 20000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" /></div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
              <button onClick={() => {setIsModalOpen(false); setIdYangDiedit(null);}} className="px-6 py-2.5 text-sm font-medium text-[#EAE1D8] border border-gray-600 rounded-[7px] hover:bg-gray-800 transition-colors">Batal</button>
              <Button onClick={handleSimpanTarif} className="px-6 !h-auto py-2.5 !w-auto">
                {idYangDiedit ? 'Simpan Perubahan' : 'Simpan Tarif'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {itemYangDihapus !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-md rounded-[14px] shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setItemYangDihapus(null)} className="absolute top-5 right-5 text-[#B5884D] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#FF5656]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Tarif</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus Tarif <span className="text-[#B5884D] font-bold uppercase">{itemYangDihapus.jenis} ({itemYangDihapus.tipe})</span>? Aksi ini akan menghapus di list secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button onClick={eksekusiHapus} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}