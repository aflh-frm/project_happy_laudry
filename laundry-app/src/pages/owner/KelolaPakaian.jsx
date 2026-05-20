import { useState } from "react";

const KelolaPakaian = () => {
  // ==========================================
  // STATE: PAKAIAN KILOAN (RANGE & HARGA)
  // ==========================================
  const [kiloan, setKiloan] = useState({
    batasBerat: 3,
    hargaBawah: 7000, // Harga jika di bawah batas
    hargaAtas: 6000,  // Harga jika di atas/sama dengan batas
  });
  const [isEditingKiloan, setIsEditingKiloan] = useState(false);
  const [tempKiloan, setTempKiloan] = useState({ ...kiloan });

  const handleSimpanKiloan = () => {
    setKiloan(tempKiloan);
    setIsEditingKiloan(false);
  };

  // ==========================================
  // STATE: CRUD PAKAIAN SPESIFIK (SATUAN)
  // ==========================================
  const [spesifikList, setSpesifikList] = useState([
    { id: 1, nama: "Jas", harga: 15000 },
    { id: 2, nama: "Sprei Besar", harga: 12000 },
    { id: 3, nama: "Handuk Mandi", harga: 5000 },
  ]);
  
  // State untuk Form CRUD
  const [formData, setFormData] = useState({ id: null, nama: "", harga: "" });
  const [isEditingSpesifik, setIsEditingSpesifik] = useState(false);

  const handleSimpanSpesifik = (e) => {
    e.preventDefault();
    if (isEditingSpesifik) {
      // Update data
      setSpesifikList(spesifikList.map(item => 
        item.id === formData.id ? { ...formData, harga: Number(formData.harga) } : item
      ));
    } else {
      // Tambah data baru
      const newItem = {
        id: Date.now(), // Generate ID sederhana
        nama: formData.nama,
        harga: Number(formData.harga)
      };
      setSpesifikList([...spesifikList, newItem]);
    }
    // Reset Form
    setFormData({ id: null, nama: "", harga: "" });
    setIsEditingSpesifik(false);
  };

  const handleEditClick = (item) => {
    setFormData({ id: item.id, nama: item.nama, harga: item.harga });
    setIsEditingSpesifik(true);
  };

  const hapusSpesifik = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pakaian ini?")) {
      setSpesifikList(spesifikList.filter(item => item.id !== id));
    }
  };

  const batalkanEditSpesifik = () => {
    setFormData({ id: null, nama: "", harga: "" });
    setIsEditingSpesifik(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Kelola Harga & Pakaian</h1>
        <p className="text-gray-500 mt-1">Atur tarif dasar kiloan dan harga khusus per satuan (pcs).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================== */}
        {/* BAGIAN 1: PENGATURAN KILOAN (Kiri)         */}
        {/* ========================================== */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Tarif Kiloan
              </h2>
              {!isEditingKiloan && (
                <button 
                  onClick={() => setIsEditingKiloan(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded"
                >
                  Edit Aturan
                </button>
              )}
            </div>

            {!isEditingKiloan ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600">Jika berat <span className="font-bold text-blue-700">di bawah {kiloan.batasBerat} Kg</span> :</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">Rp {kiloan.hargaBawah.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ Kg</span></p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-600">Jika berat <span className="font-bold text-green-700">{kiloan.batasBerat} Kg atau lebih</span> :</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">Rp {kiloan.hargaAtas.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ Kg</span></p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batas Berat (Kg)</label>
                  <input 
                    type="number" 
                    value={tempKiloan.batasBerat}
                    onChange={(e) => setTempKiloan({...tempKiloan, batasBerat: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga di Bawah Batas (Rp)</label>
                  <input 
                    type="number" 
                    value={tempKiloan.hargaBawah}
                    onChange={(e) => setTempKiloan({...tempKiloan, hargaBawah: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga di Atas Batas (Rp)</label>
                  <input 
                    type="number" 
                    value={tempKiloan.hargaAtas}
                    onChange={(e) => setTempKiloan({...tempKiloan, hargaAtas: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setTempKiloan({...kiloan}); // Reset
                      setIsEditingKiloan(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSimpanKiloan}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* BAGIAN 2: PAKAIAN SPESIFIK (Kanan)         */}
        {/* ========================================== */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              Pakaian Spesifik (Per Satuan/Pcs)
            </h2>
            
            {/* Form Tambah/Edit */}
            <form onSubmit={handleSimpanSpesifik} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pakaian (Mis: Jas, Selimut)</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="Masukkan nama..."
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Per Pcs (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={formData.harga}
                  onChange={(e) => setFormData({...formData, harga: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="Contoh: 15000"
                />
              </div>
              <div className="w-full md:w-auto flex gap-2">
                {isEditingSpesifik && (
                  <button 
                    type="button"
                    onClick={batalkanEditSpesifik}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                )}
                <button 
                  type="submit"
                  className={`${isEditingSpesifik ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-gray-900'} text-white font-medium py-2 px-6 rounded-lg shadow transition-colors`}
                >
                  {isEditingSpesifik ? 'Update' : '+ Tambah'}
                </button>
              </div>
            </form>

            {/* Tabel Pakaian Spesifik */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm">
                    <th className="px-6 py-3 font-semibold border-b">Nama Pakaian</th>
                    <th className="px-6 py-3 font-semibold border-b">Harga / Pcs</th>
                    <th className="px-6 py-3 font-semibold border-b text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {spesifikList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        Belum ada data pakaian spesifik.
                      </td>
                    </tr>
                  ) : (
                    spesifikList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800">{item.nama}</td>
                        <td className="px-6 py-3 text-gray-600">Rp {item.harga.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-3 flex justify-center gap-3">
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button 
                            onClick={() => hapusSpesifik(item.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Hapus
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
        
      </div>
    </div>
  );
};

export default KelolaPakaian;