import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Apa saja yang termasuk dalam versi gratis MyTwibbon?",
      answer:
        "Versi gratis MyTwibbon menyediakan fitur dasar untuk membuat, mendukung, dan membagikan kampanye. Namun terdapat beberapa batasan seperti hasil twibbon yang memiliki watermark, adanya iklan, serta tidak tersedianya fitur Campaign Analytics dan opsi kustomisasi lanjutan.",
    },
    {
      question:
        "Saya pengguna Premium, tetapi kampanye saya masih ada watermark. Mengapa bisa begitu?",
      answer:
        "Dengan langganan Premium Supporter, Anda dapat mendukung kampanye manapun dan menghasilkan foto twibbon tanpa watermark. Namun, jika Anda membuat kampanye, hasil twibbon orang lain yang mendukung kampanye Anda tetap menyertakan watermark. Pastikan Anda sudah login menggunakan akun dengan langganan Premium Supporter.",
    },
    {
      question: "Apa perbedaan antara Premium Supporter dan Premium Creator?",
      answer:
        "Premium Supporter cocok jika Anda hanya ingin membuat twibbon tanpa watermark untuk penggunaan pribadi. Namun jika Anda ingin kampanye Anda menghasilkan twibbon tanpa watermark bagi semua pendukungnya, maka Premium Creator adalah pilihan yang tepat.",
    },
    {
      question:
        "Saya sudah berlangganan MyTwibbon Premium sebelum perubahan pada 5 November 2024. Apa yang terjadi dengan langganan saya?",
      answer:
        "Jika Anda sebelumnya berlangganan MyTwibbon Premium, paket Anda akan diubah menjadi Premium Supporter. Jika Anda memiliki add-ons, paket Anda akan diubah menjadi Premium Creator. Untuk informasi lebih detail, silakan lihat artikel Konversi Langganan Premium.",
    },
    {
      question: "Apakah saya bisa meminta refund?",
      answer:
        "Secara umum, refund tidak tersedia. Namun jika Anda membutuhkan bantuan atau mengalami kendala, Anda dapat menghubungi kami melalui halaman Contact Us. Kami akan berusaha membantu Anda sebaik mungkin.",
    },
    {
      question:
        "Bisakah saya menghapus iklan di halaman kampanye untuk semua orang?",
      answer:
        "Sayangnya tidak. Iklan hanya dihilangkan untuk pengguna MyTwibbon Premium, mirip seperti YouTube Premium yang hanya menghapus iklan untuk pengguna premium.",
    },
    {
      question: "Informasi apa saja yang tersedia di Campaign Analytics?",
      answer:
        "Campaign Analytics menyediakan data tentang performa kampanye Anda, seperti total pendukung kampanye, total pengunjung kampanye, serta rincian asal pengunjung berdasarkan negara dan kota. Data ini akan hilang jika Anda tidak lagi berlangganan Premium Creator.",
    },
    {
      question:
        "Apakah saya bisa melihat siapa saja yang mendukung kampanye saya?",
      answer:
        "Anda dapat melihat total jumlah pendukung kampanye Anda di Campaign Analytics. Untuk melihat profil pendukung, Anda hanya dapat melihat mereka yang mengunggah foto twibbon ke galeri pendukung kampanye Anda.",
    },
    {
      question: "Apa saja yang bisa saya kustomisasi dalam kampanye?",
      answer:
        "Anda dapat mengubah background halaman kampanye menggunakan background eksklusif atau mengunggah gambar Anda sendiri.",
    },
    {
      question: "Apa itu kampanye privat?",
      answer:
        "Kampanye privat memungkinkan Anda membatasi akses kampanye sehingga hanya orang yang memiliki link atau password kampanye yang dapat melihatnya.",
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Anda dapat menggunakan kartu kredit atau debit. Pembayaran diproses melalui Stripe sebagai payment gateway kami.",
    },
    {
      question:
        "Di mana saya bisa menemukan bantuan terkait penggunaan MyTwibbon?",
      answer:
        "Anda bisa mengunjungi Help Center untuk membaca artikel panduan, atau menghubungi kami melalui halaman Contact Us.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50">
              <HelpCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Temukan jawaban untuk pertanyaan umum tentang layanan kami
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`group overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${
                openIndex === index
                  ? "ring-2 ring-primary-400 dark:ring-primary-500"
                  : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-start justify-between w-full gap-4 p-6 text-left transition-colors hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent dark:hover:from-primary-900/20"
              >
                <div className="flex items-start flex-1 min-w-0 gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      openIndex === index
                        ? "bg-primary-500 text-white"
                        : "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="flex-1 pr-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-primary-500 dark:text-primary-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 ml-12">
                  <div className="pt-2 pl-4 text-gray-600 border-l-4 border-primary-400 dark:border-primary-500 dark:text-gray-400">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
