import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Laporan = () => {
  const [activeFilter, setActiveFilter] = useState("Kemarin");
  const [showLainnya, setShowLainnya] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-05-20");
  const [selectedMonth, setSelectedMonth] = useState("2026-05");

  const [semuaTransaksi, setSemuaTransaksi] = useState([]);
  const [semuaPelanggan, setSemuaPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resTransaksi, resPelanggan] = await Promise.all([
          axios.get("http://localhost:8000/api/transaksi"),
          axios.get("http://localhost:8000/api/pelanggan")
        ]);
        setSemuaTransaksi(resTransaksi.data);
        setSemuaPelanggan(resPelanggan.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
        setLoading(false);
        Swal.fire("Error", "Gagal mengambil data dari server Laravel.", "error");
      }
    };
    fetchData();
  }, []);

  const handleFilterClick = (filter) => { 
    setActiveFilter(filter); 
    setShowLainnya(false); 
  };

  const generateDataLive = () => {
    const hariIni = new Date();
    
    const dataTersaring = semuaTransaksi.filter((trx) => {
      const tglTrx = new Date(trx.created_at);
      
      const stringFormat = tglTrx.toISOString().split('T')[0];
      const monthFormat = stringFormat.substring(0, 7);

      if (activeFilter === "Kemarin") {
        const kemarin = new Date();
        kemarin.setDate(hariIni.getDate() - 1);
        return stringFormat === kemarin.toISOString().split('T')[0];
      }
      
      if (activeFilter === "7 Hari Terakhir") {
        const tujuhHariLalu = new Date();
        tujuhHariLalu.setDate(hariIni.getDate() - 7);
        return tglTrx >= tujuhHariLalu && tglTrx <= hariIni;
      }
      
      if (activeFilter === "30 Hari Terakhir") {
        const tigaPuluhHariLalu = new Date();
        tigaPuluhHariLalu.setDate(hariIni.getDate() - 30);
        return tglTrx >= tigaPuluhHariLalu && tglTrx <= hariIni;
      }
      
      if (activeFilter === "Per Hari") {
        return stringFormat === selectedDate;
      }
      
      if (activeFilter === "Per Bulan") {
        return monthFormat === selectedMonth;
      }

      return true;
    });

    const totalPenjualan = dataTersaring.reduce((sum, item) => sum + item.total_harga, 0);
    const totalBeratItem = dataTersaring.reduce((sum, item) => sum + (item.berat || 0), 0);
    const pelangganUnik = [...new Set(dataTersaring.map(item => item.pelanggan_id))].length;

    const formatMetrikPenjualan = (angka) => {
      if (angka >= 1000000) return (angka / 1000000).toFixed(1) + "JT";
      if (angka >= 1000) return (angka / 1000).toFixed(0) + "RB";
      return angka.toString();
    };

    return {
      metrik: {
        Penjualan: formatMetrikPenjualan(totalPenjualan),
        Pesanan: dataTersaring.length,
        Item: totalBeratItem + " Kg",
        Pelanggan: pelangganUnik
      },
      tabel: dataTersaring.map(trx => {
        const tgl = new Date(trx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return {
          tanggal: tgl,
          nota: trx.id_nota,
          // DATA NAMA DITAMBAHKAN DI SINI
          nama: trx.pelanggan ? trx.pelanggan.nama : "Terhapus", 
          layanan: trx.layanan ? trx.layanan.nama : "Pakaian Satuan",
          item: trx.berat ? `${trx.berat} Kg` : `${trx.rincian_pakaian?.length || 0} Pcs`,
          pendapatan: trx.total_harga
        };
      })
    };
  };

  const currentData = generateDataLive();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Laporan Analitik</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Pantau detail pendapatan dan operasional bisnis Anda.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-wrap gap-4 items-center">
        <div className="flex flex-wrap gap-2 items-center relative bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          {["Kemarin", "7 Hari Terakhir", "30 Hari Terakhir"].map((filter) => (
            <button 
              key={filter} onClick={() => handleFilterClick(filter)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeFilter === filter ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"}`}
            >
              {filter}
            </button>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setShowLainnya(!showLainnya)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${["Per Hari", "Per Bulan"].includes(activeFilter) || showLainnya ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"}`}
            >
              {["Per Hari", "Per Bulan"].includes(activeFilter) ? activeFilter : "Lainnya"}
              <svg className={`w-4 h-4 transform transition-transform ${showLainnya ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showLainnya && (
              <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                <button onClick={() => handleFilterClick("Per Hari")} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Per Hari</button>
                <button onClick={() => handleFilterClick("Per Bulan")} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Per Bulan</button>
              </div>
            )}
          </div>
        </div>

        {activeFilter === "Per Hari" && (
          <div className="flex items-center gap-3 animate-fade-in pl-5 border-l-2 border-slate-100">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          </div>
        )}
        {activeFilter === "Per Bulan" && (
          <div className="flex items-center gap-3 animate-fade-in pl-5 border-l-2 border-slate-100">
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-sm">
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-2">Penjualan Kotor</p>
            <h3 className="text-3xl font-extrabold text-indigo-900">{currentData.metrik.Penjualan}</h3>
          </div>
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Total Nota</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{currentData.metrik.Pesanan}</h3>
          </div>
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Total Item/Berat</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{currentData.metrik.Item}</h3>
          </div>
          <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Pelanggan Aktif</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{currentData.metrik.Pelanggan}</h3>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Rincian Transaksi Berdasarkan Periode</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                {/* Diberi batasan lebar (width) agar tidak merenggang otomatis */}
                <th className="px-4 py-3 font-bold border-b border-slate-100 w-[15%] whitespace-nowrap">Waktu / Tanggal</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 w-[15%]">ID Nota</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 w-[20%]">Pelanggan</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 w-[25%]">Layanan Utama</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 text-center w-[10%]">Total Item</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 text-right w-[15%]">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {currentData.tabel.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400 italic">Tidak ada transaksi untuk periode ini.</td>
                </tr>
              ) : (
                currentData.tabel.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="px-4 py-5 text-slate-800">{row.tanggal}</td>
                    {/* Hapus text-center agar ID Nota rata kiri dan menempel rapi dengan Tanggal */}
                    <td className="px-4 py-5 text-slate-900 font-extrabold">{row.nota}</td>
                    <td className="px-4 py-5 font-bold text-slate-700 capitalize">{row.nama}</td>
                    <td className="px-4 py-5">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 whitespace-nowrap">
                        {row.layanan}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center text-slate-600">{row.item}</td>
                    <td className="px-4 py-5 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                      Rp {row.pendapatan.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;