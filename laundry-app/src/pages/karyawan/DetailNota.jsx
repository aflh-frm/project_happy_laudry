import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DetailNota = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notaData, setNotaData] = useState(null);

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
      Swal.fire("Error", "Nota tidak ditemukan atau server mati.", "error")
        .then(() => navigate("/karyawan/kelola-nota"));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const layananTerpilih = dataLayanan.find(l => l.id === Number(layanan));
  const biayaDasar = layananTerpilih ? layananTerpilih.harga * berat : 0;

  const getHargaPakaian = (namaJenis) => {
    const pakaian = dataPakaianSpesifik.find(p => p.nama === namaJenis);
    return pakaian ? pakaian.harga : 0;
  };

  const biayaTambahan = rincian.reduce((total, item) => total + (getHargaPakaian(item.jenis) * item.jumlah), 0);
  const totalTagihan = biayaDasar + biayaTambahan;

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
        status: notaData.status 
      };

      await axios.put(API_TRANSAKSI, payload);
      Swal.fire({ title: "Berhasil Diperbarui!", text: `Rincian pesanan tersimpan.`, icon: "success", confirmButtonColor: "#4f46e5" });
      fetchAllData(); 
    } catch (error) {
      Swal.fire("Error!", "Gagal menyimpan perubahan ke database.", "error");
    }
  };

  const ubahStatus = async (statusBaru) => {
    try {
      await axios.put(API_TRANSAKSI, { status: statusBaru });
      Swal.fire({ title: "Status Diperbarui!", text: `Status cucian berubah menjadi: ${statusBaru === 'Selesai' ? 'Siap Diambil' : 'Sedang Diproses'}.`, icon: "success", timer: 1500, showConfirmButton: false });
      fetchAllData();
    } catch (error) {
      Swal.fire("Error!", "Gagal memperbarui status.", "error");
    }
  };

  // ==========================================
  // LOGIKA PENGHITUNG TENGGAT WAKTU (DEADLINE)
  // ==========================================
  const cekTenggatWaktu = () => {
    if (!notaData || !notaData.layanan || !notaData.layanan.estimasi || notaData.status === "Selesai") return null;

    const tanggalMasuk = new Date(notaData.created_at);
    const targetSelesai = new Date(tanggalMasuk);
    targetSelesai.setDate(targetSelesai.getDate() + notaData.layanan.estimasi);

    const hariIni = new Date();
    // Hilangkan hitungan jam, murni hitung beda tanggal
    const targetSet = new Date(targetSelesai.setHours(0,0,0,0));
    const hariIniSet = new Date(hariIni.setHours(0,0,0,0));

    const sisaWaktu = targetSet - hariIniSet;
    const sisaHari = Math.ceil(sisaWaktu / (1000 * 60 * 60 * 24));

    if (sisaHari < 0) {
      return { status: "telat", pesan: `🚨 TERLAMBAT ${Math.abs(sisaHari)} HARI! Segera selesaikan!`, warna: "bg-rose-100 text-rose-700 border-rose-300" };
    } else if (sisaHari === 0) {
      return { status: "hari_ini", pesan: "⚠️ TENGGAT HARI INI! Harus segera diselesaikan.", warna: "bg-orange-100 text-orange-700 border-orange-300" };
    } else if (sisaHari === 1) {
      return { status: "besok", pesan: "⏳ TINGGAL 1 HARI LAGI! (Selesai Besok)", warna: "bg-amber-100 text-amber-700 border-amber-300" };
    } else {
      const formatTgl = targetSelesai.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      return { status: "aman", pesan: `📅 Target Selesai: ${formatTgl} (Sisa ${sisaHari} Hari)`, warna: "bg-indigo-50 text-indigo-700 border-indigo-200" };
    }
  };

  const peringatan = cekTenggatWaktu();

  if (loading || !notaData) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;

  return (
    <div className="space-y-8 max-w-5xl pb-10 mx-auto">
      <div className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200/60 transition-all">
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
                <span className="font-medium text-indigo-200 text-base ml-2">({notaData.pelanggan?.hp || "-"})</span>
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
              <span className="text-sm font-bold tracking-wide">ID: {notaData.id_nota}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ========================================== */}
          {/* KIRI: EDIT PESANAN                         */}
          {/* ========================================== */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">📝 Perbaiki Isi Pesanan</h2>
            <form onSubmit={handleSimpanEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Layanan Dasar</label>
                  <select value={layanan} onChange={(e) => setLayanan(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 cursor-pointer">
                    <option value="">-- Tanpa Layanan Dasar --</option>
                    {dataLayanan.map(l => (
                      <option key={l.id} value={l.id}>{l.nama} (Rp {l.harga}/{l.satuan}) - {l.estimasi} Hari</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Berat / Jumlah</label>
                  <input type="number" min="1" value={berat} onChange={(e) => setBerat(Number(e.target.value))} disabled={!layanan} className={`w-full border rounded-xl px-4 py-3 outline-none font-bold text-lg ${!layanan ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-500/20'}`} />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <label className="block text-sm font-bold text-slate-700">Rincian Pakaian Terpisah</label>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jenis Pakaian</label>
                    <select value={tempPakaian} onChange={(e) => setTempPakaian(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-medium cursor-pointer">
                      {dataPakaianSpesifik.map(p => <option key={p.id} value={p.nama}>{p.nama} {p.harga > 0 ? `(+Rp ${p.harga.toLocaleString('id-ID')})` : ''}</option>)}
                    </select>
                  </div>
                  <div className="w-full sm:w-24">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Jumlah</label>
                    <input type="number" min="1" value={tempJumlah} onChange={(e) => setTempJumlah(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-center" />
                  </div>
                  <button type="button" onClick={tambahRincian} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm">+ Add</button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {rincian.length === 0 && <span className="text-sm text-slate-400 italic">Tidak ada rincian pakaian.</span>}
                  {rincian.map((item, index) => (
                    <span key={index} className="border bg-white border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                      <span className="text-indigo-600">{item.jumlah}x</span> {item.jenis}
                      <button type="button" onClick={() => hapusRincian(index)} className="text-slate-400 hover:text-rose-500 font-bold ml-1">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-inner relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700/50 pb-3">🧾 Ringkasan Biaya</h3>
                <div className="space-y-3 text-sm relative z-10">
                  <div className="flex justify-between items-center"><span className="text-slate-300">{layananTerpilih ? `${layananTerpilih.nama} (${berat} ${layananTerpilih.satuan})` : "Tanpa Layanan Dasar"}</span><span className="font-bold">Rp {biayaDasar.toLocaleString('id-ID')}</span></div>
                  {rincian.map((r, i) => (
                    <div key={i} className="flex justify-between items-center"><span className="text-slate-300 pl-4 relative"><span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-slate-600"></span>{r.jumlah}x {r.jenis}</span><span className="font-bold text-amber-400">+ Rp {(r.jumlah * getHargaPakaian(r.jenis)).toLocaleString('id-ID')}</span></div>
                  ))}
                </div>
                <div className="border-t border-slate-700/80 pt-4 mt-4 flex justify-between items-center relative z-10">
                  <span className="text-indigo-300 font-bold uppercase tracking-wider text-xs">Total Tagihan</span><span className="text-3xl font-extrabold text-white">Rp {totalTagihan.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <button type="submit" disabled={!layanan && rincian.length === 0} className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-md text-lg">Simpan Perubahan Pesanan</button>
            </form>
          </div>

          {/* ========================================== */}
          {/* KANAN: PELACAK STATUS & TENGGAT WAKTU      */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">🔄 Pelacak Status Cucian</h2>
            
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center py-8 sticky top-28">
              
              {/* KOTAK PERINGATAN DEADLINE MUNCUL DI SINI */}
              {peringatan && (
                <div className={`w-full mb-6 p-4 rounded-2xl border ${peringatan.warna} shadow-sm text-center font-bold animate-pulse-slow`}>
                  {peringatan.pesan}
                </div>
              )}

              <ul className="timeline timeline-vertical">
                <li>
                  <div className="timeline-start timeline-box border-none shadow-sm font-bold text-slate-700 bg-white">Pesanan Masuk</div>
                  <div className="timeline-middle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-indigo-600 h-6 w-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg></div>
                  <hr className="bg-indigo-600" />
                </li>
                <li>
                  <hr className={notaData.status === "Selesai" || notaData.status === "Proses" ? "bg-indigo-600" : "bg-slate-200"} />
                  <div className="timeline-middle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-6 w-6 ${notaData.status === "Selesai" || notaData.status === "Proses" ? "text-indigo-600" : "text-slate-300"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg></div>
                  <div className={`timeline-end timeline-box border-none shadow-sm font-bold ${notaData.status === "Selesai" || notaData.status === "Proses" ? "text-indigo-700 bg-white" : "text-slate-400 bg-slate-100"}`}>Sedang Diproses</div>
                  <hr className={notaData.status === "Selesai" ? "bg-indigo-600" : "bg-slate-200"} />
                </li>
                <li>
                  <hr className={notaData.status === "Selesai" ? "bg-indigo-600" : "bg-slate-200"} />
                  <div className={`timeline-start timeline-box border-none shadow-sm font-bold ${notaData.status === "Selesai" ? "text-emerald-700 bg-white" : "text-slate-400 bg-slate-100"}`}>Siap Diambil</div>
                  <div className="timeline-middle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-6 w-6 ${notaData.status === "Selesai" ? "text-emerald-500" : "text-slate-300"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg></div>
                </li>
              </ul>

              <div className="mt-8 w-full">
                {notaData.status === "Proses" ? (
                  <button onClick={() => ubahStatus("Selesai")} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 text-lg">
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