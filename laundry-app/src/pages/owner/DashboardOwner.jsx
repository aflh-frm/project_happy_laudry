import { useState } from "react";

const DashboardOwner = () => {
  // --- STATE UNTUK KUOTA HARIAN ---
  const [currentLoad, setCurrentLoad] = useState(50); // Contoh: 50Kg sudah masuk hari ini
  const [maxQuota, setMaxQuota] = useState(150);      // Default max kuota 150Kg
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [tempQuota, setTempQuota] = useState(150);

  // Hitung persentase untuk mengisi bar kuota
  const progressPercentage = Math.min((currentLoad / maxQuota) * 100, 100);

  const handleSaveQuota = () => {
    setMaxQuota(Number(tempQuota));
    setIsEditingQuota(false);
  };

  // Data Dummy untuk Statistik
  const stats = [
    { id: 1, title: "Pendapatan Hari Ini", value: "Rp 350.000", icon: "💰", color: "bg-green-100 text-green-600" },
    { id: 2, title: "Cucian Baru", value: "8 Pesanan", icon: "🧺", color: "bg-blue-100 text-blue-600" },
    { id: 3, title: "Siap Diambil", value: "5 Pesanan", icon: "✅", color: "bg-yellow-100 text-yellow-600" },
    { id: 4, title: "Total Pelanggan", value: "142 Orang", icon: "👥", color: "bg-purple-100 text-purple-600" },
  ];

  // Data Dummy untuk Transaksi Terakhir
  const recentOrders = [
    { id: "TRX-001", nama: "Budi Santoso", layanan: "Cuci Komplit", status: "Baru", total: "Rp 45.000", tanggal: "10 Mei 2026" },
    { id: "TRX-002", nama: "Siti Aminah", layanan: "Setrika Saja", status: "Diproses", total: "Rp 20.000", tanggal: "10 Mei 2026" },
    { id: "TRX-003", nama: "Andi Saputra", layanan: "Cuci Kering", status: "Selesai", total: "Rp 35.000", tanggal: "09 Mei 2026" },
    { id: "TRX-004", nama: "Rina Melati", layanan: "Cuci Komplit (Kilat)", status: "Diambil", total: "Rp 60.000", tanggal: "09 Mei 2026" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Baru": return "bg-blue-100 text-blue-700";
      case "Diproses": return "bg-yellow-100 text-yellow-700";
      case "Selesai": return "bg-green-100 text-green-700";
      case "Diambil": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard Owner</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas laundry hari ini.</p>
      </div>

      {/* BANNER KUOTA HARIAN (Sesuai Referensi Gambar) */}
      <div className="bg-blue-500 rounded-xl p-5 shadow-md text-white relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Info Kiri (Ikon + Teks) */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-400 p-3 rounded-lg shadow-inner">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Jumlah Cucian Hari ini</h3>
              
              {/* Logika Tampilan: Edit Mode vs Tampilan Biasa */}
              {!isEditingQuota ? (
                <p className="text-blue-100 text-sm mt-1 font-medium tracking-wide">
                  {currentLoad} / {maxQuota}Kg
                </p>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-100 text-sm">{currentLoad} /</span>
                  <input 
                    type="number" 
                    value={tempQuota}
                    onChange={(e) => setTempQuota(e.target.value)}
                    className="w-16 px-2 py-1 text-gray-900 rounded-md text-sm outline-none font-bold shadow-sm"
                    autoFocus
                  />
                  <span className="text-blue-100 text-sm">Kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Aksi Kanan */}
          <div>
            {!isEditingQuota ? (
              <button 
                onClick={() => {
                  setTempQuota(maxQuota);
                  setIsEditingQuota(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors font-semibold flex items-center gap-2 shadow"
              >
                ✏️ Edit Kuota
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditingQuota(false)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors font-medium"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveQuota}
                  className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-lg text-sm transition-colors font-bold shadow"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Bawah */}
        <div className="mt-5 bg-blue-700/50 h-2.5 rounded-full overflow-hidden">
           <div 
             className="bg-white h-full rounded-full transition-all duration-700 ease-out"
             style={{ width: `${progressPercentage}%` }}
           ></div>
        </div>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`text-2xl lg:text-3xl w-12 h-12 flex items-center justify-center rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Transaksi Terakhir */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Lihat Semua</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="px-6 py-3 font-medium">ID Nota</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Layanan</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-700">{order.nama}</td>
                  <td className="px-6 py-4 text-gray-500">{order.layanan}</td>
                  <td className="px-6 py-4 text-gray-500">{order.tanggal}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{order.total}</td>
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