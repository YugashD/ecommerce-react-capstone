export const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white py-5">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-slate-400">
        <span className="font-medium text-slate-500">EasyBuy</span>
        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
