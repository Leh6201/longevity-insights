import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileType, userId, fileName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing lab results for user:', userId);
    console.log('File type:', fileType);

    const systemPrompt = `Você é um assistente de análise de exames laboratoriais médicos.

TAREFA PRINCIPAL: Extrair TODOS os biomarcadores presentes no documento.

REGRAS CRÍTICAS:
- Extraia APENAS dados que estão EXPLICITAMENTE presentes no documento
- NÃO invente ou assuma valores que não estão visíveis
- Se um biomarcador não está presente, retorne null
- Extraia o valor numérico exato conforme mostrado no documento

Para cada biomarcador encontrado, extraia:
- Nome do biomarcador
- Valor numérico
- Unidade de medida
- Faixa de referência (se disponível)

Biomarcadores a procurar (retorne null se não encontrado):
- Colesterol Total (mg/dL)
- HDL (mg/dL)
- LDL (mg/dL)
- Triglicerídeos (mg/dL)
- Glicose (mg/dL)
- Hemoglobina (g/dL)
- Creatinina (mg/dL)
- AST/TGO (U/L)
- ALT/TGP (U/L)
- GGT (U/L)
- Vitamina D (ng/mL)
- TSH (mIU/L ou μUI/mL)
- PCR/CRP (mg/L)

Após extrair os biomarcadores:
1. Estime a idade biológica baseada nos valores encontrados
2. Avalie o risco metabólico (low/moderate/high)
3. Avalie o score de inflamação (low/moderate/high)
4. Gere 5 recomendações em PORTUGUÊS BRASILEIRO

IMPORTANTE: Responda SOMENTE com JSON puro, SEM markdown, SEM \`\`\`json, SEM texto antes ou depois.

Formato de resposta (JSON puro):
{"biomarkers":{"total_cholesterol":number|null,"hdl":number|null,"ldl":number|null,"triglycerides":number|null,"glucose":number|null,"hemoglobin":number|null,"creatinine":number|null,"ast":number|null,"alt":number|null,"ggt":number|null,"vitamin_d":number|null,"tsh":number|null,"crp":number|null},"biological_age":number|null,"metabolic_risk_score":"low"|"moderate"|"high","inflammation_score":"low"|"moderate"|"high","recommendations":["recomendação 1","recomendação 2","recomendação 3","recomendação 4","recomendação 5"]}

ATENÇÃO: Recomendações devem ser em português brasileiro, amigáveis, com sugestões de estilo de vida. Isto é apenas educacional - sempre recomende consultar profissionais de saúde.`;

    const messages: Array<{ role: string; content: Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Por favor, analise este exame laboratorial e extraia todos os valores dos biomarcadores. Forneça uma estimativa de idade biológica e recomendações de saúde em português brasileiro."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${fileType};base64,${fileBase64}`
            }
          }
        ]
      }
    ];

    console.log('Calling AI Gateway for analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;
    
    console.log('AI Response:', content);

    let analysisResult: {
      biomarkers: Record<string, number | null>;
      biological_age: number | null;
      metabolic_risk_score: string | null;
      inflammation_score: string | null;
      recommendations: string[];
    };
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      
      // Find the JSON object
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed biomarkers:', Object.keys(analysisResult.biomarkers || {}).filter(k => analysisResult.biomarkers[k] !== null));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        biomarkers: {},
        biological_age: null,
        metabolic_risk_score: null,
        inflammation_score: null,
        recommendations: ["Não foi possível extrair os biomarcadores. Por favor, certifique-se de que a imagem do exame está clara e legível."]
      };
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('lab_results')
      .insert({
        user_id: userId,
        file_name: fileName,
        ...analysisResult.biomarkers,
        biological_age: analysisResult.biological_age,
        metabolic_risk_score: analysisResult.metabolic_risk_score,
        inflammation_score: analysisResult.inflammation_score,
        ai_recommendations: analysisResult.recommendations,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Lab results saved:', data.id);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in analyze-lab-results:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
