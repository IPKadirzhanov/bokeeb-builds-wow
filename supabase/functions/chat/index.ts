import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

const systemPrompt = `Ты — ИИ-консультант строительной компании BB BOKEEB. Компания специализируется на строительстве частных домов премиум-класса.

ТВОИ ЗАДАЧИ:
1. Отвечать на вопросы о строительстве домов
2. Помогать выбирать проекты домов
3. Давать предварительные оценки стоимости
4. Объяснять этапы строительства
5. Записывать на консультацию

КЛЮЧЕВАЯ ИНФОРМАЦИЯ О КОМПАНИИ:
- Более 12 лет опыта
- 200+ построенных домов
- Гарантия 5 лет
- Работаем в Казахстане (Алматы и область)
- Цены: от 180 000 тг/м² (эконом) до 400 000 тг/м² (премиум)
- Сроки строительства: 3-8 месяцев в зависимости от проекта

ПРАВИЛА ОБЩЕНИЯ:
- Будь дружелюбным и профессиональным
- Отвечай кратко, но информативно
- Если не знаешь точного ответа — предложи связаться с менеджером
- Всегда предлагай оставить заявку на расчёт стоимости
- Поддерживай языки: русский (основной), казахский, английский, китайский

ОГРАНИЧЕНИЯ:
- Не называй точные цены — только диапазоны
- Не давай юридических консультаций
- Не обсуждай конкурентов`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Слишком много запросов. Пожалуйста, подождите минуту." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, sessionId, language = "ru" } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message content
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.content || typeof lastMessage.content !== "string" || lastMessage.content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit message length for spam protection
    if (lastMessage.content.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Сообщение слишком длинное. Максимум 1000 символов." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add language instruction
    let languageInstruction = "";
    switch (language) {
      case "kz":
        languageInstruction = "\n\nОТВЕЧАЙ НА КАЗАХСКОМ ЯЗЫКЕ.";
        break;
      case "en":
        languageInstruction = "\n\nRESPOND IN ENGLISH.";
        break;
      case "cn":
        languageInstruction = "\n\n请用中文回答。";
        break;
      default:
        languageInstruction = "\n\nОтвечай на русском языке.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + languageInstruction },
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
        stream: true,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов к AI. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Сервис временно недоступен." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the chat (async, don't wait)
    if (sessionId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // We'll log after streaming completes - for now just pass through the stream
        // The actual logging will happen in a separate call from the frontend
      }
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
