import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "../../data/users.json";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = usersData.find((user) => user.username === username && user.password === password);
    if (foundUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", foundUser.role);
      localStorage.setItem("nama", foundUser.nama);
      navigate(foundUser.role === "owner" ? "/owner/dashboard" : "/karyawan/input-cucian");
    } else {
      setErrorMsg("Username atau password tidak valid.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Kartu Login Glassmorphism */}
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/20">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Happy Laundry</h1>
          <p className="text-indigo-200 mt-2 text-sm font-medium">Sistem Manajemen Premium</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm text-center backdrop-blur-md">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-indigo-100 mb-2 pl-1">Username</label>
            <input
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-indigo-100 mb-2 pl-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 mt-4">
            Masuk ke Sistem
          </button>
        </form>
      </div>
      {/* Footer Text */}
      <p className="text-center text-indigo-300/50 mt-8 text-xs font-medium tracking-wider">
        &copy; 2026 HAPPY LAUNDRY. ALL RIGHTS RESERVED.
      </p>
    </div>
  );
};

export default Login;