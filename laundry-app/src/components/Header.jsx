import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow py-3 px-4 lg:py-4 lg:px-6 flex justify-between items-center z-10 relative">
      <div className="flex items-center gap-3">
        {/* Tombol Burger khusus untuk HP */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded lg:hidden focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg lg:text-xl font-bold text-gray-800">
          <span className="hidden sm:inline">Laundry App - </span>
          <span className="capitalize text-blue-600">{role}</span>
        </h2>
      </div>
      
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded shadow text-sm lg:text-base transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;