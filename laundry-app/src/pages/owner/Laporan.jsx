import { useState } from "react";

const Laporan = () => {
  // State Utama
  const [activeFilter, setActiveFilter] = useState("Kemarin");
  const [showLainnya, setShowLainnya] = useState(false);

  // State untuk Input Tanggal & Bulan Spesifik
  const [selectedDate, setSelectedDate] = useState("2026-05-20"); // Default hari ini
  const [selectedMonth, setSelectedMonth] = useState("2026-05");  // Default bulan ini

  // Fungsi untuk menutup dropdown dan set filter
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setShowLainnya(false);
  };

  // ==========================================
  // SIMULASI DATA (Berubah sesuai filter)
  // ==========================================
  const generateData = () => {
    if (activeFilter === "Kemarin" || activeFilter === "Per Hari") {
      return {
        metrik: { Penjualan: "450RB", Pesanan: 3, Item: 8, Pelanggan: 1 },
        tabel: [
          { tanggal: activeFilter === "Per Hari" ? selectedDate : "19-05-2026", nota: 1, layanan: "Cuci Kilat", item: "3 Kg", pendapatan: 150000 },
          { tanggal: activeFilter === "Per Hari" ? selectedDate : "19-05-2026", nota: 2, layanan: "Setrika Saja", item: "5 Kg", pendapatan: 300000 },
        ]
      };
    } else if (activeFilter === "7 Hari Terakhir") {
      return {
        metrik: { Penjualan: "2,1JT", Pesanan: 18, Item: 45, Pelanggan: 5 },
        tabel: [
          { tanggal: "19-05-2026", nota: 3, layanan: "Campur", item: "12 Kg", pendapatan: 450000 },
          { tanggal: "18-05-2026", nota: 5, layanan: "Cuci Reguler", item: "15 Kg", pendapatan: 750000 },
          { tanggal: "17-05-2026", nota: 4, layanan: "Jas/Sprei", item: "8 Pcs", pendapatan: 500000 },
          { tanggal: "16-05-2026", nota: 6, layanan: "Campur", item: "10 Kg", pendapatan: 400000 },
        ]
      };
    } else {
      // Untuk 30 Hari & Per Bulan
      return {
        metrik: { Penjualan: "8,5JT", Pesanan: 85, Item: 210, Pelanggan: 24 },
        tabel: [
          { tanggal: `Minggu 1 (${activeFilter === "Per Bulan" ? selectedMonth : "Bulan ini"})`, nota: 20, layanan: "Cuci Reguler", item: "50 Kg", pendapatan: 2000000 },
          { tanggal: `Minggu 2 (${activeFilter === "Per Bulan" ? selectedMonth : "Bulan ini"})`, nota: 25, layanan: "Setrika Saja", item: "65 Kg", pendapatan: 2500000 },
          { tanggal: `Minggu 3 (${activeFilter === "Per Bulan" ? selectedMonth : "Bulan ini"})`, nota: 22, layanan: "Cuci Kilat", item: "45 Kg", pendapatan: 2200000 },
          { tanggal: `Minggu 4 (${activeFilter === "Per Bulan" ? selectedMonth : "Bulan ini"})`, nota: 18, layanan: "Campur", item: "50 Kg", pendapatan: 1800000 },
        ]
      };
    }
  };

  const currentData = generateData();

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Laporan Keuangan & Operasional</h1>
        <p className="text-gray-500 mt-1">Pantau performa laundry berdasarkan rentang waktu pilihan Anda.</p>
      </div>

      {/* ========================================== */}
      {/* FILTER WAKTU & DATE PICKER                 */}
      {/* ========================================== */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex flex-wrap gap-2 items-center relative">
          <button 
            onClick={() => handleFilterClick("Kemarin")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeFilter === "Kemarin" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Kemarin
          </button>
          <button 
            onClick={() => handleFilterClick("7 Hari Terakhir")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeFilter === "7 Hari Terakhir" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            7 Hari Terakhir
          </button>
          <button 
            onClick={() => handleFilterClick("30 Hari Terakhir")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeFilter === "30 Hari Terakhir" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            30 Hari Terakhir
          </button>
          
          {/* Dropdown 'Lainnya' */}
          <div className="relative">
            <button 
              onClick={() => setShowLainnya(!showLainnya)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2 ${["Per Hari", "Per Bulan"].includes(activeFilter) || showLainnya ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {["Per Hari", "Per Bulan"].includes(activeFilter) ? activeFilter : "Lainnya"}
              <svg className={`w-4 h-4 transform transition-transform ${showLainnya ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {showLainnya && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                <button onClick={() => handleFilterClick("Per Hari")} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b font-medium">Per Hari</button>
                <button onClick={() => handleFilterClick("Per Bulan")} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium">Per Bulan</button>
              </div>
            )}
          </div>
        </div>

        {/* INPUT TANGGAL (Muncul jika "Per Hari" dipilih) */}
        {activeFilter === "Per Hari" && (
          <div className="flex items-center gap-2 animate-fade-in pl-4 border-l border-gray-200">
            <label className="text-sm text-gray-600 font-medium">Pilih Tanggal:</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        )}

        {/* INPUT BULAN (Muncul jika "Per Bulan" dipilih) */}
        {activeFilter === "Per Bulan" && (
          <div className="flex items-center gap-2 animate-fade-in pl-4 border-l border-gray-200">
            <label className="text-sm text-gray-600 font-medium">Pilih Bulan & Tahun:</label>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* ========================================== */}
        {/* KARTU METRIK UTAMA                         */}
        {/* ========================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-orange-200 bg-orange-50/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">Penjualan Kotor (Rp)</p>
            <h3 className="text-2xl font-bold text-gray-900">{currentData.metrik.Penjualan}</h3>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">Total Nota Selesai</p>
            <h3 className="text-2xl font-bold text-gray-900">{currentData.metrik.Pesanan}</h3>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">Total Item (Kg/Pcs)</p>
            <h3 className="text-2xl font-bold text-gray-900">{currentData.metrik.Item}</h3>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">Pelanggan Baru</p>
            <h3 className="text-2xl font-bold text-gray-900">{currentData.metrik.Pelanggan}</h3>
          </div>
        </div>

        {/* ========================================== */}
        {/* TABEL DATA PENJUALAN DETAIL                */}
        {/* ========================================== */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-md font-bold text-gray-800">Rincian Transaksi</h3>
          <button className="text-sm bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 flex items-center gap-2 transition-colors">
            ↓ Unduh Excel
          </button>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-6 py-3 font-semibold border-b">Waktu / Tanggal</th>
                <th className="px-6 py-3 font-semibold border-b text-center">Jumlah Nota</th>
                <th className="px-6 py-3 font-semibold border-b">Layanan Terlaris</th>
                <th className="px-6 py-3 font-semibold border-b text-center">Total Berat/Item</th>
                <th className="px-6 py-3 font-semibold border-b text-right">Pendapatan (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {currentData.tabel.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{row.tanggal}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600">{row.nota}</td>
                  <td className="px-6 py-4 text-gray-600"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">{row.layanan}</span></td>
                  <td className="px-6 py-4 text-center text-gray-600">{row.item}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-700">
                    {row.pendapatan.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;