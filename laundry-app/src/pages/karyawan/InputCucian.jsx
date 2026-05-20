import { useState } from "react";

const InputCucian = () => {
  // --- DUMMY DATA ---
  const dataPelanggan = [
    { id: 1, nama: "Budi Santoso", hp: "08123456789" },
    { id: 2, nama: "Siti Aminah", hp: "08987654321" },
  ];
  const dataLayanan = [
    { id: 1, nama: "Cuci Komplit (Reguler)", harga: 6000, satuan: "Kg" },
    { id: 2, nama: "Cuci Komplit (Kilat)", harga: 10000, satuan: "Kg" },
    { id: 3, nama: "Setrika Saja", harga: 4000, satuan: "Kg" },
    { id: 4, nama: "Cuci Karpet / Selimut", harga: 15000, satuan: "Pcs" },
  ];
  const jenisPakaianList = ["Kaos", "Kemeja", "Celana Panjang", "Handuk", "Sprei", "Jas", "Jaket"];

  // --- STATE FORM ---
  const [pelanggan, setPelanggan] = useState("");
  const [layanan, setLayanan] = useState("");
  const [berat, setBerat] = useState(1);
  
  // State untuk Rincian Pakaian
  const [rincian, setRincian] = useState([]);
  const [tempPakaian, setTempPakaian] = useState(jenisPakaianList[0]);
  const [tempJumlah, setTempJumlah] = useState(1);

  // --- LOGIKA ---
  const layananTerpilih = dataLayanan.find(l => l.id === Number(layanan));
  const totalHarga = layananTerpilih ? layananTerpilih.harga * berat : 0;

  const tambahRincian = () => {
    if (tempJumlah > 0) {
      setRincian([...rincian, { jenis: tempPakaian, jumlah: tempJumlah }]);
      setTempJumlah(1); // Reset jumlah
    }
  };

  const hapusRincian = (index) => {
    const newRincian = rincian.filter((_, i) => i !== index);
    setRincian(newRincian);
  };

  const handleSimpanTransaksi = () => {
    alert("Transaksi Berhasil Disimpan! Nota siap dicetak.");
    // Logika simpan ke database nantinya di sini
    setRincian([]);
    setLayanan("");
    setPelanggan("");
    setBerat(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Input Cucian Baru</h1>
        <p className="text-gray-500 mt-1">Halaman kasir untuk mencatat pesanan masuk.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* BAGIAN KIRI: FORM INPUT (Lebar 60% di Desktop) */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* 1. Form Pelanggan & Layanan */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Data Pesanan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pelanggan</label>
                <select 
                  value={pelanggan} 
                  onChange={(e) => setPelanggan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {dataPelanggan.map(p => (
                    <option key={p.id} value={p.id}>{p.nama} ({p.hp})</option>
                  ))}
                </select>
                <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">+ Tambah Pelanggan Baru</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Layanan</label>
                <select 
                  value={layanan} 
                  onChange={(e) => setLayanan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {dataLayanan.map(l => (
                    <option key={l.id} value={l.id}>{l.nama} - Rp {l.harga}/{l.satuan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah / Berat ({layananTerpilih ? layananTerpilih.satuan : "Kg"})
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={berat}
                  onChange={(e) => setBerat(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Form Rincian Pakaian */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Rincian Pakaian (Opsional)</h2>
            
            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pakaian</label>
                <select 
                  value={tempPakaian} 
                  onChange={(e) => setTempPakaian(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {jenisPakaianList.map(jp => (
                    <option key={jp} value={jp}>{jp}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <input 
                  type="number" 
                  min="1"
                  value={tempJumlah}
                  onChange={(e) => setTempJumlah(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={tambahRincian}
                className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                + Tambah
              </button>
            </div>

            {/* List Rincian yang ditambahkan */}
            {rincian.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200 flex flex-wrap gap-2">
                {rincian.map((item, index) => (
                  <span key={index} className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm">
                    {item.jumlah}x {item.jenis}
                    <button onClick={() => hapusRincian(index)} className="text-red-500 hover:text-red-700 font-bold ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* BAGIAN KANAN: PREVIEW NOTA (Lebar 33% di Desktop) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 sticky top-6">
            <h2 className="text-center font-bold text-xl text-gray-800 mb-4 pb-4 border-b border-dashed border-gray-300">
              Struk Pesanan
            </h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-semibold text-gray-800">
                  {pelanggan ? dataPelanggan.find(p => p.id === Number(pelanggan))?.nama : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Layanan:</span>
                <span className="font-semibold text-gray-800">{layananTerpilih ? layananTerpilih.nama : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Berat/Jumlah:</span>
                <span className="font-semibold text-gray-800">{berat} {layananTerpilih?.satuan || ""}</span>
              </div>
              
              {rincian.length > 0 && (
                <div className="pt-2">
                  <span className="block mb-1">Rincian Isi:</span>
                  <ul className="list-disc pl-5 text-gray-500">
                    {rincian.map((item, index) => (
                      <li key={index}>{item.jumlah} pcs {item.jenis}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Bayar</span>
                <span className="font-bold text-2xl text-blue-600">
                  Rp {totalHarga.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button 
              onClick={handleSimpanTransaksi}
              disabled={!pelanggan || !layanan}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${
                !pelanggan || !layanan ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Simpan & Cetak Nota
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InputCucian;