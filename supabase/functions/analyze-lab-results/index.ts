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

const systemPrompt = `Você é um assistente de análise de exames laboratoriais médicos especializado em extrair QUALQUER tipo de biomarcador de QUALQUER tipo de exame (sangue, urina, fezes, hormônios, vitaminas, etc.).

TAREFA PRINCIPAL: Extrair TODOS os biomarcadores presentes no documento, independentemente do tipo de exame.

REGRAS CRÍTICAS:
- Extraia APENAS dados que estão EXPLICITAMENTE presentes no documento
- NÃO invente ou assuma valores que não estão visíveis
- Extraia TODOS os biomarcadores encontrados, não apenas uma lista predefinida
- Identifique a categoria do exame (sangue, urina, fezes, hormônios, etc.)
- IMPORTANTE: Diferencie entre biomarcadores NUMÉRICOS e DESCRITIVOS

TIPOS DE BIOMARCADORES:

1. NUMÉRICOS: Valores com números e unidades (ex: Glicose = 95 mg/dL)
   - value: número exato
   - value_text: null
   - is_descriptive: false

2. DESCRITIVOS: Valores qualitativos/texto (ex: Cor = Amarelo Claro, Nitrito = Negativo)
   - value: null
   - value_text: texto exato do resultado (ex: "Amarelo Claro", "Negativo", "Ausente")
   - is_descriptive: true

Para CADA biomarcador encontrado, extraia:
- name: Nome do biomarcador em português
- value: Valor numérico (null se descritivo)
- value_text: Valor em texto (null se numérico)
- is_descriptive: true se for descritivo, false se numérico
- unit: Unidade de medida (null se descritivo)
- reference_min: Valor mínimo de referência (null se descritivo)
- reference_max: Valor máximo de referência (null se descritivo)
- is_normal: true se normal, false caso contrário
- category: Categoria do exame (sangue, urina, fezes, hormônio, vitamina, mineral, enzima, lipidio, etc.)

Após extrair os biomarcadores:
1. Estime a idade biológica baseada nos valores encontrados (se aplicável para exames de sangue)
2. Avalie o risco metabólico (low/moderate/high) baseado nos achados
3. Avalie o score de inflamação (low/moderate/high) baseado nos achados
4. Gere 5 recomendações personalizadas em PORTUGUÊS BRASILEIRO baseadas nos resultados específicos

IMPORTANTE: Responda SOMENTE com JSON puro, SEM markdown, SEM \`\`\`json, SEM texto antes ou depois.

Formato de resposta (JSON puro):
{
  "biomarkers": [
    {
      "name": "Glicose",
      "value": 95,
      "value_text": null,
      "is_descriptive": false,
      "unit": "mg/dL",
      "reference_min": 70,
      "reference_max": 100,
      "is_normal": true,
      "category": "sangue"
    },
    {
      "name": "Cor",
      "value": null,
      "value_text": "Amarelo Claro",
      "is_descriptive": true,
      "unit": null,
      "reference_min": null,
      "reference_max": null,
      "is_normal": true,
      "category": "urina"
    }
  ],
  "biological_age": number|null,
  "metabolic_risk_score": "low"|"moderate"|"high",
  "inflammation_score": "low"|"moderate"|"high",
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4", "recomendação 5"]
}

EXEMPLOS DE BIOMARCADORES NUMÉRICOS (sangue):
- Glicose, Hemoglobina Glicada, Insulina
- Colesterol Total, HDL, LDL, Triglicerídeos
- Hemoglobina, Hematócrito, Leucócitos, Plaquetas
- Creatinina, Ureia, Ácido Úrico
- AST, ALT, GGT, TSH, T3, T4

EXEMPLOS DE BIOMARCADORES DESCRITIVOS (urina):
- Cor: "Amarelo Claro", "Amarelo", "Âmbar"
- Aspecto: "Límpido", "Turvo", "Ligeiramente Turvo"
- Proteínas: "Negativo", "Traços", "+"
- Leucócitos: "Ausentes", "Raros", "Presentes"
- Nitrito: "Negativo", "Positivo"
- Hemácias: "Ausentes", "Raras", "Presentes"
- Bactérias: "Ausentes", "Raras", "Presentes"
- Células Epiteliais: "Raras", "Algumas", "Numerosas"

ATENÇÃO: Recomendações devem ser em português brasileiro, amigáveis, com sugestões de estilo de vida baseadas nos resultados específicos encontrados. Isto é apenas educacional - sempre recomende consultar profissionais de saúde.`;

    const messages: Array<{ role: string; content: Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Por favor, analise este exame laboratorial e extraia TODOS os valores dos biomarcadores presentes. Identifique o tipo de exame e forneça recomendações de saúde em português brasileiro."
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

    interface Biomarker {
      name: string;
      value: number | null;
      value_text: string | null;
      is_descriptive: boolean;
      unit?: string;
      reference_min?: number;
      reference_max?: number;
      is_normal?: boolean;
      category?: string;
    }

    let analysisResult: {
      biomarkers: Biomarker[];
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
        console.log('Successfully parsed biomarkers count:', analysisResult.biomarkers?.length || 0);
        console.log('Biomarkers found:', analysisResult.biomarkers?.map(b => b.name));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        biomarkers: [],
        biological_age: null,
        metabolic_risk_score: null,
        inflammation_score: null,
        recommendations: ["Não foi possível extrair os biomarcadores. Por favor, certifique-se de que a imagem do exame está clara e legível."]
      };
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create the lab result record first
    const { data: labResult, error: labError } = await supabase
      .from('lab_results')
      .insert({
        user_id: userId,
        file_name: fileName,
        biological_age: analysisResult.biological_age,
        metabolic_risk_score: analysisResult.metabolic_risk_score,
        inflammation_score: analysisResult.inflammation_score,
        ai_recommendations: analysisResult.recommendations,
      })
      .select()
      .single();

    if (labError) {
      console.error('Database error creating lab result:', labError);
      throw labError;
    }

    console.log('Lab result created:', labResult.id);

    // Insert dynamic biomarkers into the new table
    if (analysisResult.biomarkers && analysisResult.biomarkers.length > 0) {
      const biomarkersToInsert = analysisResult.biomarkers
        .filter(b => b.name && (b.value !== null || b.value_text !== null))
        .map(biomarker => {
          const isDescriptive = biomarker.is_descriptive === true || (biomarker.value === null && biomarker.value_text !== null);
          return {
            lab_result_id: labResult.id,
            name: biomarker.name,
            value: isDescriptive ? null : (typeof biomarker.value === 'number' ? biomarker.value : parseFloat(String(biomarker.value)) || null),
            value_text: isDescriptive ? (biomarker.value_text || String(biomarker.value)) : null,
            is_descriptive: isDescriptive,
            unit: isDescriptive ? null : (biomarker.unit || null),
            reference_min: isDescriptive ? null : (biomarker.reference_min ?? null),
            reference_max: isDescriptive ? null : (biomarker.reference_max ?? null),
            is_normal: biomarker.is_normal ?? true,
            category: biomarker.category || 'geral',
          };
        });

      console.log('Inserting biomarkers:', biomarkersToInsert.length);
      console.log('Descriptive biomarkers:', biomarkersToInsert.filter(b => b.is_descriptive).length);
      console.log('Numeric biomarkers:', biomarkersToInsert.filter(b => !b.is_descriptive).length);

      if (biomarkersToInsert.length > 0) {
        const { error: biomarkerError } = await supabase
          .from('detected_biomarkers')
          .insert(biomarkersToInsert);

        if (biomarkerError) {
          console.error('Error inserting biomarkers:', biomarkerError);
          // Don't fail the whole request, just log the error
        } else {
          console.log('Biomarkers inserted successfully');
        }
      }
    } else {
      console.log('No biomarkers detected in the exam');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: labResult,
      biomarkersCount: analysisResult.biomarkers?.length || 0
    }), {
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
