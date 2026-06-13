import { Link } from "react-router-dom";

const KelolaNota = () => {
  const daftarNota = [
    { id: "TRX-001", nama: "Budi Santoso", status: "Proses", total: 45000 },
    { id: "TRX-002", nama: "Siti Aminah", status: "Proses", total: 20000 },
    { id: "TRX-003", nama: "Andi Saputra", status: "Selesai", total: 35000 },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Nota</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Pantau pesanan masuk dan perbarui status cucian.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">ID Nota</th>
                <th className="px-6 py-4 font-bold">Pelanggan</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {daftarNota.map((nota) => (
                <tr key={nota.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                  <td className="px-6 py-5 font-extrabold text-slate-900 text-base">{nota.id}</td>
                  <td className="px-6 py-5 text-slate-600 text-base">{nota.nama}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${nota.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                      {nota.status === "Proses" ? "⏳ Proses" : "✅ Selesai"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/karyawan/kelola-nota/${nota.id}`} className="bg-slate-800 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors inline-block shadow-md hover:shadow-indigo-500/30">
                      Buka Detail
                    </Link>
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

export default KelolaNota;