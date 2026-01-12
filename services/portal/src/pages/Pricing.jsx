import { Link } from 'react-router-dom'
import { Check, Zap, Building2, Rocket, HelpCircle } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Untuk pengembang individu dan proyek kecil',
      price: 'Gratis',
      period: 'selamanya',
      features: [
        '1.000 request/bulan',
        'Fraud scoring API',
        'Blacklist management',
        'Dokumentasi lengkap',
        'Community support',
      ],
      limitations: [
        'Rate limit: 10 req/menit',
        '1 API key',
      ],
      cta: 'Mulai Gratis',
      ctaLink: '/register',
      popular: false,
    },
    {
      name: 'Professional',
      icon: Building2,
      description: 'Untuk bisnis yang berkembang',
      price: 'Rp 499.000',
      period: '/bulan',
      features: [
        '50.000 request/bulan',
        'Semua fitur Starter',
        'Priority support',
        'Advanced analytics',
        'Webhook notifications',
        'Custom rules engine',
      ],
      limitations: [
        'Rate limit: 100 req/menit',
        '5 API keys',
      ],
      cta: 'Pilih Professional',
      ctaLink: '/register',
      popular: true,
    },
    {
      name: 'Enterprise',
      icon: Rocket,
      description: 'Untuk perusahaan besar',
      price: 'Hubungi Kami',
      period: '',
      features: [
        'Unlimited requests',
        'Semua fitur Professional',
        'Dedicated account manager',
        'SLA 99.99%',
        'On-premise deployment',
        'Custom integration',
        'Training & onboarding',
      ],
      limitations: [
        'Rate limit: Custom',
        'Unlimited API keys',
      ],
      cta: 'Hubungi Sales',
      ctaLink: '#',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Apa yang terjadi jika melebihi kuota bulanan?',
      answer: 'Request akan ditolak dengan status 429 (Too Many Requests). Anda bisa upgrade paket kapan saja untuk menambah kuota.'
    },
    {
      question: 'Apakah bisa upgrade atau downgrade paket?',
      answer: 'Ya, Anda bisa mengubah paket kapan saja. Perubahan akan berlaku di periode billing berikutnya.'
    },
    {
      question: 'Apakah ada biaya setup?',
      answer: 'Tidak ada biaya setup untuk paket Starter dan Professional. Enterprise mungkin memerlukan biaya implementasi tergantung kebutuhan.'
    },
    {
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima transfer bank, kartu kredit/debit, dan e-wallet (GoPay, OVO, DANA).'
    },
    {
      question: 'Apakah ada free trial untuk paket berbayar?',
      answer: 'Ya, Anda bisa mencoba paket Professional gratis selama 14 hari tanpa perlu kartu kredit.'
    },
    {
      question: 'Bagaimana cara menghitung jumlah request?',
      answer: 'Setiap panggilan ke endpoint /v1/score dihitung sebagai 1 request. Endpoint lain seperti blacklist tidak dihitung.'
    },
  ]

  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Harga Sederhana & Transparan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Mulai gratis, upgrade kapan saja.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all ${
                plan.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full">
                  Paling Populer
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular
                      ? 'bg-linear-to-br from-blue-500 to-purple-500'
                      : 'bg-slate-100'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                </div>

                <p className="text-slate-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="border-t border-slate-100 p-8">
                <p className="text-sm font-semibold text-slate-900 mb-4">Yang Anda dapatkan:</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-semibold text-slate-900 mb-4">Batasan:</p>
                <ul className="space-y-2">
                  {plan.limitations.map((limit) => (
                    <li key={limit} className="text-slate-500 text-sm">
                      • {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-24">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Perbandingan Fitur</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Fitur</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Request per bulan', '1.000', '50.000', 'Unlimited'],
                  ['Fraud Scoring API', true, true, true],
                  ['Blacklist Management', true, true, true],
                  ['API Keys', '1', '5', 'Unlimited'],
                  ['Rate Limit', '10/menit', '100/menit', 'Custom'],
                  ['Advanced Analytics', false, true, true],
                  ['Webhook Notifications', false, true, true],
                  ['Custom Rules', false, true, true],
                  ['Priority Support', false, true, true],
                  ['Dedicated Manager', false, false, true],
                  ['SLA', '99%', '99.9%', '99.99%'],
                  ['On-premise Option', false, false, true],
                ].map(([feature, starter, pro, enterprise], index) => (
                  <tr key={index}>
                    <td className="py-4 px-6 text-slate-700">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof starter === 'boolean' ? (
                        starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-slate-600">{starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-blue-50/50">
                      {typeof pro === 'boolean' ? (
                        pro ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-slate-600">{pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof enterprise === 'boolean' ? (
                        enterprise ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-slate-600">{enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pertanyaan Umum</h2>
            <p className="text-slate-600">Temukan jawaban untuk pertanyaan yang sering diajukan</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
