import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const role = localStorage.getItem("role");

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded mb-2 transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 lg:p-6 flex justify-between items-center border-b border-gray-700">
        <span className="font-bold text-xl lg:text-2xl">Happy Laundry</span>
        {/* Tombol Close (X) hanya muncul di HP */}
        <button 
          className="lg:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>
      
      <nav className="p-4 overflow-y-auto h-full" onClick={() => setIsOpen(false)}>
        {role === "owner" && (
          <>
            <NavLink to="/owner/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/owner/kelola-pakaian" className={navClass}>Kelola Pakaian</NavLink>
            <NavLink to="/owner/kelola-layanan" className={navClass}>Kelola Layanan</NavLink>
            <NavLink to="/owner/laporan" className={navClass}>Laporan</NavLink>
          </>
        )}

        {role === "karyawan" && (
          <>
            <NavLink to="/karyawan/input-cucian" className={navClass}>Input Cucian</NavLink>
            <NavLink to="/karyawan/kelola-nota" className={navClass}>Kelola Nota</NavLink>
            <NavLink to="/karyawan/kelola-pelanggan" className={navClass}>Data Pelanggan</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;