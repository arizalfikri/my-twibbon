import React from "react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Placeholder */}
      <Navbar />

      {/* Main Content */}
      <main className="container max-w-4xl px-4 py-12 mx-auto">
        <div className="p-8 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-12">
          {/* Header */}
          <div className="pb-6 mb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
              Kebijakan Privasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Terakhir diperbarui: 14 November 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              Selamat datang di <strong>MyTwibbon</strong>. Privasi Anda
              adalah prioritas kami. Dokumen ini menjelaskan bagaimana kami
              mengumpulkan, menggunakan, menyimpan, dan melindungi data Anda
              saat menggunakan layanan kami.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              1. Informasi yang Kami Kumpulkan
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                  1.1. Informasi yang Anda Berikan Secara Langsung
                </h3>
                <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
                  <li>Foto atau gambar yang Anda unggah</li>
                  <li>Informasi profil dasar (nama, email)</li>
                  <li>Konten teks yang Anda masukkan ke editor</li>
                  <li>Preferensi bahasa atau pengaturan tampilan</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                  1.2. Informasi yang Dikumpulkan Secara Otomatis
                </h3>
                <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
                  <li>Alamat IP</li>
                  <li>Jenis perangkat dan browser</li>
                  <li>Log aktivitas</li>
                  <li>Cookie untuk autentikasi dan preferensi</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                  1.3. Informasi dari Pihak Ketiga
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Jika Anda menggunakan login via Google/Facebook, kami hanya
                  mengakses nama dan email. Kami <strong>tidak</strong>{" "}
                  mengakses data sensitif lainnya.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              2. Bagaimana Kami Menggunakan Informasi Anda
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Informasi digunakan untuk:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Memproses gambar, template, dan output desain</li>
              <li>Menyimpan hasil desain Anda</li>
              <li>Meningkatkan pengalaman pengguna</li>
              <li>Keamanan dan pencegahan penyalahgunaan</li>
              <li>Analitik untuk pengembangan fitur</li>
              <li>Personalisasi konten aplikasi</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              Kami <strong>tidak menjual</strong> data Anda kepada pihak ketiga.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              3. Pengelolaan Gambar & File Unggahan
            </h2>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>
                Gambar yang Anda unggah digunakan <strong>hanya</strong> untuk
                membuat desain
              </li>
              <li>
                File dapat diproses melalui server kami untuk keperluan editor
              </li>
              <li>
                Kami <strong>tidak akan menggunakan</strong> foto Anda untuk
                tujuan lain tanpa izin
              </li>
              <li>Anda dapat menghapus file kapan saja</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              4. Cookie & Teknologi Pelacakan
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Kami menggunakan cookie untuk:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Menyimpan preferensi pengguna</li>
              <li>Menjaga Anda tetap login</li>
              <li>Analitik trafik</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              Anda dapat menonaktifkan cookie melalui pengaturan browser.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              5. Berbagi Informasi kepada Pihak Ketiga
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Kami dapat membagikan data <strong>hanya jika diperlukan</strong>,
              misalnya:
            </p>
            <div className="space-y-3">
              <div>
                <p className="mb-2 font-medium text-gray-900 dark:text-white">
                  Partner layanan:
                </p>
                <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
                  <li>Server hosting</li>
                  <li>CDN</li>
                  <li>Sistem analitik (Google Analytics)</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium text-gray-900 dark:text-white">
                  Yang tidak kami lakukan:
                </p>
                <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
                  <li>Tidak menjual data ke pihak iklan</li>
                  <li>
                    Tidak membagikan foto pribadi untuk kebutuhan marketing
                    tanpa izin
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              6. Keamanan Data
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Kami menerapkan berbagai langkah keamanan:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Enkripsi data saat transmisi (HTTPS)</li>
              <li>Pembatasan akses pada server</li>
              <li>Pemrosesan gambar hanya secara sistem internal</li>
              <li>Penyimpanan minimal & berdasarkan kebutuhan</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              Tidak ada sistem yang 100% aman, tetapi kami berkomitmen menjaga
              keamanan setinggi mungkin.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              7. Hak-Hak Anda
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Anda berhak untuk:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Akses informasi pribadi Anda</li>
              <li>Meminta penghapusan data</li>
              <li>Meminta koreksi data</li>
              <li>Menolak pemrosesan tertentu</li>
              <li>Mengunduh data Anda (data portability)</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              Hubungi kami jika ingin menggunakan hak ini.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              8. Retensi (Lama Penyimpanan)
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Kami hanya menyimpan data selama diperlukan. Misalnya:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Gambar sementara: otomatis terhapus setelah beberapa jam</li>
              <li>Gambar tersimpan di akun: hanya selama akun aktif</li>
              <li>Log sistem: 30–90 hari</li>
            </ul>
          </section>

 

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              9. Perubahan Kebijakan Privasi
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan
              signifikan akan diberitahukan melalui:
            </p>
            <ul className="ml-2 space-y-1 text-gray-700 list-disc list-inside dark:text-gray-300">
              <li>Email (jika tersedia)</li>
              <li>Notifikasi aplikasi</li>
              <li>Halaman pembaruan kebijakan</li>
            </ul>
          </section>

          {/* Section 11 - Contact */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              10. Hubungi Kami
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Jika Anda memiliki pertanyaan tentang privasi, silakan hubungi:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Email:</strong> [email@example.com]
              </p>
              <p>
                <strong>Website:</strong> [yourdomain.com]
              </p>
              <p>
                <strong>WhatsApp:</strong> [+62xxx]
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Placeholder */}
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
