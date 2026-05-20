import { useState } from "react";

const KelolaLayanan = () => {
  // Data Layanan Default (Sesuai dengan dummy di halaman kasir)
  const [layananList, setLayananList] = useState([
    { id: 1, nama: "Cuci Komplit (Reguler)", harga: 6000, satuan: "Kg", estimasi: "3 Hari" },
    { id: 2, nama: "Cuci Komplit (Kilat)", harga: 10000, satuan: "Kg", estimasi: "1 Hari" },
    { id: 3, nama: "Setrika Saja", harga: 4000, satuan: "Kg", estimasi: "2 Hari" },
    { id: 4, nama: "Cuci Karpet / Selimut", harga: 15000, satuan: "Pcs", estimasi: "4 Hari" },
  ]);

  // State untuk Form CRUD
  const [formData, setFormData] = useState({ id: null, nama: "", harga: "", satuan: "Kg", estimasi: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSimpan = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update data
      setLayananList(layananList.map(item => 
        item.id === formData.id ? { ...formData, harga: Number(formData.harga) } : item
      ));
    } else {
      // Tambah data baru
      const newItem = {
        id: Date.now(),
        nama: formData.nama,
        harga: Number(formData.harga),
        satuan: formData.satuan,
        estimasi: formData.estimasi
      };
      setLayananList([...layananList, newItem]);
    }
    // Reset Form
    setFormData({ id: null, nama: "", harga: "", satuan: "Kg", estimasi: "" });
    setIsEditing(false);
  };

  const handleEditClick = (item) => {
    setFormData({ id: item.id, nama: item.nama, harga: item.harga, satuan: item.satuan, estimasi: item.estimasi });
    setIsEditing(true);
  };

  const hapusLayanan = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setLayananList(layananList.filter(item => item.id !== id));
    }
  };

  const batalkanEdit = () => {
    setFormData({ id: null, nama: "", harga: "", satuan: "Kg", estimasi: "" });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Kelola Layanan Laundry</h1>
        <p className="text-gray-500 mt-1">Atur jenis paket, tarif dasar, dan estimasi waktu pengerjaan.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
          Form Layanan
        </h2>
        
        {/* Form Tambah/Edit */}
        <form onSubmit={handleSimpan} className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket Layanan</label>
              <input 
                type="text" 
                required
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Misal: Cuci Komplit Kilat"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input 
                type="number" 
                required
                value={formData.harga}
                onChange={(e) => setFormData({...formData, harga: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Misal: 8000"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                <select 
                  value={formData.satuan}
                  onChange={(e) => setFormData({...formData, satuan: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Kg">Kg</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Meter">Meter</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi</label>
                <input 
                  type="text" 
                  required
                  value={formData.estimasi}
                  onChange={(e) => setFormData({...formData, estimasi: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Mis: 1 Hari"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
              {isEditing && (
                <button 
                  type="button"
                  onClick={batalkanEdit}
                  className="flex-1 lg:flex-none bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Batal
                </button>
              )}
              <button 
                type="submit"
                className={`flex-1 lg:flex-none ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded-lg shadow transition-colors`}
              >
                {isEditing ? 'Update' : '+ Tambah'}
              </button>
            </div>
          </div>
        </form>

        {/* Tabel Layanan */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-6 py-3 font-semibold border-b">Nama Layanan</th>
                <th className="px-6 py-3 font-semibold border-b">Tarif</th>
                <th className="px-6 py-3 font-semibold border-b">Satuan</th>
                <th className="px-6 py-3 font-semibold border-b">Estimasi Selesai</th>
                <th className="px-6 py-3 font-semibold border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {layananList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data layanan laundry.
                  </td>
                </tr>
              ) : (
                layananList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{item.nama}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs font-semibold">{item.satuan}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-1">
                      ⏱️ {item.estimasi}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button 
                          onClick={() => hapusLayanan(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Hapus
                        </button>
                      </div>
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

export default KelolaLayanan;