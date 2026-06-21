import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const KelolaNota = () => {
  const navigate = useNavigate();

  // State untuk menampung daftar transaksi asli dari database
  const [daftarTransaksi, setDaftarTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const API_TRANSAKSI = "http://localhost:8000/api/transaksi";

  // 1. AMBIL SEMUA DATA TRANSAKSI DARI LARAVEL
  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_TRANSAKSI);
      setDaftarTransaksi(response.data);
      setFilteredTransaksi(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
      setLoading(false);
      Swal.fire("Error!", "Gagal mengambil data transaksi dari server.", "error");
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  // 2. LOGIKA PENCARIAN (Bisa cari berdasarkan ID Nota atau Nama Pelanggan)
  useEffect(() => {
    const hasilFilter = daftarTransaksi.filter((item) => {
      const matchNota = item.id_nota.toLowerCase().includes(keyword.toLowerCase());
      const matchNama = item.pelanggan?.nama.toLowerCase().includes(keyword.toLowerCase());
      return matchNota || matchNama;
    });
    setFilteredTransaksi(hasilFilter);
  }, [keyword, daftarTransaksi]);

  // 3. LOGIKA WARNA BADGE STATUS DAISYUI
  const getStatusBadge = (status) => {
    if (status === "Selesai") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
        <p className="text-slate-500 font-medium">Memuat daftar transaksi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Nota & Status</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Pantau status cucian dan riwayat transaksi kasir.</p>
        </div>
        <button 
          onClick={() => navigate("/karyawan/input-cucian")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
        >
          + Buka Kasir Baru
        </button>
      </div>

      {/* FILTER PENCARIAN INSTAN */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="relative mb-6">
          <input 
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari berdasarkan ID Nota atau Nama Pelanggan..."
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 shadow-inner"
          />
          <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* TABEL DATA TRANSAKSI */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-4 font-bold">ID Nota</th>
                <th className="px-4 py-4 font-bold">Pelanggan</th>
                <th className="px-4 py-4 font-bold">Layanan Utama</th>
                <th className="px-4 py-4 font-bold">Total Bayar</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-4 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredTransaksi.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 rounded-2xl">
                    <span className="block text-4xl mb-2">🔍</span>
                    Tidak ada riwayat transaksi atau nota tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransaksi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-4 py-5 text-slate-900 font-extrabold text-base">{item.id_nota}</td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">{item.pelanggan?.nama || "Pelanggan Terhapus"}</span>
                        <span className="text-xs text-slate-400 font-mono">{item.pelanggan?.hp || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-slate-600">
                      {item.layanan ? (
                        <span>
                          {item.layanan.nama}{" "}
                          <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-md ml-1">
                            {item.berat} {item.layanan.satuan}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs bg-slate-100 px-2 py-1 rounded-md">
                          Hanya Baju Satuan
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-5 font-extrabold text-slate-800 text-base">
                      Rp {item.total_harga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusBadge(item.status)}`}>
                        {item.status === "Selesai" ? "Siap Diambil" : "Diproses"}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button 
                        onClick={() => navigate(`/karyawan/detail-nota/${item.id_nota}`)}
                        className="bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <span>Atur Status</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
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

export default KelolaNota;




// import { Link } from "react-router-dom";

// const KelolaNota = () => {
//   const daftarNota = [
//     { id: "TRX-001", nama: "Budi Santoso", status: "Proses", total: 45000 },
//     { id: "TRX-002", nama: "Siti Aminah", status: "Proses", total: 20000 },
//     { id: "TRX-003", nama: "Andi Saputra", status: "Selesai", total: 35000 },
//   ];

//   return (
//     <div className="space-y-8 pb-10 max-w-6xl mx-auto">
//       <div>
//         <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Nota</h1>
//         <p className="text-slate-500 mt-1.5 font-medium">Pantau pesanan masuk dan perbarui status cucian.</p>
//       </div>

//       <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
//                 <th className="px-6 py-4 font-bold">ID Nota</th>
//                 <th className="px-6 py-4 font-bold">Pelanggan</th>
//                 <th className="px-6 py-4 font-bold text-center">Status</th>
//                 <th className="px-6 py-4 font-bold text-right">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm font-medium">
//               {daftarNota.map((nota) => (
//                 <tr key={nota.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
//                   <td className="px-6 py-5 font-extrabold text-slate-900 text-base">{nota.id}</td>
//                   <td className="px-6 py-5 text-slate-600 text-base">{nota.nama}</td>
//                   <td className="px-6 py-5 text-center">
//                     <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${nota.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
//                       {nota.status === "Proses" ? "⏳ Proses" : "✅ Selesai"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5 text-right">
//                     <Link to={`/karyawan/kelola-nota/${nota.id}`} className="bg-slate-800 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors inline-block shadow-md hover:shadow-indigo-500/30">
//                       Buka Detail
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KelolaNota;