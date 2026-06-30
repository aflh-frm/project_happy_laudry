import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const DashboardOwner = () => {
  // State Kuota Mesin Cuci (Sekarang bersumber penuh dari Database)
  const [currentLoad, setCurrentLoad] = useState(0);
  const [maxQuota, setMaxQuota] = useState(150);
  
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [tempQuota, setTempQuota] = useState(maxQuota);

  // State Data Master
  const [transaksiList, setTransaksiList] = useState([]);
  const [totalPelanggan, setTotalPelanggan] = useState(0);
  const [loading, setLoading] = useState(true);

  const progressPercentage = Math.min((currentLoad / maxQuota) * 100, 100);

  const API_TRANSAKSI = "http://localhost:8000/api/transaksi";
  const API_PELANGGAN = "http://localhost:8000/api/pelanggan";
  const API_KUOTA = "http://localhost:8000/api/kuota";

  // AMBIL DATA DASHBOARD & DATA KUOTA DARI DATABASE
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resTransaksi, resPelanggan, resKuota] = await Promise.all([
        axios.get(API_TRANSAKSI),
        axios.get(API_PELANGGAN),
        axios.get(API_KUOTA)
      ]);

      setTransaksiList(resTransaksi.data);
      setTotalPelanggan(resPelanggan.data.length);
      
      // Mengambil nilai max_quota asli dari tabel MySQL kuotas
      setMaxQuota(resKuota.data.max_quota);
      setTempQuota(resKuota.data.max_quota);
      
      // Hitung total berat pesanan berstatus "Proses" untuk update Current Load otomatis
      const bebanAktif = resTransaksi.data
        .filter(trx => trx.status === "Proses")
        .reduce((total, trx) => total + (trx.berat || 0), 0);
      
      setCurrentLoad(bebanAktif);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // FUNGSI SIMPAN EDIT KUOTA KE DATABASE MYSQL LARAVEL
  const handleSaveQuota = async () => {
    try {
      await axios.put(API_KUOTA, { max_quota: Number(tempQuota) });
      
      setMaxQuota(Number(tempQuota));
      setIsEditingQuota(false);

      const Toast = Swal.mixin({
        toast: true, position: "top-end", showConfirmButton: false, timer: 1500
      });
      Toast.fire({ icon: "success", title: "Kuota berhasil diperbarui di database!" });
    } catch (error) {
      console.error("Gagal menyimpan kuota:", error);
      Swal.fire("Error", "Gagal menyimpan perubahan ke server.", "error");
    }
  };

  const totalPendapatan = transaksiList.reduce((sum, trx) => sum + trx.total_harga, 0);
  const pesananAktif = transaksiList.filter(trx => trx.status === "Proses").length;
  const pesananSelesai = transaksiList.filter(trx => trx.status === "Selesai").length;
  const recentOrders = transaksiList.slice(0, 5);

  const getStatusColor = (status) => {
    if (status === "Selesai") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Owner</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Ringkasan aktivitas dan performa laundry secara real-time.</p>
      </div>

      {/* Banner Kuota */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-xl tracking-wide">Kapasitas Mesin Cuci Aktif</h3>
              {!isEditingQuota ? (
                <p className="text-indigo-100 text-lg mt-1 font-semibold tracking-wider">{currentLoad} <span className="text-indigo-200">/ {maxQuota} Kg</span></p>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-indigo-100 font-medium text-lg">{currentLoad} /</span>
                  <input type="number" value={tempQuota} onChange={(e) => setTempQuota(e.target.value)} className="w-24 px-3 py-1.5 bg-white/20 border border-white/30 rounded-lg text-white font-bold outline-none" autoFocus />
                  <span className="text-indigo-100">Kg</span>
                </div>
              )}
            </div>
          </div>
          <div>
            {!isEditingQuota ? (
              <button onClick={() => { setTempQuota(maxQuota); setIsEditingQuota(true); }} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg">
                ✏️ Edit Kuota Maksimal
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setIsEditingQuota(false)} className="bg-slate-900/40 text-white px-4 py-2.5 rounded-xl text-sm font-medium">Batal</button>
                <button onClick={handleSaveQuota} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg">Simpan</button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-slate-900/30 h-3 rounded-full overflow-hidden border border-white/10">
           <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* STATS DAISYUI */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-slate-200/60 w-full bg-white rounded-3xl">
        <div className="stat">
          <div className="stat-figure text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Total Omzet Keseluruhan</div>
          <div className="stat-value text-emerald-600 mt-1">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
          <div className="stat-desc text-emerald-500 font-medium mt-1">Dari {transaksiList.length} total transaksi</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Cucian Diproses</div>
          <div className="stat-value text-indigo-600 mt-1">{pesananAktif} Nota</div>
          <div className="stat-desc text-slate-500 font-medium mt-1">{pesananSelesai} Nota telah selesai</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div className="stat-title text-slate-500 font-bold uppercase text-xs tracking-wider">Total Pelanggan</div>
          <div className="stat-value text-purple-600 mt-1">{totalPelanggan}</div>
          <div className="stat-desc text-purple-500 font-medium mt-1">Terdaftar dalam sistem</div>
        </div>
      </div>

      {/* TABEL TRANSAKSI TERBARU */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">📊 5 Transaksi Terakhir</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-8 py-5 font-bold">Tanggal</th>
                <th className="px-8 py-5 font-bold">ID Nota</th>
                <th className="px-8 py-5 font-bold">Pelanggan</th>
                <th className="px-8 py-5 font-bold">Layanan</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-400">Belum ada transaksi tercatat.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 text-slate-500">{formatDate(order.created_at)}</td>
                    <td className="px-8 py-5 text-slate-900 font-extrabold">{order.id_nota}</td>
                    <td className="px-8 py-5 text-slate-600 capitalize">{order.pelanggan?.nama || "Terhapus"}</td>
                    <td className="px-8 py-5 text-slate-500">{order.layanan?.nama || "Pakaian Satuan"}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${getStatusColor(order.status)}`}>
                        {order.status === "Selesai" ? "Siap Diambil" : "Diproses"}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-extrabold text-slate-800 text-right">
                      Rp {order.total_harga.toLocaleString('id-ID')}
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

export default DashboardOwner;