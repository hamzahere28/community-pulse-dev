import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  preferences: {
    occasion?: string;
    season?: string;
    personality?: string;
    favoriteNotes?: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences }: RecommendationRequest = await req.json();
    console.log("Generating fragrance recommendations for:", preferences);

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `As a professional perfume expert, recommend 3 luxury fragrances based on these preferences:
    - Occasion: ${preferences.occasion || 'any'}
    - Season: ${preferences.season || 'any'}
    - Personality: ${preferences.personality || 'versatile'}
    - Favorite Notes: ${preferences.favoriteNotes?.join(', ') || 'open to suggestions'}
    
    For each recommendation, provide:
    1. Fragrance name (make it elegant and luxurious)
    2. Scent family (Floral, Oriental, Woody, or Fresh)
    3. Top notes, heart notes, and base notes
    4. Description (2-3 sentences about the character and mood)
    5. Best occasions for wearing it
    
    Format as JSON array with these exact fields: name, family, topNotes, heartNotes, baseNotes, description, occasions, price (between $95-$150)`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert perfume consultant with deep knowledge of fragrance notes, compositions, and profiles. Always respond with valid JSON.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("AI Response received:", data);
    
    const aiContent = data.choices[0].message.content;
    
    // Extract JSON from markdown code blocks if present
    let recommendationsText = aiContent;
    if (aiContent.includes('```json')) {
      recommendationsText = aiContent.split('```json')[1].split('```')[0].trim();
    } else if (aiContent.includes('```')) {
      recommendationsText = aiContent.split('```')[1].split('```')[0].trim();
    }
    
    const recommendations = JSON.parse(recommendationsText);

    return new Response(JSON.stringify({ 
      recommendations,
      preferences 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in fragrance-recommender function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate recommendations. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});