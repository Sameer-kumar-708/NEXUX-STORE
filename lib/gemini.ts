import { GoogleGenAI, Type } from '@google/genai'

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.')
  }
  return new GoogleGenAI({ apiKey })
}

export interface ParsedSearchQuery {
  cleanedQuery: string
  filters: {
    maxPrice?: number | null
    minPrice?: number | null
    category?: string | null
  }
  explanation?: string
}

/**
 * Generate a 768-dimensional embedding vector for a given string using Gemini text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const ai = getGenAIClient()
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: {
        outputDimensionality: 1024,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resAny = response as any
    const embeddingValues = resAny.embedding?.values || resAny.embeddings?.[0]?.values

    if (!embeddingValues) {
      throw new Error('No embedding values returned from Gemini API')
    }

    return embeddingValues
  } catch (error) {
    console.error('[Gemini Embedding Error]:', error)
    throw error
  }
}

/**
 * Parses user input (multilingual or Hinglish) into structured search intent & filters.
 * Example: "Mujhe laptop chaiye 50000 se kam price me"
 * -> { cleanedQuery: "laptop computer", filters: { maxPrice: 50000, category: "laptops" } }
 */
export async function parseSearchQuery(rawQuery: string): Promise<ParsedSearchQuery> {
  if (!rawQuery || !rawQuery.trim()) {
    return { cleanedQuery: '', filters: {} }
  }

  try {
    const ai = getGenAIClient()

    const prompt = `
You are a multilingual e-commerce search query parser for NEXUX-STORE.
The user input may be in English, Hindi, Hinglish (Hindi written in Roman script, e.g., "Mujhe cheap laptop chaiye", "phone under $300"), Spanish, etc.

Your task:
1. Translate and normalize the query into standard English product keywords for semantic vector matching.
2. Extract numeric filters like price conditions (maxPrice, minPrice) and category if explicitly mentioned or strongly implied.
3. Keep currency in numeric format assuming USD or store currency. If price like "$300" or "under 300" is given, maxPrice is 300.

Input Query: "${rawQuery}"
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cleanedQuery: {
              type: Type.STRING,
              description: 'Standardized English keywords representing the product search intent.',
            },
            filters: {
              type: Type.OBJECT,
              properties: {
                maxPrice: {
                  type: Type.NUMBER,
                  description: 'Maximum price limit extracted from query, or null if none.',
                  nullable: true,
                },
                minPrice: {
                  type: Type.NUMBER,
                  description: 'Minimum price limit extracted from query, or null if none.',
                  nullable: true,
                },
                category: {
                  type: Type.STRING,
                  description: 'Matching product category in lowercase (e.g. electronics, laptops, footwear, smartphones, audio, accessories), or null.',
                  nullable: true,
                },
              },
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief explanation of how the query was interpreted.',
            },
          },
          required: ['cleanedQuery', 'filters'],
        },
      },
    })

    const textResult = response.text
    if (!textResult) {
      return { cleanedQuery: rawQuery, filters: {} }
    }

    const parsed: ParsedSearchQuery = JSON.parse(textResult)
    return parsed
  } catch (error) {
    console.error('[Gemini Query Parse Error]:', error)
    // Fallback: return raw query with no metadata filters
    return { cleanedQuery: rawQuery, filters: {} }
  }
}
