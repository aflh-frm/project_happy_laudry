import { useState } from "react";
import Swal from "sweetalert2"; // <-- Import SweetAlert2

const KelolaLayanan = () => {
  const [layananList, setLayananList] = useState([
    { id: 1, nama: "Cuci Komplit (Reguler)", harga: 6000, satuan: "Kg", estimasi: 3 },
    { id: 2, nama: "Cuci Komplit (Kilat)", harga: 10000, satuan: "Kg", estimasi: 1 },
  ]);
  
  const [formData, setFormData] = useState({ id: null, nama: "", harga: "", satuan: "Kg", estimasi: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi simpan dengan SweetAlert
  const handleSimpan = (e) => {
    e.preventDefault();
    if (isEditing) {
      setLayananList(layananList.map(item => item.id === formData.id ? { ...formData, harga: Number(formData.harga), estimasi: Number(formData.estimasi) } : item));
    } else {
      setLayananList([...layananList, { ...formData, id: Date.now(), harga: Number(formData.harga), estimasi: Number(formData.estimasi) }]);
    }
    setFormData({ id: null, nama: "", harga: "", satuan: "Kg", estimasi: "" }); 
    setIsEditing(false);
    Swal.fire({ title: "Tersimpan!", text: "Layanan berhasil disimpan.", icon: "success", timer: 1500, showConfirmButton: false });
  };
  
  const handleEditClick = (item) => { setFormData(item); setIsEditing(true); };
  
  // Fungsi hapus dengan konfirmasi SweetAlert
  const hapusLayanan = (id) => { 
    Swal.fire({
      title: "Hapus Layanan?",
      text: "Layanan ini tidak akan tersedia lagi untuk kasir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        setLayananList(layananList.filter(item => item.id !== id));
        Swal.fire({ title: "Terhapus!", text: "Layanan berhasil dihapus.", icon: "success", confirmButtonColor: "#4f46e5" });
      }
    });
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Layanan Laundry</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Buat dan atur paket layanan untuk disajikan di kasir.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60">
        
        <form onSubmit={handleSimpan} className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <h2 className="text-white font-bold mb-6 flex items-center gap-2 relative z-10">✨ Set Up Paket Layanan Baru</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Paket</label>
              <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="Cuci Setrika Kilat" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Harga (Rp)</label>
              <input type="number" min="0" required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="8000" />
            </div>
            <div className="flex gap-4 lg:col-span-2">
              <div className="w-1/3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Satuan</label>
                <select value={formData.satuan} onChange={(e) => setFormData({...formData, satuan: e.target.value})} className="w-full bg-slate-800 border border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer">
                  <option value="Kg">Kg</option>
                  <option value="Pcs">Pcs</option>
                </select>
              </div>
              
              <div className="w-1/3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimasi</label>
                <div className="relative">
                  <input type="number" min="1" required value={formData.estimasi} onChange={(e) => setFormData({...formData, estimasi: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl pl-4 pr-12 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="2" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">Hari</span>
                </div>
              </div>

              <div className="w-1/3 flex items-end">
                 <button type="submit" className={`w-full ${isEditing ? 'bg-amber-500 hover:bg-amber-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400'} text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5`}>
                  {isEditing ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Layanan</th>
                <th className="px-4 py-3 font-bold">Tarif</th>
                <th className="px-4 py-3 font-bold">Satuan</th>
                <th className="px-4 py-3 font-bold">Waktu</th>
                <th className="px-4 py-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {layananList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                  <td className="px-4 py-5 text-slate-800 font-bold text-base">{item.nama}</td>
                  <td className="px-4 py-5 text-slate-600 font-bold">Rp {item.harga.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-5"><span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">{item.satuan}</span></td>
                  <td className="px-4 py-5 text-indigo-600 font-bold">⏱️ {item.estimasi} Hari</td>
                  <td className="px-4 py-5 flex justify-end gap-2">
                    <button onClick={() => handleEditClick(item)} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors">Edit</button>
                    <button onClick={() => hapusLayanan(item.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors">Hapus</button>
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

export default KelolaLayanan;