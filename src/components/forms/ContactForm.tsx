'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePathname, useRouter } from '@/i18n/navigation';
import { submitLead, type LeadFormData } from '@/app/actions/submit-lead';

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  machine_interest: z.string().optional(),
  message: z.string().min(5),
});

type FormValues = z.infer<typeof schema>;

interface ContactFormProps {
  prefilledMachine?: string;
  prefilledMachineName?: string;
}

export default function ContactForm({ prefilledMachine, prefilledMachineName }: ContactFormProps) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      machine_interest: prefilledMachine ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: LeadFormData = {
      ...values,
      source: prefilledMachine ? 'product-page' : 'website-contact',
      source_page: pathname,
      language: locale,
    };

    const result = await submitLead(payload);

    if (!result.success) {
      setError('root', { message: t('submit_error') });
      return;
    }

    router.push('/thank-you');
  };

  const inputClass =
    'w-full border border-[#e2e8f0] rounded-md px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1.5">
            {t('name_label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('name_placeholder')}
            className={inputClass}
            {...register('name')}
          />
          {errors.name && <p className={errorClass}>{t('error_name')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1.5">
            {t('company_label')}
          </label>
          <input
            type="text"
            placeholder={t('company_placeholder')}
            className={inputClass}
            {...register('company')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1.5">
            {t('email_field_label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder={t('email_placeholder')}
            className={inputClass}
            {...register('email')}
          />
          {errors.email && <p className={errorClass}>{t('error_email')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1.5">
            {t('phone_label')}
          </label>
          <input
            type="tel"
            placeholder={t('phone_placeholder')}
            className={inputClass}
            {...register('phone')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#334155] mb-1.5">
          {t('country_label')}
        </label>
        <input
          type="text"
          placeholder={t('country_placeholder')}
          className={inputClass}
          {...register('country')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#334155] mb-1.5">
          {t('product_label')}
        </label>
        {prefilledMachine && prefilledMachineName ? (
          <>
            <div className="w-full border border-[#1e3a8a] bg-blue-50 rounded-md px-4 py-2.5 text-sm text-[#1e3a8a] font-medium">
              {prefilledMachineName}
            </div>
            <input type="hidden" {...register('machine_interest')} />
          </>
        ) : (
          <select className={`${inputClass} bg-white`} {...register('machine_interest')}>
            <option value="">{t('product_default')}</option>
            <option value="single-color">{t('cat_single')}</option>
            <option value="dual-color">{t('cat_dual')}</option>
            <option value="multi-color">{t('cat_multi')}</option>
            <option value="industrial">{t('cat_industrial')}</option>
            <option value="equipment">{t('cat_equipment')}</option>
            <option value="other">{t('cat_other')}</option>
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#334155] mb-1.5">
          {t('message_label')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder={t('message_placeholder')}
          className={`${inputClass} resize-none`}
          {...register('message')}
        />
        {errors.message && <p className={errorClass}>{t('error_message')}</p>}
      </div>

      {errors.root && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-md transition-colors"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>

      <p className="text-xs text-[#94a3b8] text-center">{t('privacy')}</p>
    </form>
  );
}
