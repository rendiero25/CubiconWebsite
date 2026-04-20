import Navbar, { type NavColors } from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SECTIONS = [
  {
    title: '1. Penerimaan Syarat',
    body: [
      'Dengan mendaftar dan menggunakan layanan Cubicon, kamu menyetujui Syarat dan Ketentuan ini.',
      'Jika kamu tidak setuju dengan syarat ini, jangan gunakan layanan kami.',
      'Kami berhak memperbarui syarat ini sewaktu-waktu. Perubahan akan diberitahukan melalui email atau notifikasi aplikasi.',
    ],
  },
  {
    title: '2. Deskripsi Layanan',
    body: [
      'Cubicon adalah platform berbasis AI yang memungkinkan pengguna membuat icon 3D isometric melalui deskripsi teks.',
      'Layanan menggunakan sistem credit — setiap permintaan generate membutuhkan sejumlah credit sesuai resolusi yang dipilih.',
      'Kami berhak mengubah fitur, harga, atau menghentikan layanan dengan pemberitahuan sebelumnya.',
    ],
  },
  {
    title: '3. Akun Pengguna',
    body: [
      'Kamu wajib berusia minimal 13 tahun untuk mendaftar akun.',
      'Kamu bertanggung jawab menjaga kerahasiaan kata sandi akunmu.',
      'Satu orang hanya boleh memiliki satu akun aktif.',
      'Kami berhak menangguhkan atau menghapus akun yang melanggar syarat ini.',
      'Kamu wajib memberikan informasi yang akurat saat mendaftar.',
    ],
  },
  {
    title: '4. Credit dan Pembayaran',
    body: [
      'Credit yang telah dibeli tidak dapat dikembalikan (refund), kecuali terjadi kesalahan teknis dari pihak kami yang dapat diverifikasi.',
      'Credit tidak memiliki masa kedaluwarsa — kamu dapat menggunakannya kapanpun.',
      'Harga credit dapat berubah sewaktu-waktu. Perubahan harga tidak mempengaruhi credit yang sudah dibeli.',
      'Pembayaran diproses oleh Mayar.id. Kami tidak menyimpan data kartu kredit atau informasi pembayaran.',
      'Jika ada masalah pembayaran, hubungi kami di hello@cubicon.id dalam 7 hari setelah transaksi.',
    ],
  },
  {
    title: '5. Hak Kekayaan Intelektual',
    body: [
      'Icon yang kamu generate menggunakan Cubicon adalah milikmu untuk digunakan secara bebas, termasuk untuk keperluan komersial.',
      'Kamu memberikan Cubicon izin non-eksklusif untuk menampilkan icon yang kamu tandai "Public" di galeri Explore komunitas.',
      'Branding, antarmuka, dan kode sumber Cubicon dilindungi oleh hak cipta dan tidak boleh disalin atau didistribusikan ulang.',
      'Dilarang menggunakan Cubicon untuk menghasilkan konten yang melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak lain.',
    ],
  },
  {
    title: '6. Pembatasan Penggunaan',
    body: [
      'Dilarang menggunakan Cubicon untuk menghasilkan konten yang melanggar hukum, berbahaya, penuh kebencian, atau pornografi.',
      'Dilarang melakukan scraping, spamming, atau mengeksploitasi API secara berlebihan (abuse).',
      'Dilarang mencoba membobol, meretas, atau mengganggu keamanan layanan.',
      'Dilarang menjual kembali akses ke layanan atau menyalahgunakan credit untuk keuntungan komersial tanpa izin.',
    ],
  },
  {
    title: '7. Batasan Tanggung Jawab',
    body: [
      'Layanan disediakan "sebagaimana adanya" (as is) tanpa jaminan apapun.',
      'Kami tidak menjamin bahwa layanan akan selalu tersedia atau bebas dari error.',
      'Kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan.',
      'Tanggung jawab maksimum kami terbatas pada jumlah yang kamu bayarkan dalam 30 hari terakhir.',
    ],
  },
  {
    title: '8. Penghentian Akun',
    body: [
      'Kamu dapat menghapus akunmu kapanpun melalui pengaturan Dashboard.',
      'Kami berhak menghentikan akunmu jika kamu melanggar syarat ini, dengan atau tanpa pemberitahuan.',
      'Setelah penghentian, credit yang tidak terpakai tidak dapat dikembalikan.',
    ],
  },
  {
    title: '9. Hukum yang Berlaku',
    body: [
      'Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.',
      'Sengketa diselesaikan melalui pengadilan yang berwenang di Indonesia.',
    ],
  },
  {
    title: '10. Kontak',
    body: [
      'Untuk pertanyaan tentang syarat ini, hubungi: hello@cubicon.id',
    ],
  },
]

// ─── TERMS PAGE — NAVBAR COLOR OVERRIDE ──────────────────────────────────────
const TERMS_NAV_COLORS: Partial<NavColors> = {
  bg:                'bg-near-black',
  logo:              'text-electric-yellow',
  logoHover:         'hover:text-light-green',
  link:              'text-off-white/70',
  linkHover:         'hover:text-electric-yellow',
  linkActive:        'text-electric-yellow',
  creditBadgeBg:     'bg-light-green',
  creditBadgeBorder: 'border-near-black',
  creditBadgeText:   'text-near-black',
  creditBadgeIcon:   'text-electric-yellow',
  dashboardBg:       'bg-electric-yellow',
  dashboardText:     'text-near-black',
  dashboardBorder:   'border-near-black',
  dashboardShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  loginText:         'text-electric-yellow',
  loginHover:        'hover:text-off-white',
  startFreeBg:       'bg-electric-yellow',
  startFreeText:     'text-near-black',
  startFreeBorder:   'border-near-black',
  startFreeShadow:   'shadow-[3px_3px_0px_var(--color-light-green)]',
  mobileBg:          'bg-off-white',
  mobileLinkColor:   'text-near-black',
  mobileToggle:      'border-electric-yellow text-electric-yellow',
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Terms() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar colors={TERMS_NAV_COLORS} />

      <section className="py-12 md:py-16 border-b-2 border-[#0A1628] bg-off-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <span className="inline-block bg-light-green border-2 border-[#0A1628] px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider mb-4">
            Legal
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-near-black">
            Terms of Service
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
              <strong className="font-semibold">TL;DR:</strong> Gunakan layanan dengan baik. Icon yang kamu buat milikmu. Credit tidak expired. Konten ilegal atau berbahaya dilarang.
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
