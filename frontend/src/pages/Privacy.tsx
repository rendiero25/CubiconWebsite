import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    title: '1. Informasi yang Kami Kumpulkan',
    body: [
      'Kami mengumpulkan informasi yang kamu berikan secara langsung saat mendaftar akun, yaitu: nama, alamat email, dan password (terenkripsi).',
      'Saat kamu menggunakan layanan Generate, kami menyimpan prompt teks dan hasil gambar yang dihasilkan.',
      'Kami mengumpulkan data penggunaan seperti jumlah icon yang di-generate, riwayat transaksi credit, dan preferensi pengaturan akun.',
      'Data teknis standar seperti alamat IP, tipe browser, dan waktu akses dicatat untuk keperluan keamanan dan debugging.',
    ],
  },
  {
    title: '2. Cara Kami Menggunakan Informasimu',
    body: [
      'Menjalankan layanan: memproses permintaan generate, menyimpan riwayat icon, dan mengelola saldo credit.',
      'Autentikasi: memverifikasi identitasmu saat login dan menjaga keamanan akun.',
      'Komunikasi: mengirim email selamat datang, notifikasi pembelian credit, dan info pembaruan layanan.',
      'Peningkatan layanan: menganalisis pola penggunaan secara agregat untuk meningkatkan kualitas AI dan UX.',
      'Kami TIDAK menjual data pribadimu kepada pihak ketiga.',
    ],
  },
  {
    title: '3. Penyimpanan Data',
    body: [
      'Data akun dan icon disimpan di Supabase (PostgreSQL) dengan enkripsi data at rest.',
      'File gambar disimpan di Cloudinary dengan akses terbatas.',
      'Kami menyimpan data selama akun aktif. Jika kamu menghapus akun, data akan dihapus dalam 30 hari.',
    ],
  },
  {
    title: '4. Keamanan',
    body: [
      'Password di-hash menggunakan bcrypt sebelum disimpan. Kami tidak pernah menyimpan password dalam bentuk plaintext.',
      'Semua komunikasi menggunakan HTTPS/TLS.',
      'API key dan secret disimpan di server-side — tidak pernah dikirimkan ke browser.',
      'Meskipun kami mengambil langkah-langkah keamanan yang wajar, tidak ada sistem yang 100% aman. Kami akan memberi tahu kamu jika terjadi pelanggaran data yang memengaruhi akunmu.',
    ],
  },
  {
    title: '5. Cookie & Penyimpanan Lokal',
    body: [
      'Kami menggunakan session token dari Supabase Auth yang disimpan di localStorage untuk menjaga status login.',
      'Kami tidak menggunakan cookie iklan atau pelacak pihak ketiga.',
    ],
  },
  {
    title: '6. Hak Penggunamu',
    body: [
      'Akses: Kamu dapat melihat semua data akunmu di halaman Dashboard.',
      'Koreksi: Hubungi kami untuk memperbarui data yang salah.',
      'Penghapusan: Kamu dapat menghapus akun dan semua datamu kapanpun melalui pengaturan akun.',
      'Portabilitas: Kamu dapat mengunduh semua icon yang kamu buat kapanpun.',
    ],
  },
  {
    title: '7. Perubahan Kebijakan',
    body: [
      'Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di dalam aplikasi.',
      'Dengan terus menggunakan layanan setelah perubahan berlaku, kamu menyetujui kebijakan yang diperbarui.',
    ],
  },
  {
    title: '8. Kontak',
    body: [
      'Jika kamu memiliki pertanyaan tentang kebijakan privasi ini, hubungi kami di hello@cubicon.id atau melalui halaman Contact.',
    ],
  },
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <section className="py-12 md:py-16 border-b-2 border-[#0A1628] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <span className="inline-block bg-light-green border-2 border-[#0A1628] px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-4">
            Legal
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black">
            Privacy Policy
          </h1>
          <p className="font-body text-sm text-near-black/60 mt-3">
            Terakhir diperbarui: April 2026
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="border-2 border-[#0A1628] rounded-md bg-light-green p-5 mb-8 shadow-[3px_3px_0_#0A1628]">
            <p className="font-body text-sm text-near-black leading-relaxed">
              <strong className="font-semibold">TL;DR:</strong> Kami mengumpulkan data yang diperlukan untuk menjalankan layanan. Kami tidak menjual datamu. Kamu bisa menghapus akunmu kapanpun.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h2 className="font-display font-semibold text-lg text-near-black border-b-2 border-[#0A1628] pb-2">
                  {section.title}
                </h2>
                <ul className="flex flex-col gap-2.5 pl-1">
                  {section.body.map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-electric-yellow rounded-full mt-2 shrink-0" />
                      <p className="font-body text-sm text-near-black/80 leading-relaxed">{line}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
