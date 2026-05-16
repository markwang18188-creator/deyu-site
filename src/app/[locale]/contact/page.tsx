import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return {
    title: `${t('title')} | DEYU`,
    description: t('subtitle'),
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <>
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a] mb-4">{t('direct_contact')}</h2>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/8613615778781"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#334155] hover:text-[#1e3a8a] transition-colors"
                  >
                    <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{t('whatsapp_label')}</div>
                      <div className="text-sm text-[#64748b]">{t('whatsapp_number')}</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-[#334155]">
                    <span className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{t('email_label')}</div>
                      <div className="text-sm text-[#64748b]">info@wzdeyu.cn</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#334155]">
                    <span className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{t('address_label')}</div>
                      <div className="text-sm text-[#64748b]">{t('address_value')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
                <h3 className="font-semibold text-[#0f172a] mb-2 text-sm">{t('response_title')}</h3>
                <p className="text-sm text-[#64748b]">{t('response_body')}</p>
              </div>
            </div>

            {/* Enquiry form */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-8">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">{t('form_title')}</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1.5">
                      {t('name_label')} <span className="text-red-500">*</span>
                    </label>
                    <input type="text" placeholder={t('name_placeholder')}
                      className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1.5">
                      {t('company_label')}
                    </label>
                    <input type="text" placeholder={t('company_placeholder')}
                      className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1.5">
                      {t('email_field_label')} <span className="text-red-500">*</span>
                    </label>
                    <input type="email" placeholder={t('email_placeholder')}
                      className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1.5">
                      {t('phone_label')}
                    </label>
                    <input type="tel" placeholder={t('phone_placeholder')}
                      className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t('country_label')}</label>
                  <input type="text" placeholder={t('country_placeholder')}
                    className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t('product_label')}</label>
                  <select className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent bg-white">
                    <option value="">{t('product_default')}</option>
                    <option value="single-color">{t('cat_single')}</option>
                    <option value="dual-color">{t('cat_dual')}</option>
                    <option value="multi-color">{t('cat_multi')}</option>
                    <option value="air-blowing">{t('cat_air')}</option>
                    <option value="industrial">{t('cat_industrial')}</option>
                    <option value="equipment">{t('cat_equipment')}</option>
                    <option value="other">{t('cat_other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">
                    {t('message_label')} <span className="text-red-500">*</span>
                  </label>
                  <textarea rows={5} placeholder={t('message_placeholder')}
                    className="w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-md transition-colors">
                  {t('submit')}
                </button>
                <p className="text-xs text-[#94a3b8] text-center">{t('privacy')}</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
