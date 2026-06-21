import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const KelolaPakaian = () => {
  // Hanya state untuk Pakaian Satuan (Terkoneksi ke Laravel)
  const [spesifikList, setSpesifikList] = useState([]);
  const [formData, setFormData] = useState({ id: null, nama: "", harga: "" });
  const [isEditingSpesifik, setIsEditingSpesifik] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8000/api/pakaian";

  // AMBIL DATA DARI LARAVEL
  const fetchDataPakaian = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSpesifikList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data pakaian:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPakaian();
  }, []);

  // SIMPAN ATAU UPDATE KE LARAVEL
  const handleSimpanSpesifik = async (e) => {
    e.preventDefault();
    try {
      if (isEditingSpesifik) { 
        await axios.put(`${API_URL}/${formData.id}`, formData);
        Swal.fire({ title: "Diperbarui!", text: "Harga pakaian berhasil diubah.", icon: "success", timer: 1500, showConfirmButton: false });
      } else { 
        await axios.post(API_URL, formData);
        Swal.fire({ title: "Tersimpan!", text: "Data pakaian berhasil disimpan.", icon: "success", timer: 1500, showConfirmButton: false });
      }
      fetchDataPakaian(); // Refresh data
      setFormData({ id: null, nama: "", harga: "" }); 
      setIsEditingSpesifik(false);
    } catch (error) {
      Swal.fire("Error!", "Gagal menyimpan data ke database.", "error");
    }
  };

  // HAPUS DARI LARAVEL
  const hapusSpesifik = (id) => { 
    Swal.fire({
      title: "Hapus Pakaian?",
      text: "Data ini tidak akan muncul lagi di halaman kasir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          fetchDataPakaian(); // Refresh data
          Swal.fire({ title: "Terhapus!", text: "Pakaian berhasil dihapus.", icon: "success", confirmButtonColor: "#4f46e5" });
        } catch (error) {
          Swal.fire("Error!", "Gagal menghapus data.", "error");
        }
      }
    });
  };

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Pakaian Satuan</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Atur tarif khusus untuk pakaian satuan seperti Jas, Karpet, atau Sepatu.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        
        <form onSubmit={handleSimpanSpesifik} className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <h2 className="text-white font-bold mb-6 flex items-center gap-2 relative z-10">
            {isEditingSpesifik ? "✏️ Edit Pakaian Satuan" : "👔 Tambah Pakaian Satuan Baru"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Pakaian</label>
              <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="Jas, Karpet, Sepatu..." />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Harga Per Pcs (Rp)</label>
              <input type="number" required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="15000" />
            </div>
            <div className="w-full flex gap-2 items-end">
              {isEditingSpesifik && (
                <button type="button" onClick={() => {setFormData({ id: null, nama: "", harga: "" }); setIsEditingSpesifik(false);}} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all">
                  Batal
                </button>
              )}
              <button type="submit" className={`w-full ${isEditingSpesifik ? 'bg-amber-500 hover:bg-amber-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400'} text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5`}>
                {isEditingSpesifik ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Pakaian (Satuan)</th>
                <th className="px-4 py-3 font-bold">Harga / Pcs</th>
                <th className="px-4 py-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {spesifikList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-slate-500 bg-slate-50/50 rounded-xl">Belum ada data pakaian satuan.</td>
                </tr>
              ) : (
                spesifikList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-4 py-5 text-slate-800 font-bold text-base">{item.nama}</td>
                    <td className="px-4 py-5 text-indigo-600 font-extrabold text-base">Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-5 flex justify-end gap-2 transition-opacity">
                      <button onClick={() => {setFormData(item); setIsEditingSpesifik(true); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors">Edit</button>
                      <button onClick={() => hapusSpesifik(item.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors">Hapus</button>
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

export default KelolaPakaian;




// import { useState } from "react";
// import Swal from "sweetalert2"; // <-- Import SweetAlert2

// const KelolaPakaian = () => {
//   const [kiloan, setKiloan] = useState({ batasBerat: 3, hargaBawah: 7000, hargaAtas: 6000 });
//   const [isEditingKiloan, setIsEditingKiloan] = useState(false);
//   const [tempKiloan, setTempKiloan] = useState({ ...kiloan });
//   const [spesifikList, setSpesifikList] = useState([
//     { id: 1, nama: "Jas", harga: 15000 },
//     { id: 2, nama: "Sprei Besar", harga: 12000 },
//   ]);
//   const [formData, setFormData] = useState({ id: null, nama: "", harga: "" });
//   const [isEditingSpesifik, setIsEditingSpesifik] = useState(false);

//   // Fungsi simpan dengan SweetAlert
//   const handleSimpanKiloan = () => { 
//     setKiloan(tempKiloan); 
//     setIsEditingKiloan(false);
//     Swal.fire({ title: "Berhasil!", text: "Tarif kiloan berhasil diperbarui.", icon: "success", timer: 1500, showConfirmButton: false });
//   };

//   const handleSimpanSpesifik = (e) => {
//     e.preventDefault();
//     if (isEditingSpesifik) { 
//       setSpesifikList(spesifikList.map(item => item.id === formData.id ? { ...formData, harga: Number(formData.harga) } : item)); 
//     } else { 
//       setSpesifikList([...spesifikList, { id: Date.now(), nama: formData.nama, harga: Number(formData.harga) }]); 
//     }
//     setFormData({ id: null, nama: "", harga: "" }); 
//     setIsEditingSpesifik(false);
//     Swal.fire({ title: "Tersimpan!", text: "Data pakaian berhasil disimpan.", icon: "success", timer: 1500, showConfirmButton: false });
//   };

//   // Fungsi hapus dengan konfirmasi SweetAlert
//   const hapusSpesifik = (id) => { 
//     Swal.fire({
//       title: "Hapus Pakaian?",
//       text: "Data ini tidak akan muncul lagi di halaman kasir!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#e11d48",
//       cancelButtonColor: "#64748b",
//       confirmButtonText: "Ya, Hapus!",
//       cancelButtonText: "Batal"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setSpesifikList(spesifikList.filter(item => item.id !== id));
//         Swal.fire({ title: "Terhapus!", text: "Pakaian berhasil dihapus.", icon: "success", confirmButtonColor: "#4f46e5" });
//       }
//     });
//   };

//   return (
//     <div className="space-y-8 pb-10">
//       <div>
//         <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Harga & Pakaian</h1>
//         <p className="text-slate-500 mt-1.5 font-medium">Atur tarif dasar kiloan dan tarif satuan dengan mudah.</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Tarif Kiloan */}
//         <div className="lg:col-span-1">
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 sticky top-28">
//             <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
//               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">⚖️ Tarif Kiloan</h2>
//               {!isEditingKiloan && <button onClick={() => setIsEditingKiloan(true)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors">Edit</button>}
//             </div>

//             {!isEditingKiloan ? (
//               <div className="space-y-5">
//                 <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
//                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Berat &lt; {kiloan.batasBerat} Kg</p>
//                   <p className="text-3xl font-extrabold text-indigo-900 mt-2">Rp {kiloan.hargaBawah.toLocaleString('id-ID')} <span className="text-sm font-medium text-indigo-400">/Kg</span></p>
//                 </div>
//                 <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 shadow-sm">
//                   <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Berat ≥ {kiloan.batasBerat} Kg</p>
//                   <p className="text-3xl font-extrabold text-emerald-900 mt-2">Rp {kiloan.hargaAtas.toLocaleString('id-ID')} <span className="text-sm font-medium text-emerald-500">/Kg</span></p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Batas Berat (Kg)</label>
//                   <input type="number" value={tempKiloan.batasBerat} onChange={(e) => setTempKiloan({...tempKiloan, batasBerat: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga &lt; Batas (Rp)</label>
//                   <input type="number" value={tempKiloan.hargaBawah} onChange={(e) => setTempKiloan({...tempKiloan, hargaBawah: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga ≥ Batas (Rp)</label>
//                   <input type="number" value={tempKiloan.hargaAtas} onChange={(e) => setTempKiloan({...tempKiloan, hargaAtas: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button onClick={() => { setTempKiloan({...kiloan}); setIsEditingKiloan(false); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Batal</button>
//                   <button onClick={handleSimpanKiloan} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">Simpan</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Pakaian Spesifik */}
//         <div className="lg:col-span-2">
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60">
//             <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">👔 Pakaian Satuan (Pcs)</h2>
            
//             <form onSubmit={handleSimpanSpesifik} className="bg-slate-50/80 p-5 md:p-6 rounded-2xl border border-slate-200/60 mb-8 flex flex-col md:flex-row gap-5 items-end shadow-inner">
//               <div className="flex-1 w-full">
//                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pakaian</label>
//                 <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="Jas, Karpet..." />
//               </div>
//               <div className="flex-1 w-full">
//                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga (Rp)</label>
//                 <input type="number" required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="15000" />
//               </div>
//               <div className="w-full md:w-auto flex gap-3">
//                 {isEditingSpesifik && <button type="button" onClick={() => {setFormData({ id: null, nama: "", harga: "" }); setIsEditingSpesifik(false);}} className="bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl">Batal</button>}
//                 <button type="submit" className={`${isEditingSpesifik ? 'bg-amber-500 hover:bg-amber-400' : 'bg-slate-800 hover:bg-slate-700'} text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5`}>
//                   {isEditingSpesifik ? 'Update' : '+ Tambah'}
//                 </button>
//               </div>
//             </form>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
//                     <th className="px-4 py-3 font-bold">Nama Pakaian</th>
//                     <th className="px-4 py-3 font-bold">Harga / Pcs</th>
//                     <th className="px-4 py-3 font-bold text-right">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-sm font-medium">
//                   {spesifikList.map((item) => (
//                     <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
//                       <td className="px-4 py-4 text-slate-800 font-bold">{item.nama}</td>
//                       <td className="px-4 py-4 text-slate-600">Rp {item.harga.toLocaleString('id-ID')}</td>
//                       <td className="px-4 py-4 flex justify-end gap-2 transition-opacity">
//                         <button onClick={() => {setFormData(item); setIsEditingSpesifik(true);}} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold text-xs">Edit</button>
//                         <button onClick={() => hapusSpesifik(item.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-bold text-xs">Hapus</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KelolaPakaian;