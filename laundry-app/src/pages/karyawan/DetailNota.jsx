import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DetailNota = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notaData, setNotaData] = useState(null);

  // State untuk form edit
  const [layanan, setLayanan] = useState("");
  const [berat, setBerat] = useState(0);
  const [rincian, setRincian] = useState([]);
  
  const [dataLayanan, setDataLayanan] = useState([]);
  const [dataPakaianSpesifik, setDataPakaianSpesifik] = useState([]);
  const [tempPakaian, setTempPakaian] = useState("");
  const [tempJumlah, setTempJumlah] = useState(1);

  const API_TRANSAKSI = `http://localhost:8000/api/transaksi/${id}`;
  const API_LAYANAN = "http://localhost:8000/api/layanan";
  const API_PAKAIAN = "http://localhost:8000/api/pakaian";

  // 1. AMBIL DATA TRANSAKSI & MASTER DATA
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [resTransaksi, resLayanan, resPakaian] = await Promise.all([
        axios.get(API_TRANSAKSI),
        axios.get(API_LAYANAN),
        axios.get(API_PAKAIAN)
      ]);

      const trx = resTransaksi.data;
      setNotaData(trx);
      
      // Masukkan data asli ke dalam state form agar bisa diedit
      setLayanan(trx.layanan_id || "");
      setBerat(trx.berat || 0);
      setRincian(trx.rincian_pakaian || []);

      setDataLayanan(resLayanan.data);
      setDataPakaianSpesifik(resPakaian.data);

      if (resPakaian.data.length > 0) {
        setTempPakaian(resPakaian.data[0].nama);
      }
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Error", "Nota tidak ditemukan atau server mati.", "error")
        .then(() => navigate("/karyawan/kelola-nota"));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  // 2. LOGIKA HITUNG BIAYA (Real-time saat diedit)
  const layananTerpilih = dataLayanan.find(l => l.id === Number(layanan));
  const biayaDasar = layananTerpilih ? layananTerpilih.harga * berat : 0;

  const getHargaPakaian = (namaJenis) => {
    const pakaian = dataPakaianSpesifik.find(p => p.nama === namaJenis);
    return pakaian ? pakaian.harga : 0;
  };

  const biayaTambahan = rincian.reduce((total, item) => {
    return total + (getHargaPakaian(item.jenis) * item.jumlah);
  }, 0);

  const totalTagihan = biayaDasar + biayaTambahan;

  // 3. HANDLER FORM EDIT
  const tambahRincian = () => {
    if (!tempPakaian) return;
    if (tempJumlah > 0) {
      setRincian([...rincian, { jenis: tempPakaian, jumlah: tempJumlah }]);
      setTempJumlah(1);
    }
  };
  
  const hapusRincian = (index) => setRincian(rincian.filter((_, i) => i !== index));

  const handleSimpanEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        layanan_id: layanan ? Number(layanan) : null,
        berat: layanan ? berat : 0,
        rincian_pakaian: rincian,
        total_harga: totalTagihan,
        status: notaData.status // Status tetap tidak berubah saat edit pesanan
      };

      await axios.put(API_TRANSAKSI, payload);
      
      Swal.fire({
        title: "Berhasil Diperbarui!",
        text: `Rincian pesanan untuk nota ${id} telah tersimpan.`,
        icon: "success",
        confirmButtonColor: "#4f46e5"
      });
      fetchAllData(); // Refresh tampilan setelah sukses
    } catch (error) {
      console.error("Gagal update data:", error);
      Swal.fire("Error!", "Gagal menyimpan perubahan ke database.", "error");
    }
  };

  // 4. HANDLER UPDATE STATUS
  const ubahStatus = async (statusBaru) => {
    try {
      await axios.put(API_TRANSAKSI, { status: statusBaru });
      Swal.fire({
        title: "Status Diperbarui!",
        text: `Status cucian berubah menjadi: ${statusBaru === 'Selesai' ? 'Siap Diambil' : 'Sedang Diproses'}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      fetchAllData();
    } catch (error) {
      Swal.fire("Error!", "Gagal memperbarui status.", "error");
    }
  };

  if (loading || !notaData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-10 mx-auto">
      <div className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200/60 transition-all transform hover:-translate-x-1 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Nota: {notaData.id_nota}</h1>
          <p className="text-slate-500 mt-1 font-medium">Perbaiki isi pesanan atau ubah status ke selesai.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Data Pelanggan</p>
              <p className="font-extrabold text-xl">
                {notaData.pelanggan?.nama || "Terhapus"} 
                <span className="font-medium text-indigo-200 text-base ml-2">
                  ({notaData.pelanggan?.hp || "-"})
                </span>
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
              <span className="text-sm font-bold tracking-wide">ID: {notaData.id_nota}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ========================================== */}
          {/* KIRI: EDIT PESANAN & RINCIAN BIAYA         */}
          {/* ========================================== */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">📝 Perbaiki Isi Pesanan</h2>
            <form onSubmit={handleSimpanEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Layanan Dasar</label>
                  <select value={layanan} onChange={(e) => setLayanan(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 cursor-pointer">
                    <option value="">-- Tanpa Layanan Dasar --</option>
                    {dataLayanan.map(l => (
                      <option key={l.id} value={l.id}>{l.nama} (Rp {l.harga}/{l.satuan})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Berat / Jumlah</label>
                  <input type="number" min="1" value={berat} onChange={(e) => setBerat(Number(e.target.value))} disabled={!layanan} className={`w-full border rounded-xl px-4 py-3 outline-none transition-all font-bold text-lg ${!layanan ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`} />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <label className="block text-sm font-bold text-slate-700">Rincian Pakaian Terpisah</label>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jenis Pakaian</label>
                    <select value={tempPakaian} onChange={(e) => setTempPakaian(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium cursor-pointer">
                      {dataPakaianSpesifik.map(p => (
                        <option key={p.id} value={p.nama}>
                          {p.nama} {p.harga > 0 ? `(+Rp ${p.harga.toLocaleString('id-ID')})` : '(Termasuk Kiloan)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-24">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jumlah</label>
                    <input type="number" min="1" value={tempJumlah} onChange={(e) => setTempJumlah(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-center" />
                  </div>
                  <button type="button" onClick={tambahRincian} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-sm">+ Add</button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {rincian.length === 0 && <span className="text-sm text-slate-400 italic">Tidak ada rincian pakaian.</span>}
                  {rincian.map((item, index) => {
                    const hargaItem = getHargaPakaian(item.jenis);
                    return (
                      <span key={index} className={`border px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm ${hargaItem > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-700'}`}>
                        <span className={hargaItem > 0 ? "text-amber-600" : "text-indigo-600"}>{item.jumlah}x</span> {item.jenis}
                        <button type="button" onClick={() => hapusRincian(index)} className="text-slate-400 hover:text-rose-500 font-bold ml-1 transition-colors">✕</button>
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* KOTAK RINGKASAN BIAYA */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-inner relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700/50 pb-3 flex items-center gap-2">
                  🧾 Ringkasan Biaya
                </h3>
                
                <div className="space-y-3 text-sm relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      {layananTerpilih ? `${layananTerpilih.nama} (${berat} ${layananTerpilih.satuan})` : "Tanpa Layanan Dasar"}
                    </span>
                    <span className="font-bold">Rp {biayaDasar.toLocaleString('id-ID')}</span>
                  </div>
                  
                  {rincian.map((r, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-slate-300 pl-4 relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-slate-600"></span>
                        {r.jumlah}x {r.jenis} <span className="text-slate-500 text-xs">(@{getHargaPakaian(r.jenis).toLocaleString('id-ID')})</span>
                      </span>
                      <span className="font-bold text-amber-400">+ Rp {(r.jumlah * getHargaPakaian(r.jenis)).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700/80 pt-4 mt-4 flex justify-between items-center relative z-10">
                  <span className="text-indigo-300 font-bold uppercase tracking-wider text-xs">Total Tagihan</span>
                  <span className="text-3xl font-extrabold text-white">Rp {totalTagihan.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <button type="submit" disabled={!layanan && rincian.length === 0} className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-md transition-all text-lg">
                Simpan Perubahan Pesanan
              </button>
            </form>
          </div>

          {/* ========================================== */}
          {/* KANAN: TIMELINE STATUS DAISYUI             */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">🔄 Pelacak Status Cucian</h2>
            
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center py-10 sticky top-28">
              <ul className="timeline timeline-vertical">
                <li>
                  <div className="timeline-start timeline-box border-none shadow-sm font-bold text-slate-700 bg-white">Pesanan Masuk</div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-indigo-600 h-6 w-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <hr className="bg-indigo-600" />
                </li>
                <li>
                  <hr className={notaData.status === "Selesai" || notaData.status === "Proses" ? "bg-indigo-600" : "bg-slate-200"} />
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-6 w-6 ${notaData.status === "Selesai" || notaData.status === "Proses" ? "text-indigo-600" : "text-slate-300"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <div className={`timeline-end timeline-box border-none shadow-sm font-bold ${notaData.status === "Selesai" || notaData.status === "Proses" ? "text-indigo-700 bg-white" : "text-slate-400 bg-slate-100"}`}>
                    Sedang Diproses
                  </div>
                  <hr className={notaData.status === "Selesai" ? "bg-indigo-600" : "bg-slate-200"} />
                </li>
                <li>
                  <hr className={notaData.status === "Selesai" ? "bg-indigo-600" : "bg-slate-200"} />
                  <div className={`timeline-start timeline-box border-none shadow-sm font-bold ${notaData.status === "Selesai" ? "text-emerald-700 bg-white" : "text-slate-400 bg-slate-100"}`}>
                    Siap Diambil
                  </div>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-6 w-6 ${notaData.status === "Selesai" ? "text-emerald-500" : "text-slate-300"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                </li>
              </ul>

              <div className="mt-8 w-full">
                {notaData.status === "Proses" ? (
                  <button onClick={() => ubahStatus("Selesai")} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2 text-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Tandai Siap Diambil
                  </button>
                ) : (
                  <button onClick={() => ubahStatus("Proses")} className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    Batalkan (Kembali ke Proses)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNota;



// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const DetailNota = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const jenisPakaianList = ["Kaos", "Kemeja", "Celana Panjang", "Handuk", "Sprei", "Jas", "Jaket"];

//   const [nota, setNota] = useState({
//     pelanggan: "Budi Santoso", hp: "08123456789", layanan: "Cuci Komplit (Reguler)", berat: 5,
//     rincian: [{ jenis: "Kaos", jumlah: 3 }, { jenis: "Celana Panjang", jumlah: 2 }], status: "Proses"
//   });

//   const [tempPakaian, setTempPakaian] = useState(jenisPakaianList[0]);
//   const [tempJumlah, setTempJumlah] = useState(1);

//   const tambahRincian = (e) => {
//     e.preventDefault();
//     if (tempJumlah > 0) { setNota({ ...nota, rincian: [...nota.rincian, { jenis: tempPakaian, jumlah: tempJumlah }] }); setTempJumlah(1); }
//   };
//   const hapusRincian = (index) => setNota({ ...nota, rincian: nota.rincian.filter((_, i) => i !== index) });

//   const handleSimpan = (e) => {
//     e.preventDefault();
//     alert(`Nota ${id} berhasil diperbarui!\nStatus saat ini: ${nota.status}`);
//     navigate("/karyawan/kelola-nota");
//   };

//   return (
//     <div className="space-y-8 max-w-4xl pb-10 mx-auto">
//       <div className="flex items-center gap-5">
//         <button onClick={() => navigate(-1)} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200/60 transition-all transform hover:-translate-x-1 flex items-center justify-center">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
//         </button>
//         <div>
//           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Nota: {id}</h1>
//           <p className="text-slate-500 mt-1 font-medium">Periksa pesanan atau ubah status ke selesai.</p>
//         </div>
//       </div>

//       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
//         <form onSubmit={handleSimpan} className="space-y-8">
          
//           <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center relative overflow-hidden">
//              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
//              <div className="relative z-10">
//                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Data Pelanggan</p>
//                <p className="font-extrabold text-xl">{nota.pelanggan} <span className="font-medium text-indigo-200 text-base ml-2">({nota.hp})</span></p>
//              </div>
//              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
//                 <span className="text-sm font-bold tracking-wide">ID: {id}</span>
//              </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//             {/* KIRI: EDIT PESANAN */}
//             <div className="space-y-6">
//               <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">📝 Perbaiki Isi Pesanan</h2>
//               <div className="grid grid-cols-2 gap-5">
//                 <div className="col-span-2">
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Layanan</label>
//                   <select value={nota.layanan} onChange={(e) => setNota({...nota, layanan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700">
//                     <option value="Cuci Komplit (Reguler)">Cuci Komplit (Reguler)</option>
//                     <option value="Cuci Komplit (Kilat)">Cuci Komplit (Kilat)</option>
//                     <option value="Setrika Saja">Setrika Saja</option>
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Berat / Jumlah (Kg/Pcs)</label>
//                   <input type="number" value={nota.berat} onChange={(e) => setNota({...nota, berat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-extrabold text-slate-800 text-lg" />
//                 </div>
//               </div>

//               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
//                 <label className="block text-sm font-bold text-slate-700">Rincian Pakaian</label>
//                 <div className="flex gap-3 items-end">
//                   <div className="flex-1">
//                     <label className="block text-xs font-bold text-slate-400 mb-1">Jenis Pakaian</label>
//                     <select value={tempPakaian} onChange={(e) => setTempPakaian(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium">
//                       {jenisPakaianList.map(jp => <option key={jp} value={jp}>{jp}</option>)}
//                     </select>
//                   </div>
//                   <div className="w-20">
//                     <label className="block text-xs font-bold text-slate-400 mb-1">Jumlah</label>
//                     <input type="number" min="1" value={tempJumlah} onChange={(e) => setTempJumlah(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-center" />
//                   </div>
//                   <button type="button" onClick={tambahRincian} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm">+ Add</button>
//                 </div>
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {nota.rincian.length === 0 && <span className="text-sm text-slate-400 italic">Belum ada rincian.</span>}
//                   {nota.rincian.map((item, index) => (
//                     <span key={index} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
//                       <span className="text-indigo-600">{item.jumlah}x</span> {item.jenis}
//                       <button type="button" onClick={() => hapusRincian(index)} className="text-slate-400 hover:text-rose-500 font-bold ml-1 transition-colors">✕</button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* KANAN: UPDATE STATUS */}
//             <div className="space-y-6">
//               <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">🔄 Update Status Cucian</h2>
//               <div className="flex flex-col gap-4">
//                 <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${nota.status === "Proses" ? "bg-amber-50 border-amber-400 shadow-md shadow-amber-500/10" : "bg-white border-slate-100 hover:border-slate-300"}`}>
//                   <input type="radio" name="status" value="Proses" checked={nota.status === "Proses"} onChange={(e) => setNota({...nota, status: e.target.value})} className="w-6 h-6 text-amber-500 focus:ring-amber-500" />
//                   <div>
//                     <span className="block text-slate-800 font-extrabold text-lg">⏳ Sedang Diproses</span>
//                     <span className="text-sm text-slate-500 font-medium">Cucian sedang dicuci / disetrika.</span>
//                   </div>
//                 </label>
//                 <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${nota.status === "Selesai" ? "bg-emerald-50 border-emerald-400 shadow-md shadow-emerald-500/10" : "bg-white border-slate-100 hover:border-slate-300"}`}>
//                   <input type="radio" name="status" value="Selesai" checked={nota.status === "Selesai"} onChange={(e) => setNota({...nota, status: e.target.value})} className="w-6 h-6 text-emerald-500 focus:ring-emerald-500" />
//                   <div>
//                     <span className="block text-slate-800 font-extrabold text-lg">✅ Selesai (Siap Diambil)</span>
//                     <span className="text-sm text-slate-500 font-medium">Cucian rapi dan siap diserahkan.</span>
//                   </div>
//                 </label>
//               </div>
              
//               <div className="pt-6">
//                 <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1 text-lg">
//                   Simpan Perubahan Nota
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DetailNota;