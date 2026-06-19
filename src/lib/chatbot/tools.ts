import type OpenAI from 'openai';
import { recommendModels, formatRecommendationForCustomer } from '@/data/chatbot/selection_matrix';
import type { SelectionCriteria } from '@/data/chatbot/selection_matrix';
import { products } from '@/data/products';
import { submitChatbotLead, type ChatbotLeadData } from '@/app/actions/submit-chatbot-lead';

export const chatbotTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'recommend_models',
      description:
        'Recommend DEYU machine models based on customer requirements. Call this once you know the materials, color count, mold configuration, and product category. Returns recommended model slugs, tonnage, and notes.',
      parameters: {
        type: 'object',
        properties: {
          materials: {
            type: 'array',
            items: { type: 'string', enum: ['PVC', 'TPR', 'TPU', 'TR'] },
            description: 'Materials the customer wants to mold. DEYU machines support PVC, TPR, TPU, and TR only — never recommend for EVA, rubber, or other materials.',
          },
          colors: {
            type: 'integer',
            enum: [1, 2, 3, 4],
            description: 'Number of distinct colors per sole layer.',
          },
          moldConfig: {
            type: 'string',
            enum: ['1-piece-per-mold', '1-pair-per-mold', 'flat-sheet'],
            description: 'Mold configuration the customer prefers.',
          },
          productCategory: {
            type: 'string',
            enum: ['sole-only', 'outsole', 'one-piece-slipper', 'complete-shoe', 'slipper-sandal', 'industrial-part'],
            description: 'What is the customer producing.',
          },
          hint: {
            type: 'string',
            description: 'Free-text hint from the conversation (e.g. "football cleats", "children sandals").',
          },
          budgetTier: {
            type: 'string',
            enum: ['tight', 'standard', 'premium'],
            description: 'Customer budget preference inferred from conversation.',
          },
        },
        required: ['materials', 'colors'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_details',
      description:
        'Fetch full specifications, features, and applications for a specific DEYU model by its slug. Use when the customer asks for details on a recommended model.',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Product slug, e.g. "dual-color-rotary-sole-machine".' },
        },
        required: ['slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'capture_lead',
      description:
        'Save the qualified lead to the database and notify the DEYU sales team. Only call this at step 9 of the playbook, after collecting customer name, email, WhatsApp/phone, country, materials, colors, product category, recommended model(s), and a clear technical summary. The conversation should end with the customer being told the DEYU sales team will follow up within 24 hours.',
      parameters: {
        type: 'object',
        properties: {
          customer_name: { type: 'string' },
          customer_email: { type: 'string' },
          customer_phone: { type: 'string' },
          country: { type: 'string' },
          company: { type: 'string' },
          materials: { type: 'array', items: { type: 'string' } },
          colors: { type: 'integer' },
          mold_config: { type: 'string' },
          product_category: { type: 'string' },
          tonnage_recommendation: { type: 'string' },
          recommended_models: { type: 'array', items: { type: 'string' } },
          upgrades_discussed: { type: 'array', items: { type: 'string' } },
          cooling_preference: {
            type: 'string',
            description:
              'Cooling option discussed or recommended: air cooling/oil radiator, water cooling tower, or industrial water chiller. Chiller is the highest-end option for best hydraulic oil temperature stability.',
          },
          port: { type: 'string' },
          payment_preference: { type: 'string' },
          full_summary: {
            type: 'string',
            description: 'Comprehensive plain-English summary of the requirement for the DEYU sales team to read.',
          },
        },
        required: [
          'customer_name',
          'customer_email',
          'customer_phone',
          'country',
          'materials',
          'colors',
          'product_category',
          'recommended_models',
          'full_summary',
        ],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_whatsapp',
      description:
        'Generate a WhatsApp deeplink with a pre-filled message. Use when the customer wants to talk to a human, or when their question is outside your scope (unsupported materials, persistent pricing demands).',
      parameters: {
        type: 'object',
        properties: {
          prefilled_message: {
            type: 'string',
            description: 'Message to pre-fill in WhatsApp (the customer can edit before sending).',
          },
        },
        required: ['prefilled_message'],
      },
    },
  },
];

export interface ToolContext {
  sessionId: string;
  visitorCountry?: string;
  language?: string;
  referrerPage?: string;
}

export async function executeTool(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext
): Promise<string> {
  switch (name) {
    case 'recommend_models': {
      const criteria = input as unknown as SelectionCriteria;
      const result = recommendModels(criteria);
      const human = formatRecommendationForCustomer(result, products);
      return JSON.stringify({ result, human_readable: human });
    }

    case 'get_product_details': {
      const slug = String(input.slug ?? '');
      const product = products.find((p) => p.slug === slug);
      if (!product) {
        return JSON.stringify({
          error: `No product found with slug "${slug}". Use recommend_models first to get valid slugs.`,
        });
      }
      return JSON.stringify({
        model: product.model,
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        features: product.features,
        specifications: product.specifications,
        applications: product.applications,
        url: `https://deyusolemachine.com/products/${product.slug}`,
      });
    }

    case 'capture_lead': {
      const data = input as unknown as ChatbotLeadData;
      const res = await submitChatbotLead({
        ...data,
        session_id: ctx.sessionId,
        language: ctx.language,
        country: data.country || ctx.visitorCountry || '',
        source_page: ctx.referrerPage,
      });
      if (!res.success) {
        return JSON.stringify({ success: false, error: res.error });
      }
      return JSON.stringify({
        success: true,
        lead_id: res.id,
        notification: res.notification,
        message: `Lead captured. Tell the customer: "Thank you! The DEYU sales team will follow up within 24 hours via email and WhatsApp."`,
      });
    }

    case 'handoff_to_whatsapp': {
      const number = process.env.DEYU_WHATSAPP_NUMBER || '8613615778781';
      const text = encodeURIComponent(
        String(input.prefilled_message ?? 'Hi, I have a question about DEYU machines.')
      );
      const url = `https://wa.me/${number}?text=${text}`;
      return JSON.stringify({
        whatsapp_url: url,
        message: `Provide this WhatsApp link to the customer so they can continue with a human: ${url}`,
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
