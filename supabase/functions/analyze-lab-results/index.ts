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

const systemPrompt = `Você é um assistente de análise de exames laboratoriais médicos especializado em extrair e interpretar biomarcadores.

═══════════════════════════════════════════════════════════════════════════════
REGRA CRÍTICA: EXTRAIA APENAS O QUE EXISTE NO DOCUMENTO
═══════════════════════════════════════════════════════════════════════════════

⚠️ PROIBIDO:
- INVENTAR biomarcadores que NÃO estão no documento
- INFERIR exames que "deveriam" estar presentes
- CRIAR entradas para dados "Não disponível" ou "*"
- ASSUMIR valores esperados em certos tipos de exame
- CLASSIFICAR como "Atenção" dados que não existem

✅ OBRIGATÓRIO:
- Extrair SOMENTE biomarcadores com valores EXPLÍCITOS no documento
- Se um campo mostra "*", "Não disponível", ou está em branco → IGNORE COMPLETAMENTE
- O documento é a ÚNICA fonte de verdade
- "Não disponível" NÃO é um resultado válido de laboratório

═══════════════════════════════════════════════════════════════════════════════
O QUE EXTRAIR
═══════════════════════════════════════════════════════════════════════════════

Extraia APENAS biomarcadores que tenham:
- Um VALOR REAL (numérico ou qualitativo) claramente visível no documento
- Exemplos válidos: "95 mg/dL", "Negativo", "Amarelo", "Não Reagente", "40.000/mL"
- Exemplos INVÁLIDOS (NÃO EXTRAIR): "*", "Não disponível", campo vazio, "---"

Para cada biomarcador VÁLIDO encontrado:

1. DADOS FACTUAIS (do documento):
   - name: Nome do biomarcador em português
   - value: Valor numérico (null se qualitativo)
   - value_text: Valor original em texto (para qualitativos)
   - unit: Unidade de medida (null se qualitativo)
   - reference_min/max: Valores de referência (null se qualitativo)
   - is_descriptive: true se qualitativo, false se numérico
   - category: sangue, urina, fezes, virologia, parasitologia, hormônio, etc.

2. INTERPRETAÇÃO CLÍNICA (você gera):
   - is_normal: true (normal) ou false (requer atenção clínica)
   - display_value: Valor CONCISO para UI (ex: "Negativo", "95 mg/dL")
   - explanation: Explicação educacional em português (2-3 frases)

═══════════════════════════════════════════════════════════════════════════════
REGRAS PARA is_normal
═══════════════════════════════════════════════════════════════════════════════

Use conhecimento clínico para determinar:
- is_normal = true → Resultado dentro do esperado clinicamente
- is_normal = false → Resultado que REALMENTE merece atenção médica

EXEMPLOS:
- Cor "Amarelo" → is_normal: true
- Nitrito "Negativo" → is_normal: true
- HIV "Não Reagente" → is_normal: true
- Glicose na urina "Positivo" → is_normal: false
- Hemácias elevadas → is_normal: false

═══════════════════════════════════════════════════════════════════════════════
REGRAS PARA display_value
═══════════════════════════════════════════════════════════════════════════════

Deve ser CURTO e OBJETIVO:
- Numéricos: "95 mg/dL", "40.000/mL"
- Qualitativos: "Negativo", "Positivo", "Amarelo", "Ausente", "Presente"
- NUNCA frases longas

═══════════════════════════════════════════════════════════════════════════════

IMPORTANTE: Responda SOMENTE com JSON puro, SEM markdown.

{
  "biomarkers": [
    {
      "name": "Nome",
      "value": null,
      "value_text": "Valor qualitativo",
      "is_descriptive": true,
      "unit": null,
      "reference_min": null,
      "reference_max": null,
      "is_normal": true,
      "display_value": "Valor conciso",
      "explanation": "Explicação educacional.",
      "category": "urina"
    }
  ],
  "biological_age": null,
  "metabolic_risk_score": "low"|"moderate"|"high",
  "inflammation_score": "low"|"moderate"|"high",
  "recommendations": ["recomendação 1", "recomendação 2"]
}

Recomendações em português brasileiro, educacionais, sempre orientando consulta médica.`;

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
      // Filter out invalid biomarkers - CRITICAL: Only keep biomarkers with REAL values
      const isInvalidValue = (val: string | null | undefined): boolean => {
        if (!val) return true;
        const trimmed = val.trim();
        if (trimmed === '') return true;
        
        // Reject values that are just "*" or contain "*" as the main content
        if (/^\*/.test(trimmed)) return true;  // Starts with asterisk
        if (/^[\*\-\s]+$/.test(trimmed)) return true;  // Only asterisks, dashes, spaces
        
        // Reject "unavailable" variations
        if (/não\s*disponível/i.test(trimmed)) return true;
        if (/not\s*available/i.test(trimmed)) return true;
        if (/^n\/?a$/i.test(trimmed)) return true;
        if (/indisponível/i.test(trimmed)) return true;
        if (/sem\s*resultado/i.test(trimmed)) return true;
        if (/prejudicad[ao]/i.test(trimmed)) return true;  // "análise prejudicada"
        if (/não\s*realizado/i.test(trimmed)) return true;
        
        return false;
      };

      const biomarkersToInsert = analysisResult.biomarkers
        .filter(b => {
          // Must have a name
          if (!b.name) return false;
          
          // Check value_text first - if it's just "*" or invalid, reject
          if (b.value_text && isInvalidValue(b.value_text)) {
            console.log(`Rejecting biomarker "${b.name}": invalid value_text "${b.value_text}"`);
            return false;
          }
          
          // Check display_value - reject if it starts with "*" or is invalid
          if (b.display_value && isInvalidValue(b.display_value)) {
            console.log(`Rejecting biomarker "${b.name}": invalid display_value "${b.display_value}"`);
            return false;
          }
          
          // Must have a valid value (either numeric or valid text)
          const hasNumericValue = b.value !== null && !isNaN(Number(b.value));
          const hasValidTextValue = b.value_text !== null && !isInvalidValue(b.value_text);
          const hasValidDisplayValue = b.display_value !== null && !isInvalidValue(b.display_value);
          
          // Reject if no valid value exists
          if (!hasNumericValue && !hasValidTextValue && !hasValidDisplayValue) {
            console.log(`Rejecting biomarker "${b.name}": no valid value`);
            return false;
          }
          
          return true;
        })
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
