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

    const systemPrompt = `Você é um analisador de resultados laboratoriais especializado em longevidade e biomarcadores de saúde.
    
Sua tarefa é:
1. Extrair os valores dos biomarcadores do exame laboratorial (imagem/documento)
2. Calcular uma estimativa de idade biológica baseada nos biomarcadores
3. Avaliar os scores de risco metabólico e inflamação
4. Gerar recomendações de saúde personalizadas EM PORTUGUÊS BRASILEIRO

IMPORTANTE: Isto é apenas para fins educacionais. Sempre recomende consultar profissionais de saúde.

Extraia os seguintes biomarcadores se presentes (retorne null se não encontrado):
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
- TSH (mIU/L)
- PCR (mg/L)

Responda APENAS com JSON válido neste formato exato:
{
  "biomarkers": {
    "total_cholesterol": number ou null,
    "hdl": number ou null,
    "ldl": number ou null,
    "triglycerides": number ou null,
    "glucose": number ou null,
    "hemoglobin": number ou null,
    "creatinine": number ou null,
    "ast": number ou null,
    "alt": number ou null,
    "ggt": number ou null,
    "vitamin_d": number ou null,
    "tsh": number ou null,
    "crp": number ou null
  },
  "biological_age": number (estimado baseado nos biomarcadores),
  "metabolic_risk_score": "low" | "moderate" | "high",
  "inflammation_score": "low" | "moderate" | "high",
  "recommendations": [
    "recomendação 1 em português",
    "recomendação 2 em português",
    "recomendação 3 em português",
    "recomendação 4 em português",
    "recomendação 5 em português"
  ]
}

ATENÇÃO: Todas as recomendações DEVEM estar em português brasileiro, com linguagem amigável e sugestões específicas de estilo de vida.`;

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

    let analysisResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
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
