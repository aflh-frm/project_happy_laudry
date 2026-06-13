import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const nama = localStorage.getItem("nama") || "User";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 h-20 px-6 flex justify-between items-center border-b border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 hidden sm:block">Halo, {nama}! 👋</h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">Selamat datang kembali di sistem.</p>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md"
      >
        <span className="text-sm">Logout</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </button>
    </header>
  );
};

export default Header;