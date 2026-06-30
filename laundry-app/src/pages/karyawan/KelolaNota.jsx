import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as htmlToImage from "html-to-image";

const KelolaNota = () => {
  const navigate = useNavigate();

  const [daftarTransaksi, setDaftarTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // State & Ref untuk fitur Download Struk
  const [strukData, setStrukData] = useState(null);
  const strukRef = useRef(null);

  const API_TRANSAKSI = "http://localhost:8000/api/transaksi";

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
      Swal.fire("Error!", "Gagal mengambil data dari server.", "error");
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  useEffect(() => {
    const hasilFilter = daftarTransaksi.filter((item) => {
      const matchNota = item.id_nota.toLowerCase().includes(keyword.toLowerCase());
      const matchNama = item.pelanggan?.nama.toLowerCase().includes(keyword.toLowerCase());
      return matchNota || matchNama;
    });
    setFilteredTransaksi(hasilFilter);
  }, [keyword, daftarTransaksi]);

  const getStatusBadge = (status) => {
    if (status === "Selesai") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
    });
  };

  const parseRincian = (data) => {
    if (!data) return [];
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return Array.isArray(data) ? data : [];
  };

  // FUNGSI BARU MENGGUNAKAN HTML-TO-IMAGE (ANTI OKLCH ERROR)
  const downloadStruk = (trx) => {
    setStrukData(trx);
    
    setTimeout(async () => {
      if (strukRef.current) {
        try {
          // html-to-image jauh lebih stabil dan tahan terhadap modern CSS
          const dataUrl = await htmlToImage.toPng(strukRef.current, {
            quality: 1.0,
            pixelRatio: 2, // Resolusi tinggi
            backgroundColor: '#ffffff'
          });
          
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `Struk_${trx.id_nota}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setStrukData(null); 
          
          Swal.fire({ 
            toast: true, position: "top-end", showConfirmButton: false, timer: 2000, 
            icon: "success", title: "Struk berhasil diunduh!" 
          });
        } catch (error) {
          console.error("Gagal mengunduh struk:", error);
          Swal.fire("Error", "Gagal memproses gambar. Cek console.", "error");
          setStrukData(null);
        }
      }
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Nota & Status</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Pantau status cucian dan unduh struk transaksi pelanggan.</p>
        </div>
        <button 
          onClick={() => navigate("/karyawan/input-cucian")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
        >
          + Buka Kasir Baru
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="relative mb-6">
          <input 
            type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari berdasarkan ID Nota atau Nama Pelanggan..."
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-inner"
          />
          <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-4 font-bold whitespace-nowrap">ID Nota</th>
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
                    <span className="block text-4xl mb-2">🔍</span> Tidak ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                filteredTransaksi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-4 py-5 text-slate-900 font-extrabold text-base whitespace-nowrap">{item.id_nota}</td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold capitalize">{item.pelanggan?.nama || "Terhapus"}</span>
                        <span className="text-xs text-slate-400 font-mono">{item.pelanggan?.hp || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-slate-600">
                      {item.layanan ? (
                        <span className="whitespace-nowrap">
                          {item.layanan.nama} <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-md ml-1">{item.berat} {item.layanan.satuan}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">Hanya Satuan</span>
                      )}
                    </td>
                    <td className="px-4 py-5 font-extrabold text-slate-800 text-base whitespace-nowrap">
                      Rp {item.total_harga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm whitespace-nowrap ${getStatusBadge(item.status)}`}>
                        {item.status === "Selesai" ? "Siap Diambil" : "Diproses"}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => downloadStruk(item)}
                        className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl transition-all shadow-sm"
                        title="Unduh Struk"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/karyawan/detail-nota/${item.id_nota}`)}
                        className="bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Cek</span>
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

      {/* CETAKAN STRUK (Tidak menggunakan class Tailwind yang berpotensi memicu oklch, murni hex color) */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        <div 
          ref={strukRef} 
          style={{ width: '80mm', padding: '20px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'monospace', fontSize: '12px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '1px', margin: '0' }}>HAPPY LAUNDRY</h2>
            <p style={{ fontSize: '10px', margin: '4px 0 0 0' }}>Jl. Sudirman No.123, Kota Anda</p>
            <p style={{ fontSize: '10px', margin: '0' }}>Telp: 0812-3456-7890</p>
          </div>
          
          <div style={{ borderBottom: '2px dashed #000000', paddingBottom: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Nota</span>
              <span style={{ fontWeight: 'bold' }}>{strukData?.id_nota}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Tanggal</span>
              <span>{strukData ? formatDate(strukData.created_at) : ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Kasir</span>
              <span>{localStorage.getItem("userName") || "Karyawan"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px dotted #94a3b8' }}>
              <span>Pelanggan</span>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{strukData?.pelanggan?.nama || 'Guest'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Rincian Pesanan:</div>
            {strukData?.layanan && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>{strukData.layanan.nama} ({strukData.berat}{strukData.layanan.satuan})</span>
                <span>{(strukData.layanan.harga * strukData.berat).toLocaleString('id-ID')}</span>
              </div>
            )}
            
            {parseRincian(strukData?.rincian_pakaian).map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', paddingLeft: '8px' }}>
                <span>- {item.jumlah}x {item.jenis}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px dashed #000000', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>TOTAL BAYAR</span>
            <span style={{ fontWeight: '800', fontSize: '18px' }}>Rp {strukData?.total_harga?.toLocaleString('id-ID')}</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', fontStyle: 'italic', margin: '0' }}>Terima Kasih!</p>
            <p style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>Cucian yang tidak diambil dalam 30 hari<br/>bukan tanggung jawab kami.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaNota;