import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetailNota = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const jenisPakaianList = ["Kaos", "Kemeja", "Celana Panjang", "Handuk", "Sprei", "Jas", "Jaket"];

  const [nota, setNota] = useState({
    pelanggan: "Budi Santoso", hp: "08123456789", layanan: "Cuci Komplit (Reguler)", berat: 5,
    rincian: [{ jenis: "Kaos", jumlah: 3 }, { jenis: "Celana Panjang", jumlah: 2 }], status: "Proses"
  });

  const [tempPakaian, setTempPakaian] = useState(jenisPakaianList[0]);
  const [tempJumlah, setTempJumlah] = useState(1);

  const tambahRincian = (e) => {
    e.preventDefault();
    if (tempJumlah > 0) { setNota({ ...nota, rincian: [...nota.rincian, { jenis: tempPakaian, jumlah: tempJumlah }] }); setTempJumlah(1); }
  };
  const hapusRincian = (index) => setNota({ ...nota, rincian: nota.rincian.filter((_, i) => i !== index) });

  const handleSimpan = (e) => {
    e.preventDefault();
    alert(`Nota ${id} berhasil diperbarui!\nStatus saat ini: ${nota.status}`);
    navigate("/karyawan/kelola-nota");
  };

  return (
    <div className="space-y-8 max-w-4xl pb-10 mx-auto">
      <div className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200/60 transition-all transform hover:-translate-x-1 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Nota: {id}</h1>
          <p className="text-slate-500 mt-1 font-medium">Periksa pesanan atau ubah status ke selesai.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <form onSubmit={handleSimpan} className="space-y-8">
          
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="relative z-10">
               <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Data Pelanggan</p>
               <p className="font-extrabold text-xl">{nota.pelanggan} <span className="font-medium text-indigo-200 text-base ml-2">({nota.hp})</span></p>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
                <span className="text-sm font-bold tracking-wide">ID: {id}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* KIRI: EDIT PESANAN */}
            <div className="space-y-6">
              <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">📝 Perbaiki Isi Pesanan</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Layanan</label>
                  <select value={nota.layanan} onChange={(e) => setNota({...nota, layanan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700">
                    <option value="Cuci Komplit (Reguler)">Cuci Komplit (Reguler)</option>
                    <option value="Cuci Komplit (Kilat)">Cuci Komplit (Kilat)</option>
                    <option value="Setrika Saja">Setrika Saja</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Berat / Jumlah (Kg/Pcs)</label>
                  <input type="number" value={nota.berat} onChange={(e) => setNota({...nota, berat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-extrabold text-slate-800 text-lg" />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <label className="block text-sm font-bold text-slate-700">Rincian Pakaian</label>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jenis Pakaian</label>
                    <select value={tempPakaian} onChange={(e) => setTempPakaian(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium">
                      {jenisPakaianList.map(jp => <option key={jp} value={jp}>{jp}</option>)}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jumlah</label>
                    <input type="number" min="1" value={tempJumlah} onChange={(e) => setTempJumlah(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-center" />
                  </div>
                  <button type="button" onClick={tambahRincian} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm">+ Add</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nota.rincian.length === 0 && <span className="text-sm text-slate-400 italic">Belum ada rincian.</span>}
                  {nota.rincian.map((item, index) => (
                    <span key={index} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                      <span className="text-indigo-600">{item.jumlah}x</span> {item.jenis}
                      <button type="button" onClick={() => hapusRincian(index)} className="text-slate-400 hover:text-rose-500 font-bold ml-1 transition-colors">✕</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* KANAN: UPDATE STATUS */}
            <div className="space-y-6">
              <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">🔄 Update Status Cucian</h2>
              <div className="flex flex-col gap-4">
                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${nota.status === "Proses" ? "bg-amber-50 border-amber-400 shadow-md shadow-amber-500/10" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                  <input type="radio" name="status" value="Proses" checked={nota.status === "Proses"} onChange={(e) => setNota({...nota, status: e.target.value})} className="w-6 h-6 text-amber-500 focus:ring-amber-500" />
                  <div>
                    <span className="block text-slate-800 font-extrabold text-lg">⏳ Sedang Diproses</span>
                    <span className="text-sm text-slate-500 font-medium">Cucian sedang dicuci / disetrika.</span>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${nota.status === "Selesai" ? "bg-emerald-50 border-emerald-400 shadow-md shadow-emerald-500/10" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                  <input type="radio" name="status" value="Selesai" checked={nota.status === "Selesai"} onChange={(e) => setNota({...nota, status: e.target.value})} className="w-6 h-6 text-emerald-500 focus:ring-emerald-500" />
                  <div>
                    <span className="block text-slate-800 font-extrabold text-lg">✅ Selesai (Siap Diambil)</span>
                    <span className="text-sm text-slate-500 font-medium">Cucian rapi dan siap diserahkan.</span>
                  </div>
                </label>
              </div>
              
              <div className="pt-6">
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1 text-lg">
                  Simpan Perubahan Nota
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailNota;