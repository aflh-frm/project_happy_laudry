import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const role = localStorage.getItem("role");

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 font-medium ${
      isActive 
      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex justify-between items-center h-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
          </div>
          <span className="font-extrabold text-xl text-white tracking-wide">Happy Laundry</span>
        </div>
        <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>✕</button>
      </div>
      
      <nav className="flex-1 px-4 py-6 overflow-y-auto" onClick={() => setIsOpen(false)}>
        <p className="px-4 text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">Menu Utama</p>
        
        {role === "owner" && (
          <>
            <NavLink to="/owner/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/owner/kelola-pakaian" className={navClass}>Kelola Pakaian</NavLink>
            <NavLink to="/owner/kelola-layanan" className={navClass}>Kelola Layanan</NavLink>
            <NavLink to="/owner/laporan" className={navClass}>Laporan Pendapatan</NavLink>
          </>
        )}

        {role === "karyawan" && (
          <>
            <NavLink to="/karyawan/input-cucian" className={navClass}>Input Cucian Kasir</NavLink>
            <NavLink to="/karyawan/kelola-nota" className={navClass}>Kelola Nota & Status</NavLink>
            <NavLink to="/karyawan/kelola-pelanggan" className={navClass}>Data Pelanggan</NavLink>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400">Login sebagai:</p>
          <p className="text-sm font-bold text-indigo-400 capitalize mt-0.5">{role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;