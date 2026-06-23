import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tembak API Login Laravel
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email,
        password: password
      });

      const userData = response.data.user;

      // Simpan data login ke LocalStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userName", userData.name);

      Swal.fire({
        title: `Selamat Datang, ${userData.name}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Arahkan sesuai jabatan (role)
      if (userData.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/karyawan/input-cucian");
      }
      
    } catch (error) {
      console.error("Login gagal:", error);
      Swal.fire("Akses Ditolak!", "Email atau Password yang Anda masukkan salah.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md animate-fade-in relative z-10">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 w-full transform transition-all hover:scale-[1.01]">
        
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-all">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Happy Laundry</h2>
          <p className="text-indigo-200 mt-2 text-sm font-medium">Masuk untuk mengelola sistem kasir</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-indigo-200 text-xs font-bold mb-2 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10 transition-all font-medium" 
              placeholder="nama@laundry.com" 
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/10 transition-all font-medium" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform shadow-lg ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 hover:-translate-y-1 shadow-indigo-500/25'}`}
          >
            {loading ? 'Memeriksa Akun...' : 'Masuk ke Dashboard 🚀'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-indigo-300/80 font-medium bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="mb-1 text-indigo-200">Gunakan akun berikut untuk testing:</p>
          <div className="flex justify-between px-2">
            <span><b>owner@laundry.com</b></span>
            <span>Pass: password123</span>
          </div>
          <div className="flex justify-between px-2 mt-1">
            <span><b>karyawan@laundry.com</b></span>
            <span>Pass: password123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;