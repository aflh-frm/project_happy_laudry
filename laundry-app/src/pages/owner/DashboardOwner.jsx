import { useState } from "react";

const DashboardOwner = () => {
  const [currentLoad, setCurrentLoad] = useState(50);
  const [maxQuota, setMaxQuota] = useState(150);
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [tempQuota, setTempQuota] = useState(150);

  const progressPercentage = Math.min((currentLoad / maxQuota) * 100, 100);

  const handleSaveQuota = () => {
    setMaxQuota(Number(tempQuota));
    setIsEditingQuota(false);
  };

  const recentOrders = [
    { id: "TRX-001", nama: "Budi Santoso", layanan: "Cuci Komplit", status: "Baru", total: "Rp 45.000", tanggal: "10 Mei 2026" },
    { id: "TRX-002", nama: "Siti Aminah", layanan: "Setrika Saja", status: "Diproses", total: "Rp 20.000", tanggal: "10 Mei 2026" },
    { id: "TRX-003", nama: "Andi Saputra", layanan: "Cuci Kering", status: "Selesai", total: "Rp 35.000", tanggal: "09 Mei 2026" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Baru": return "bg-indigo-100 text-indigo-700";
      case "Diproses": return "bg-amber-100 text-amber-700";
      case "Selesai": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Owner</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Ringkasan aktivitas dan performa laundry hari ini.</p>
      </div>

      {/* Banner Kuota Super Mewah (Tetap Dipertahankan) */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-xl tracking-wide">Kapasitas Mesin Cuci Hari Ini</h3>
              {!isEditingQuota ? (
                <p className="text-indigo-100 text-lg mt-1 font-semibold tracking-wider">{currentLoad} <span className="text-indigo-200">/ {maxQuota} Kg</span></p>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-indigo-100 font-medium text-lg">{currentLoad} /</span>
                  <input type="number" value={tempQuota} onChange={(e) => setTempQuota(e.target.value)} className="w-24 px-3 py-1.5 bg-white/20 border border-white/30 rounded-lg text-white font-bold outline-none focus:bg-white/30 transition-colors" autoFocus />
                  <span className="text-indigo-100">Kg</span>
                </div>
              )}
            </div>
          </div>
          <div>
            {!isEditingQuota ? (
              <button onClick={() => { setTempQuota(maxQuota); setIsEditingQuota(true); }} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg">
                ✏️ Edit Kuota
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setIsEditingQuota(false)} className="bg-slate-900/40 hover:bg-slate-900/60 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Batal</button>
                <button onClick={handleSaveQuota} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition-colors">Simpan</button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-slate-900/30 h-3 rounded-full overflow-hidden border border-white/10">
           <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercentage}%` }}>
             <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
           </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* IMPLEMENTASI KOMPONEN STATS DAISY UI (Sudah Disesuaikan)  */}
      {/* ========================================================= */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-slate-200/60 w-full bg-white rounded-3xl">
        
        {/* Stat 1: Pendapatan */}
        <div className="stat">
          <div className="stat-figure text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Pendapatan Hari Ini</div>
          <div className="stat-value text-emerald-600 mt-1">Rp 350K</div>
          <div className="stat-desc text-emerald-500 font-medium mt-1">↗︎ 21% lebih tinggi dari kemarin</div>
        </div>
        
        {/* Stat 2: Pesanan Aktif */}
        <div className="stat">
          <div className="stat-figure text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Pesanan Aktif</div>
          <div className="stat-value text-indigo-600 mt-1">13 Nota</div>
          <div className="stat-desc text-slate-500 font-medium mt-1">5 Siap Diambil, 8 Proses</div>
        </div>
        
        {/* Stat 3: Pelanggan Baru */}
        <div className="stat">
          <div className="stat-figure text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Total Pelanggan</div>
          <div className="stat-value text-purple-600 mt-1">142</div>
          <div className="stat-desc text-purple-500 font-medium mt-1">↗︎ 4 Pelanggan Baru minggu ini</div>
        </div>
        
      </div>

      {/* Tabel Transaksi Mewah (Tetap Dipertahankan) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Transaksi Terakhir</h2>
          {/* <button className="text-sm bg-white border border-slate-200 shadow-sm text-indigo-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold tracking-wide transition-colors">Lihat Semua →</button> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-8 py-5 font-bold">ID Nota</th>
                <th className="px-8 py-5 font-bold">Pelanggan</th>
                <th className="px-8 py-5 font-bold">Layanan</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 text-slate-900 font-extrabold">{order.id}</td>
                  <td className="px-8 py-5 text-slate-600">{order.nama}</td>
                  <td className="px-8 py-5 text-slate-500">{order.layanan}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${getStatusColor(order.status)} border-current/20`}>{order.status}</span>
                  </td>
                  <td className="px-8 py-5 font-extrabold text-slate-800 text-right group-hover:text-indigo-600 transition-colors">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOwner;


// import { useState } from "react";

// const DashboardOwner = () => {
//   const [currentLoad, setCurrentLoad] = useState(50);
//   const [maxQuota, setMaxQuota] = useState(150);
//   const [isEditingQuota, setIsEditingQuota] = useState(false);
//   const [tempQuota, setTempQuota] = useState(150);

//   const progressPercentage = Math.min((currentLoad / maxQuota) * 100, 100);

//   const handleSaveQuota = () => {
//     setMaxQuota(Number(tempQuota));
//     setIsEditingQuota(false);
//   };

//   const stats = [
//     { id: 1, title: "Pendapatan Hari Ini", value: "Rp 350.000", icon: "💰", color: "bg-emerald-100 text-emerald-600" },
//     { id: 2, title: "Cucian Baru", value: "8 Pesanan", icon: "🧺", color: "bg-indigo-100 text-indigo-600" },
//     { id: 3, title: "Siap Diambil", value: "5 Pesanan", icon: "✅", color: "bg-amber-100 text-amber-600" },
//     { id: 4, title: "Total Pelanggan", value: "142 Orang", icon: "👥", color: "bg-purple-100 text-purple-600" },
//   ];

//   const recentOrders = [
//     { id: "TRX-001", nama: "Budi Santoso", layanan: "Cuci Komplit", status: "Baru", total: "Rp 45.000", tanggal: "10 Mei 2026" },
//     { id: "TRX-002", nama: "Siti Aminah", layanan: "Setrika Saja", status: "Diproses", total: "Rp 20.000", tanggal: "10 Mei 2026" },
//     { id: "TRX-003", nama: "Andi Saputra", layanan: "Cuci Kering", status: "Selesai", total: "Rp 35.000", tanggal: "09 Mei 2026" },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Baru": return "bg-indigo-100 text-indigo-700";
//       case "Diproses": return "bg-amber-100 text-amber-700";
//       case "Selesai": return "bg-emerald-100 text-emerald-700";
//       default: return "bg-slate-100 text-slate-700";
//     }
//   };

//   return (
//     <div className="space-y-8 pb-10">
//       <div>
//         <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Owner</h1>
//         <p className="text-slate-500 mt-1.5 font-medium">Ringkasan aktivitas dan performa laundry hari ini.</p>
//       </div>

//       {/* Banner Kuota Super Mewah */}
//       <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div className="flex items-center gap-5">
//             <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/10">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
//             </div>
//             <div>
//               <h3 className="font-bold text-xl tracking-wide">Kapasitas Mesin Cuci Hari Ini</h3>
//               {!isEditingQuota ? (
//                 <p className="text-indigo-100 text-md mt-1 font-semibold tracking-wider">{currentLoad} <span className="text-indigo-200">/ {maxQuota} Kg</span></p>
//               ) : (
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="text-indigo-100 font-medium">{currentLoad} /</span>
//                   <input type="number" value={tempQuota} onChange={(e) => setTempQuota(e.target.value)} className="w-20 px-3 py-1.5 bg-white/20 border border-white/30 rounded-lg text-white font-bold outline-none focus:bg-white/30 transition-colors" autoFocus />
//                   <span className="text-indigo-100">Kg</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div>
//             {!isEditingQuota ? (
//               <button onClick={() => { setTempQuota(maxQuota); setIsEditingQuota(true); }} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg">
//                 ✏️ Edit Kuota
//               </button>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <button onClick={() => setIsEditingQuota(false)} className="bg-slate-900/40 hover:bg-slate-900/60 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Batal</button>
//                 <button onClick={handleSaveQuota} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition-colors">Simpan</button>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="mt-6 bg-slate-900/30 h-3 rounded-full overflow-hidden border border-white/10">
//            <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercentage}%` }}>
//              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
//            </div>
//         </div>
//       </div>

//       {/* Grid Kartu Statistik */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div key={stat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
//             <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition-transform ${stat.color}`}>
//               {stat.icon}
//             </div>
//             <div>
//               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.title}</p>
//               <h3 className="text-2xl font-extrabold text-slate-800">{stat.value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tabel Transaksi Mewah */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
//         <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//           <h2 className="text-lg font-bold text-slate-800">Transaksi Terakhir</h2>
//           <button className="text-sm text-indigo-600 hover:text-indigo-800 font-bold tracking-wide">Lihat Semua →</button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
//                 <th className="px-8 py-4 font-bold">ID Nota</th>
//                 <th className="px-8 py-4 font-bold">Pelanggan</th>
//                 <th className="px-8 py-4 font-bold">Layanan</th>
//                 <th className="px-8 py-4 font-bold">Status</th>
//                 <th className="px-8 py-4 font-bold text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm font-medium">
//               {recentOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
//                   <td className="px-8 py-5 text-slate-900 font-bold">{order.id}</td>
//                   <td className="px-8 py-5 text-slate-600">{order.nama}</td>
//                   <td className="px-8 py-5 text-slate-500">{order.layanan}</td>
//                   <td className="px-8 py-5">
//                     <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStatusColor(order.status)}`}>{order.status}</span>
//                   </td>
//                   <td className="px-8 py-5 font-bold text-slate-800 text-right group-hover:text-indigo-600 transition-colors">{order.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOwner;