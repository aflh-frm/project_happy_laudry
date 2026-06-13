import { useState } from "react";

const KelolaPakaian = () => {
  const [kiloan, setKiloan] = useState({ batasBerat: 3, hargaBawah: 7000, hargaAtas: 6000 });
  const [isEditingKiloan, setIsEditingKiloan] = useState(false);
  const [tempKiloan, setTempKiloan] = useState({ ...kiloan });
  const [spesifikList, setSpesifikList] = useState([
    { id: 1, nama: "Jas", harga: 15000 },
    { id: 2, nama: "Sprei Besar", harga: 12000 },
  ]);
  const [formData, setFormData] = useState({ id: null, nama: "", harga: "" });
  const [isEditingSpesifik, setIsEditingSpesifik] = useState(false);

  const handleSimpanKiloan = () => { setKiloan(tempKiloan); setIsEditingKiloan(false); };
  const handleSimpanSpesifik = (e) => {
    e.preventDefault();
    if (isEditingSpesifik) { setSpesifikList(spesifikList.map(item => item.id === formData.id ? { ...formData, harga: Number(formData.harga) } : item)); } 
    else { setSpesifikList([...spesifikList, { id: Date.now(), nama: formData.nama, harga: Number(formData.harga) }]); }
    setFormData({ id: null, nama: "", harga: "" }); setIsEditingSpesifik(false);
  };
  const hapusSpesifik = (id) => { if (window.confirm("Hapus pakaian ini?")) setSpesifikList(spesifikList.filter(item => item.id !== id)); };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Harga & Pakaian</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Atur tarif dasar kiloan dan tarif satuan dengan mudah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarif Kiloan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 sticky top-28">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">⚖️ Tarif Kiloan</h2>
              {!isEditingKiloan && <button onClick={() => setIsEditingKiloan(true)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-colors">Edit</button>}
            </div>

            {!isEditingKiloan ? (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Berat &lt; {kiloan.batasBerat} Kg</p>
                  <p className="text-3xl font-extrabold text-indigo-900 mt-2">Rp {kiloan.hargaBawah.toLocaleString('id-ID')} <span className="text-sm font-medium text-indigo-400">/Kg</span></p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Berat ≥ {kiloan.batasBerat} Kg</p>
                  <p className="text-3xl font-extrabold text-emerald-900 mt-2">Rp {kiloan.hargaAtas.toLocaleString('id-ID')} <span className="text-sm font-medium text-emerald-500">/Kg</span></p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Batas Berat (Kg)</label>
                  <input type="number" value={tempKiloan.batasBerat} onChange={(e) => setTempKiloan({...tempKiloan, batasBerat: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga &lt; Batas (Rp)</label>
                  <input type="number" value={tempKiloan.hargaBawah} onChange={(e) => setTempKiloan({...tempKiloan, hargaBawah: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga ≥ Batas (Rp)</label>
                  <input type="number" value={tempKiloan.hargaAtas} onChange={(e) => setTempKiloan({...tempKiloan, hargaAtas: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setTempKiloan({...kiloan}); setIsEditingKiloan(false); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Batal</button>
                  <button onClick={handleSimpanKiloan} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">Simpan</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pakaian Spesifik */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">👔 Pakaian Satuan (Pcs)</h2>
            
            <form onSubmit={handleSimpanSpesifik} className="bg-slate-50/80 p-5 md:p-6 rounded-2xl border border-slate-200/60 mb-8 flex flex-col md:flex-row gap-5 items-end shadow-inner">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pakaian</label>
                <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="Jas, Karpet..." />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga (Rp)</label>
                <input type="number" required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="15000" />
              </div>
              <div className="w-full md:w-auto flex gap-3">
                {isEditingSpesifik && <button type="button" onClick={() => {setFormData({ id: null, nama: "", harga: "" }); setIsEditingSpesifik(false);}} className="bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl">Batal</button>}
                <button type="submit" className={`${isEditingSpesifik ? 'bg-amber-500 hover:bg-amber-400' : 'bg-slate-800 hover:bg-slate-700'} text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5`}>
                  {isEditingSpesifik ? 'Update' : '+ Tambah'}
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3 font-bold">Nama Pakaian</th>
                    <th className="px-4 py-3 font-bold">Harga / Pcs</th>
                    <th className="px-4 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {spesifikList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                      <td className="px-4 py-4 text-slate-800 font-bold">{item.nama}</td>
                      <td className="px-4 py-4 text-slate-600">Rp {item.harga.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-4 flex justify-end gap-2 transition-opacity">
                        <button onClick={() => {setFormData(item); setIsEditingSpesifik(true);}} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold text-xs">Edit</button>
                        <button onClick={() => hapusSpesifik(item.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-bold text-xs">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaPakaian;