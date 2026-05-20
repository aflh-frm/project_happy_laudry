import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;