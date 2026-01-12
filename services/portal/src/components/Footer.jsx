import { Link } from 'react-router-dom'
import { Shield, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    produk: [
      { name: 'Fitur', path: '/#features' },
      { name: 'Harga', path: '/pricing' },
      { name: 'Dokumentasi', path: '/docs' },
      { name: 'Status API', path: '#' },
    ],
    perusahaan: [
      { name: 'Tentang Kami', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Karir', path: '#' },
      { name: 'Kontak', path: '#' },
    ],
    dukungan: [
      { name: 'Pusat Bantuan', path: '#' },
      { name: 'FAQ', path: '#' },
      { name: 'Komunitas', path: '#' },
      { name: 'Status Layanan', path: '#' },
    ],
    legal: [
      { name: 'Kebijakan Privasi', path: '#' },
      { name: 'Syarat Layanan', path: '#' },
      { name: 'Keamanan', path: '#' },
      { name: 'Cookies', path: '#' },
    ],
  }

  return (
    <footer className="bg-[#0a0a1a] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">FraudShield</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 border border-[#667eea]/30 rounded-full text-[10px] font-medium text-[#667eea]">
                <Sparkles className="w-3 h-3" />
                PRO
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-4 max-w-xs">
              Platform deteksi penipuan berbasis AI untuk melindungi bisnis Anda dari transaksi mencurigakan.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#667eea] transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#667eea] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#667eea] transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#667eea] transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Produk */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">Produk</h3>
            <ul className="space-y-2">
              {footerLinks.produk.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#667eea] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">Perusahaan</h3>
            <ul className="space-y-2">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#667eea] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">Dukungan</h3>
            <ul className="space-y-2">
              {footerLinks.dukungan.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#667eea] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#667eea] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} FraudShield. Hak cipta dilindungi.
          </p>
          <p className="text-gray-600 text-xs">
            Dibuat dengan ❤️ untuk Tugas Akhir
          </p>
        </div>
      </div>
    </footer>
  )
}
