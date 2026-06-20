import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const KelolaPelanggan = () => {
  const [pelanggan, setPelanggan] = useState([
    { id: 1, nama: "Budi Santoso", hp: "08123456789" },
    { id: 2, nama: "Siti Aminah", hp: "08987654321" },
    { id: 3, nama: "Andi Saputra", hp: "08212223334" },
    { id: 4, nama: "Rina Melati", hp: "08534445556" },
  ]);
  
  const [keyword, setKeyword] = useState("");
  const [filteredPelanggan, setFilteredPelanggan] = useState(pelanggan);

  // STATE UNTUK FORM TAMBAH/EDIT PELANGGAN
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama: "", hp: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const hasilFilter = pelanggan.filter((orang) => 
      orang.nama.toLowerCase().includes(keyword.toLowerCase()) || orang.hp.includes(keyword)
    );
    setFilteredPelanggan(hasilFilter);
  }, [keyword, pelanggan]); 

  const handleSimpan = (e) => {
    e.preventDefault();
    if (isEditing) {
      setPelanggan(pelanggan.map(p => p.id === formData.id ? { ...formData } : p));
    } else {
      setPelanggan([{ id: Date.now(), ...formData }, ...pelanggan]);
    }
    setFormData({ id: null, nama: "", hp: "" });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hapusPelanggan = (id) => {
    Swal.fire({
      title: "Hapus Pelanggan?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // Warna Rose-600
      cancelButtonColor: "#64748b", // Warna Slate-500
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        setPelanggan(pelanggan.filter(p => p.id !== id));
        Swal.fire({
          title: "Terhapus!",
          text: "Data pelanggan berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#4f46e5"
        });
      }
    });
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Data Pelanggan</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Kelola basis data pelanggan dengan pencarian instan.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setIsEditing(false); setFormData({ id: null, nama: "", hp: "" }); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
        >
          {showForm ? "Batal Tambah" : "+ Tambah Pelanggan"}
        </button>
      </div>

      {/* FORM INPUT PELANGGAN (Muncul saat tombol ditekan) */}
      {showForm && (
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden animate-fade-in border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <h2 className="text-white font-bold mb-6 flex items-center gap-2 relative z-10">
            {isEditing ? "✏️ Edit Data Pelanggan" : "✨ Tambah Pelanggan Baru"}
          </h2>
          <form onSubmit={handleSimpan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="John Doe" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nomor HP / WhatsApp</label>
              <input type="number" required value={formData.hp} onChange={(e) => setFormData({...formData, hp: e.target.value})} className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white/20 focus:border-indigo-400 transition-all" placeholder="0812..." />
            </div>
            <div className="w-full flex items-end">
              <button type="submit" className={`w-full ${isEditing ? 'bg-amber-500 hover:bg-amber-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400'} text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5`}>
                {isEditing ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="mb-8 relative">
          <input 
            type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari berdasarkan nama atau nomor HP..."
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 shadow-inner"
          />
          <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Nama Pelanggan</th>
                <th className="px-6 py-4 font-bold">Nomor HP</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredPelanggan.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl">
                    <span className="block text-4xl mb-3">🔍</span>
                    Pelanggan dengan kata kunci "<span className="font-bold text-indigo-600">{keyword}</span>" tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredPelanggan.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-6 py-5 font-bold text-slate-800 text-base">{p.nama}</td>
                    <td className="px-6 py-5 text-slate-500 font-mono text-base">{p.hp}</td>
                    <td className="px-6 py-5 flex justify-end gap-2">
                      <button onClick={() => handleEditClick(p)} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold transition-all shadow-sm">Edit</button>
                      <button onClick={() => hapusPelanggan(p.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold transition-all shadow-sm">Hapus</button>
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

export default KelolaPelanggan;