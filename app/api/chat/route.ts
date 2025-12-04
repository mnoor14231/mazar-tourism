import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Cache for knowledge base to avoid reading file repeatedly
let knowledgeBaseCache: string | null = null;

async function getKnowledgeBase(): Promise<string> {
  if (knowledgeBaseCache) {
    return knowledgeBaseCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'ai.txt');
    knowledgeBaseCache = await fs.readFile(filePath, 'utf-8');
    return knowledgeBaseCache;
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    throw new Error('Failed to load knowledge base');
  }
}

async function getPlacesContext() {
  try {
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        audience: true,
        environment: true,
        requiresBooking: true,
        latitude: true,
        longitude: true,
        openingHours: true,
      },
    });

    return places.map((place) => {
      const audience = JSON.parse(place.audience) as string[];
      return {
        id: place.id,
        name: place.name,
        type: place.type,
        description: place.description,
        audience: audience,
        environment: place.environment,
        requiresBooking: place.requiresBooking,
        openingHours: place.openingHours,
        latitude: place.latitude,
        longitude: place.longitude,
      };
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, conversationState } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[CHAT API] ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured', fallbackRequired: true },
        { status: 500 }
      );
    }
    
    // Validate API key format (should start with sk-ant-)
    if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
      console.error('[CHAT API] Invalid API key format');
      return NextResponse.json(
        { error: 'Invalid API key format', fallbackRequired: true },
        { status: 500 }
      );
    }

    // Load knowledge base and places
    const [knowledgeBase, places] = await Promise.all([
      getKnowledgeBase(),
      getPlacesContext(),
    ]);

    // Format places for AI context
    const placesContext = places
      .map((place) => {
        return `
ID: ${place.id}
Name: ${place.name}
Type: ${place.type === 'religious' ? 'ديني' : place.type === 'historical' ? 'تاريخي' : 'ترفيهي'}
Description: ${place.description}
Audience: ${place.audience.join(', ')}
Environment: ${place.environment}
Requires Booking: ${place.requiresBooking ? 'Yes' : 'No'}
Opening Hours: ${place.openingHours}
Location: (${place.latitude}, ${place.longitude})
---`;
      })
      .join('\n');

    // Build system prompt
    const systemPrompt = `${knowledgeBase}

################################
AVAILABLE PLACES IN DATABASE:
################################
${placesContext}

################################
CURRENT CONVERSATION STATE:
################################
${conversationState ? JSON.stringify(conversationState, null, 2) : 'No state yet'}

################################
RESPONSE FORMAT:
################################
You MUST respond with valid JSON in this exact format:
{
  "response": "Your natural language response in Arabic",
  "preferences": {
    "stay_duration_days": number or null,
    "age_group": "string or null",
    "trip_type": "string or null",
    "has_kids": boolean or null,
    "has_seniors": boolean or null,
    "preferred_place_types": ["array of strings"] or [],
    "max_places": number or null,
    "free_notes": "string or null"
  },
  "suggested_places": [
    {"id": "place_id", "name": "place_name", "reason": "reason in Arabic"}
  ],
  "conversation_step": "duration | tripType | age | placeTypes | numberOfPlaces | complete",
  "next_action": "continue | generate_route",
  "needs_clarification": boolean,
  "confidence": number between 0 and 1
}

CRITICAL RULES:
1. Extract ALL information from user's message (even if it answers multiple questions)
2. For unclear words, ask friendly clarification in Arabic
3. Consider age and family type when suggesting places
4. Use emojis appropriately (🕌, ✨, 😊, 👨‍👩‍👧‍👦, 🎉)
5. Be natural and friendly, not robotic
6. ONLY suggest places when you have enough information
7. Fill preferences with null if not yet known
`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content,
    }));

    // Call Anthropic API
    console.log('[CHAT API] Calling Anthropic API...');
    console.log('[CHAT API] API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('[CHAT API] Messages count:', anthropicMessages.length);
    
    // Try different models in order of preference
    const modelsToTry = [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307',
    ];

    let response;
    let lastError;
    
    for (const model of modelsToTry) {
      try {
        console.log(`[CHAT API] Trying model: ${model}`);
        response = await anthropic.messages.create({
          model: model,
          max_tokens: 2000,
          system: systemPrompt,
          messages: anthropicMessages,
        });
        console.log(`[CHAT API] Success with model: ${model}`);
        break; // Success, exit loop
      } catch (error: any) {
        console.error(`[CHAT API] Failed with model ${model}:`, error.message);
        lastError = error;
        // If it's not a model not found error, throw immediately
        if (error.status !== 404 && error.error?.type !== 'not_found_error') {
          throw error;
        }
        // Continue to next model
      }
    }
    
    if (!response) {
      throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    console.log('[CHAT API] Received response from Anthropic');

    // Extract text content
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    let aiResponse;
    try {
      // Try to parse as JSON
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create structured response from text
        aiResponse = {
          response: textContent.text,
          preferences: {},
          suggested_places: [],
          conversation_step: conversationState?.step || 'duration',
          next_action: 'continue',
          needs_clarification: false,
          confidence: 0.5,
        };
      }
    } catch (parseError) {
      console.error('[CHAT API] Failed to parse AI response as JSON:', parseError);
      // Return text response wrapped in structure
      aiResponse = {
        response: textContent.text,
        preferences: {},
        suggested_places: [],
        conversation_step: conversationState?.step || 'duration',
        next_action: 'continue',
        needs_clarification: false,
        confidence: 0.5,
      };
    }

    return NextResponse.json({
      success: true,
      data: aiResponse,
    });
  } catch (error: any) {
    console.error('[CHAT API] Error:', error);

    // Check if it's an Anthropic API error
    if (error.status) {
      return NextResponse.json(
        {
          error: `AI service error: ${error.message}`,
          fallbackRequired: true,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        fallbackRequired: true,
        details: error.message,
      },
      { status: 500 }
    );
  }
}

