const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      <p className="text-xs text-slate-400 tracking-wide">Loading...</p>
    </div>
  );
};

export default Loader;
