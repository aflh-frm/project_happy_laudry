import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "../../data/users.json"; // Mengambil data dummy

const Login = () => {
  const navigate = useNavigate();
  
  // State untuk form input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah halaman me-refresh saat form disubmit

    // Logika Pencarian Akun
    const foundUser = usersData.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      // Jika akun ditemukan, simpan data ke localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", foundUser.role);
      localStorage.setItem("nama", foundUser.nama);

      // Arahkan ke halaman sesuai role
      if (foundUser.role === "owner") {
        navigate("/owner/dashboard");
      } else if (foundUser.role === "karyawan") {
        navigate("/karyawan/input-cucian");
      }
    } else {
      // Jika salah, tampilkan pesan error
      setErrorMsg("Username atau password salah!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Login Happy Laundry</h1>
        <p className="text-gray-500 mt-1">Silakan masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 text-center">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors mt-2"
        >
          Masuk
        </button>
      </form>

      {/* Catatan untuk mempermudah saat demo/development */}
      <div className="mt-6 border-t pt-4 text-xs text-gray-400 text-center">
        <p>Gunakan akun berikut untuk mencoba:</p>
        <p className="mt-1">Owner: <b>owner</b> | pass: <b>password123</b></p>
        <p>Karyawan: <b>karyawan</b> | pass: <b>password123</b></p>
      </div>
    </div>
  );
};

export default Login;