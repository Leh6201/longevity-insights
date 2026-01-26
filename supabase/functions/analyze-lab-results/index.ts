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
    const { fileBase64, fileType, userId, fileName, reanalyze, existingLabResultId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing lab results for user:', userId);
    console.log('File type:', fileType);

const systemPrompt = `Você é um assistente de análise de exames laboratoriais médicos especializado em extrair e interpretar QUALQUER tipo de biomarcador de QUALQUER tipo de exame.

═══════════════════════════════════════════════════════════════════════════════
FILOSOFIA CENTRAL: INTERPRETAÇÃO DINÂMICA PELA IA
═══════════════════════════════════════════════════════════════════════════════

Você é EXAM-AGNOSTIC (agnóstico ao tipo de exame). Não existem regras pré-definidas.
Você deve usar seu conhecimento clínico para interpretar QUALQUER resultado de:
- Exames de sangue (hemograma, bioquímica, hormônios, etc.)
- Exames de urina (EAS, urocultura, etc.)
- Exames de fezes
- Exames virológicos (HIV, Hepatite, etc.)
- Exames parasitológicos
- Qualquer outro tipo de exame laboratorial

═══════════════════════════════════════════════════════════════════════════════
TAREFA: EXTRAIR E INTERPRETAR
═══════════════════════════════════════════════════════════════════════════════

Para CADA biomarcador encontrado no documento, extraia:

1. DADOS FACTUAIS (extraídos do documento):
   - name: Nome do biomarcador em português
   - value: Valor numérico (null se qualitativo)
   - value_text: Valor original em texto (para resultados qualitativos)
   - unit: Unidade de medida (null se qualitativo)
   - reference_min/max: Valores de referência (null se qualitativo)
   - is_descriptive: true se qualitativo, false se numérico
   - category: Categoria do exame (sangue, urina, fezes, virologia, parasitologia, hormônio, etc.)

2. INTERPRETAÇÃO PELA IA (você deve gerar):
   - is_normal: Sua interpretação clínica se o resultado é normal (true) ou requer atenção (false)
   - display_value: Valor CONCISO para exibição na UI (ex: "Negativo", "Amarelo", "95 mg/dL")
   - explanation: Explicação EDUCACIONAL em português para o usuário entender o resultado

═══════════════════════════════════════════════════════════════════════════════
REGRAS PARA INTERPRETAÇÃO (is_normal)
═══════════════════════════════════════════════════════════════════════════════

Use seu conhecimento clínico para determinar:
- is_normal = true → Resultado clinicamente aceitável, dentro do esperado
- is_normal = false → Resultado que REALMENTE merece atenção do usuário

EXEMPLOS DE INTERPRETAÇÃO:
- Cor da urina "Amarelo" ou "Yellow" → is_normal: true (cor normal)
- Nitrito "Negativo" → is_normal: true (sem infecção bacteriana)
- HIV "Não Reagente" → is_normal: true (sem evidência de infecção)
- Glicose "Positivo" na urina → is_normal: false (requer investigação)
- Hemácias "Numerosas" → is_normal: false (hematúria significativa)
- Parasitas "Detectado" → is_normal: false (requer tratamento)

═══════════════════════════════════════════════════════════════════════════════
REGRAS PARA display_value (valor conciso)
═══════════════════════════════════════════════════════════════════════════════

O display_value deve ser CURTO e OBJETIVO:
- Para numéricos: "95 mg/dL", "5.5", "1.025"
- Para qualitativos: "Negativo", "Positivo", "Amarelo", "Não Reagente", "Ausente"
- NUNCA coloque frases longas como "Não houve crescimento bacteriano após 48h..."
- Simplifique para: "Negativo" ou "Ausente"

EXEMPLOS:
- "Não houve crescimento bacteriano patogênico após 48 hs de incubação" → display_value: "Negativo"
- "Ausência de parasitas" → display_value: "Ausente"
- "Presença de cristais de oxalato" → display_value: "Presente"
- "Yellow" ou "Amarelo claro" → display_value: "Amarelo"

═══════════════════════════════════════════════════════════════════════════════
REGRAS PARA explanation (explicação educacional)
═══════════════════════════════════════════════════════════════════════════════

A explicação deve ser:
- Em PORTUGUÊS BRASILEIRO
- Linguagem SIMPLES e AMIGÁVEL (não-médica)
- EDUCACIONAL (ajudar o usuário a entender o que significa)
- Máximo de 2-3 frases

EXEMPLOS:
- Cor da urina: "A cor da urina indica seu nível de hidratação. Urina amarelo claro geralmente significa boa hidratação."
- Nitrito: "Resultado negativo significa que não há sinais de infecção bacteriana no trato urinário."
- HIV: "Resultado não reagente indica que não há evidência de infecção pelo vírus HIV nesta amostra."
- Glicose elevada: "A presença de glicose na urina pode indicar níveis elevados de açúcar no sangue. Recomenda-se acompanhamento médico."

═══════════════════════════════════════════════════════════════════════════════

IMPORTANTE: Responda SOMENTE com JSON puro, SEM markdown, SEM \`\`\`json.

Formato de resposta:
{
  "biomarkers": [
    {
      "name": "Cor",
      "value": null,
      "value_text": "Amarelo",
      "is_descriptive": true,
      "unit": null,
      "reference_min": null,
      "reference_max": null,
      "is_normal": true,
      "display_value": "Amarelo",
      "explanation": "A cor da urina indica seu nível de hidratação. Amarelo claro é considerado normal.",
      "category": "urina"
    },
    {
      "name": "Glicose",
      "value": 95,
      "value_text": null,
      "is_descriptive": false,
      "unit": "mg/dL",
      "reference_min": 70,
      "reference_max": 100,
      "is_normal": true,
      "display_value": "95 mg/dL",
      "explanation": "Nível de açúcar no sangue dentro da faixa normal. Indica bom controle glicêmico.",
      "category": "sangue"
    }
  ],
  "biological_age": number|null,
  "metabolic_risk_score": "low"|"moderate"|"high",
  "inflammation_score": "low"|"moderate"|"high",
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4", "recomendação 5"]
}

Recomendações devem ser em português brasileiro, educacionais e sempre orientar consulta com profissionais de saúde.`;

    const messages: Array<{ role: string; content: Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Por favor, analise este exame laboratorial e extraia TODOS os valores dos biomarcadores presentes. Para cada um, forneça sua interpretação clínica (is_normal), um valor conciso (display_value) e uma explicação educacional (explanation) em português."
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
      display_value?: string;
      explanation?: string;
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
        console.log('Biomarkers found:', analysisResult.biomarkers?.map(b => `${b.name}: ${b.display_value} (normal: ${b.is_normal})`));
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

    let labResult;
    
    if (reanalyze && existingLabResultId) {
      // Update existing lab result
      console.log('Reanalyzing existing lab result:', existingLabResultId);
      
      const { data: updatedLabResult, error: updateError } = await supabase
        .from('lab_results')
        .update({
          biological_age: analysisResult.biological_age,
          metabolic_risk_score: analysisResult.metabolic_risk_score,
          inflammation_score: analysisResult.inflammation_score,
          ai_recommendations: analysisResult.recommendations,
        })
        .eq('id', existingLabResultId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Database error updating lab result:', updateError);
        throw updateError;
      }
      
      labResult = updatedLabResult;
      console.log('Lab result updated:', labResult.id);
    } else {
      // Create new lab result record
      const { data: newLabResult, error: labError } = await supabase
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
      
      labResult = newLabResult;
      console.log('Lab result created:', labResult.id);
    }

    // Insert dynamic biomarkers into the table with AI-generated interpretation
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
            display_value: biomarker.display_value || null,
            explanation: biomarker.explanation || null,
            category: biomarker.category || 'geral',
          };
        });

      console.log('Inserting biomarkers:', biomarkersToInsert.length);
      console.log('Sample biomarker:', JSON.stringify(biomarkersToInsert[0], null, 2));

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
