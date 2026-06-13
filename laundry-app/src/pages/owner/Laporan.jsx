import { useState } from "react";

const Laporan = () => {
  const [activeFilter, setActiveFilter] = useState("Kemarin");
  const [showLainnya, setShowLainnya] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-05-20");
  const [selectedMonth, setSelectedMonth] = useState("2026-05");

  const handleFilterClick = (filter) => { setActiveFilter(filter); setShowLainnya(false); };

  const generateData = () => {
    if (activeFilter === "Kemarin" || activeFilter === "Per Hari") {
      return { metrik: { Penjualan: "450RB", Pesanan: 3, Item: 8, Pelanggan: 1 }, tabel: [ { tanggal: activeFilter === "Per Hari" ? selectedDate : "19-05-2026", nota: 1, layanan: "Cuci Kilat", item: "3 Kg", pendapatan: 150000 }, { tanggal: activeFilter === "Per Hari" ? selectedDate : "19-05-2026", nota: 2, layanan: "Setrika Saja", item: "5 Kg", pendapatan: 300000 } ] };
    } else {
      return { metrik: { Penjualan: "8,5JT", Pesanan: 85, Item: 210, Pelanggan: 24 }, tabel: [ { tanggal: `Minggu 1`, nota: 20, layanan: "Cuci Reguler", item: "50 Kg", pendapatan: 2000000 }, { tanggal: `Minggu 2`, nota: 25, layanan: "Setrika Saja", item: "65 Kg", pendapatan: 2500000 } ] };
    }
  };

  const currentData = generateData();

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
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
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Pelanggan Baru</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{currentData.metrik.Pelanggan}</h3>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Rincian Transaksi</h3>
          <button className="text-sm bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 font-bold flex items-center gap-2 shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Unduh Excel
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-bold border-b border-slate-100">Waktu / Tanggal</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 text-center">Jml Nota</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100">Layanan Terlaris</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 text-center">Total Item</th>
                <th className="px-4 py-3 font-bold border-b border-slate-100 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {currentData.tabel.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-4 py-5 text-slate-800">{row.tanggal}</td>
                  <td className="px-4 py-5 text-center text-slate-600 font-bold">{row.nota}</td>
                  <td className="px-4 py-5"><span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">{row.layanan}</span></td>
                  <td className="px-4 py-5 text-center text-slate-600">{row.item}</td>
                  <td className="px-4 py-5 text-right font-extrabold text-slate-800">Rp {row.pendapatan.toLocaleString('id-ID')}</td>
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