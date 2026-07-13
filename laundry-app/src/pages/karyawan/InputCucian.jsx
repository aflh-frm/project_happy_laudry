import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import axios from "axios";
import Swal from "sweetalert2";

const InputCucian = () => {
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [dataLayanan, setDataLayanan] = useState([]);
  const [dataPakaianSpesifik, setDataPakaianSpesifik] = useState([]);

  const [pelanggan, setPelanggan] = useState("");
  const [layanan, setLayanan] = useState("");
  const [berat, setBerat] = useState(1);
  
  const [rincian, setRincian] = useState([]);
  const [tempPakaian, setTempPakaian] = useState("");
  const [tempJumlah, setTempJumlah] = useState(1);

  // STATE BARU: Mengunci tombol saat mengirim data
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_PELANGGAN = "http://localhost:8000/api/pelanggan";
  const API_LAYANAN = "http://localhost:8000/api/layanan";
  const API_PAKAIAN = "http://localhost:8000/api/pakaian";
  const API_TRANSAKSI = "http://localhost:8000/api/transaksi";

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resPelanggan, resLayanan, resPakaian] = await Promise.all([
          axios.get(API_PELANGGAN),
          axios.get(API_LAYANAN),
          axios.get(API_PAKAIAN)
        ]);
        
        setDataPelanggan(resPelanggan.data);
        setDataLayanan(resLayanan.data);
        setDataPakaianSpesifik(resPakaian.data);
        
        if (resPakaian.data.length > 0) {
          setTempPakaian(resPakaian.data[0].nama);
        }
      } catch (error) {
        console.error("Gagal mengambil data master:", error);
      }
    };
    fetchMasterData();
  }, []);

  // LOGIKA HITUNG BIAYA 
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

  const tambahRincian = () => {
    if (!tempPakaian) return;
    if (tempJumlah > 0) {
      setRincian([...rincian, { jenis: tempPakaian, jumlah: tempJumlah }]);
      setTempJumlah(1);
    }
  };
  
  const hapusRincian = (index) => setRincian(rincian.filter((_, i) => i !== index));

  const handleSimpanTransaksi = async () => {
    // KUNCI TOMBOL SEKARANG
    setIsSubmitting(true);

    const payload = {
      pelanggan_id: Number(pelanggan),
      layanan_id: layanan ? Number(layanan) : null,
      berat: layanan ? berat : 0,
      rincian_pakaian: rincian, 
      total_harga: totalTagihan
    };

    try {
      const response = await axios.post(API_TRANSAKSI, payload);
      
      Swal.fire({
        title: "Transaksi Berhasil!",
        html: `Nota: <b>${response.data.data.id_nota}</b><br>Total Bayar: <b>Rp ${totalTagihan.toLocaleString('id-ID')}</b>`,
        icon: "success",
        confirmButtonText: "Selesai",
        confirmButtonColor: "#4f46e5",
      });

      setRincian([]); 
      setLayanan(""); 
      setPelanggan(""); 
      setBerat(1);
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      Swal.fire("Gagal!", "Pastikan semua data terisi dengan benar.", "error");
    } finally {
      // BUKA KUNCI TOMBOL KEMBALI
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !pelanggan || (!layanan && rincian.length === 0);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Input Cucian Baru</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Sistem kasir cerdas untuk mencatat pesanan pelanggan.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-2/3 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">📦 Data Pesanan Utama</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Pelanggan</label>
                <select value={pelanggan} onChange={(e) => setPelanggan(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 cursor-pointer">
                  <option value="">-- Pilih Pelanggan --</option>
                  {dataPelanggan.map(p => <option key={p.id} value={p.id}>{p.nama} ({p.hp})</option>)}
                </select>
                <Link to="/karyawan/kelola-pelanggan" className="text-xs text-indigo-600 mt-2 font-bold cursor-pointer hover:text-indigo-800 transition-colors inline-block">
                  + Tambah Pelanggan Baru
                </Link>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Layanan Dasar (Opsional)</label>
                <select value={layanan} onChange={(e) => setLayanan(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 cursor-pointer">
                  <option value="">-- Tanpa Layanan Dasar --</option>
                  {dataLayanan.map(l => <option key={l.id} value={l.id}>{l.nama} - Rp {l.harga}/{l.satuan}</option>)}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah / Berat ({layananTerpilih ? layananTerpilih.satuan : "Kg"})</label>
                <input type="number" min="1" value={berat} onChange={(e) => setBerat(Number(e.target.value))} disabled={!layanan} className={`w-full border rounded-xl px-4 py-3.5 outline-none transition-all font-bold text-lg ${!layanan ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">👕 Rincian Pakaian Terpisah (Opsional)</h2>
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Jenis Pakaian</label>
                <select value={tempPakaian} onChange={(e) => setTempPakaian(e.target.value)} className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium cursor-pointer">
                  {dataPakaianSpesifik.map(p => (
                    <option key={p.id} value={p.nama}>
                       {p.nama} {p.harga > 0 ? `(+Rp ${p.harga.toLocaleString('id-ID')})` : '(Termasuk Kiloan)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Jumlah</label>
                <input type="number" min="1" value={tempJumlah} onChange={(e) => setTempJumlah(Number(e.target.value))} className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold" />
              </div>
              <button onClick={tambahRincian} className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md">
                Tambah
              </button>
            </div>
            
            {rincian.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {rincian.map((item, index) => {
                  const hargaItem = getHargaPakaian(item.jenis);
                  return (
                    <span key={index} className={`border px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm ${hargaItem > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-700'}`}>
                      <span className={`px-2 py-0.5 rounded-md ${hargaItem > 0 ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{item.jumlah}x</span> 
                      {item.jenis}
                      <button onClick={() => hapusRincian(index)} className="text-slate-400 hover:text-rose-500 transition-colors ml-1">✕</button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-full xl:w-1/3">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl shadow-indigo-900/20 sticky top-28 border border-slate-700/50">
            <h2 className="text-center font-extrabold text-xl text-white mb-6 pb-6 border-b border-dashed border-slate-700">STRUK PESANAN</h2>
            
            <div className="space-y-4 text-sm text-slate-300 mb-8 font-medium">
              <div className="flex justify-between items-center"><span className="text-slate-400">Pelanggan</span><span className="font-bold text-white text-base">{pelanggan ? dataPelanggan.find(p => p.id === Number(pelanggan))?.nama : "-"}</span></div>
              
              <div className="flex justify-between items-start pt-2">
                <span className="text-slate-400 w-1/2">Layanan Dasar<br/>
                  <span className="text-xs text-slate-500">
                    {layananTerpilih ? `(${berat} ${layananTerpilih.satuan})` : ""}
                  </span>
                </span>
                <div className="text-right w-1/2">
                  <span className="font-bold text-white block">{layananTerpilih ? layananTerpilih.nama : "Tanpa Layanan Dasar"}</span>
                  <span className="text-xs text-slate-400">Rp {biayaDasar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {rincian.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <span className="block mb-3 text-slate-400">Rincian Tambahan:</span>
                  <ul className="space-y-2.5">
                    {rincian.map((item, index) => {
                      const hrg = getHargaPakaian(item.jenis);
                      return (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-slate-300">
                            {item.jumlah}x {item.jenis}
                            {hrg > 0 && <span className="block text-xs text-amber-400/80">@ Rp {hrg.toLocaleString('id-ID')}</span>}
                          </span>
                          <span className="font-bold text-white">
                            {hrg > 0 ? `+ Rp ${(item.jumlah * hrg).toLocaleString('id-ID')}` : '-'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white/10 p-5 rounded-2xl mb-8 border border-white/5 backdrop-blur-sm">
              <span className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Total Bayar</span>
              <span className="font-extrabold text-3xl text-white">Rp {totalTagihan.toLocaleString('id-ID')}</span>
            </div>
            
            {/* TOMBOL YANG SUDAH DIAMANKAN */}
            <button 
              onClick={handleSimpanTransaksi} 
              disabled={isButtonDisabled || isSubmitting} 
              className={`w-full py-4 rounded-2xl font-extrabold text-white transition-all transform ${
                isButtonDisabled || isSubmitting 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span> 
                  Memproses...
                </span>
              ) : (
                "Simpan & Cetak Nota"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputCucian;