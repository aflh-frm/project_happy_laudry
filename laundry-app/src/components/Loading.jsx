const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-20">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Memuat halaman...</p>
    </div>
  );
};

export default Loading;