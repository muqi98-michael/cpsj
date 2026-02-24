export default function Footer() {
  const links = ['帮助中心', '使用指南', '联系我们', '隐私政策'];

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 py-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          © 2024 产品实践库 版权所有
        </p>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link}
              className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
