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

    // Use Gemini for multimodal analysis
    const systemPrompt = `You are a medical lab results analyzer specialized in longevity and health biomarkers. 
    
Your task is to:
1. Extract biomarker values from the lab test image/document
2. Calculate a biological age estimate based on the biomarkers
3. Assess metabolic and inflammation risk scores
4. Generate personalized health recommendations

IMPORTANT: This is for educational purposes only. Always recommend consulting healthcare professionals.

Extract the following biomarkers if present (return null if not found):
- Total Cholesterol (mg/dL)
- HDL (mg/dL)
- LDL (mg/dL)
- Triglycerides (mg/dL)
- Glucose (mg/dL)
- Hemoglobin (g/dL)
- Creatinine (mg/dL)
- AST (U/L)
- ALT (U/L)
- GGT (U/L)
- Vitamin D (ng/mL)
- TSH (mIU/L)
- CRP (mg/L)

Respond ONLY with valid JSON in this exact format:
{
  "biomarkers": {
    "total_cholesterol": number or null,
    "hdl": number or null,
    "ldl": number or null,
    "triglycerides": number or null,
    "glucose": number or null,
    "hemoglobin": number or null,
    "creatinine": number or null,
    "ast": number or null,
    "alt": number or null,
    "ggt": number or null,
    "vitamin_d": number or null,
    "tsh": number or null,
    "crp": number or null
  },
  "biological_age": number (estimated based on biomarkers),
  "metabolic_risk_score": "low" | "moderate" | "high",
  "inflammation_score": "low" | "moderate" | "high",
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3",
    "recommendation 4",
    "recommendation 5"
  ]
}`;

    const messages: any[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this lab test and extract all biomarker values. Provide biological age estimate and health recommendations."
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

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return default values if parsing fails
      analysisResult = {
        biomarkers: {},
        biological_age: null,
        metabolic_risk_score: null,
        inflammation_score: null,
        recommendations: ["Unable to extract biomarkers. Please ensure the lab test image is clear and readable."]
      };
    }

    // Save to database
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

  } catch (error) {
    console.error('Error in analyze-lab-results:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
