export interface LlmConfig {
  provider: 'openai' | 'gemini'
  apiKey: string
  model: string
}

export interface LlmSummary {
  purpose: string
  strengths: string[]
  limitations: string[]
  recommendation: string
}

export async function generateSummary(
  config: LlmConfig,
  context: string
): Promise<LlmSummary> {
  if (config.provider === 'openai') {
    return callOpenAI(config, context)
  }
  return callGemini(config, context)
}

async function callOpenAI(
  config: LlmConfig,
  context: string
): Promise<LlmSummary> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Analise o repositório abaixo e retorne JSON com purpose, strengths[], limitations[], recommendation.'
        },
        { role: 'user', content: context }
      ],
      response_format: { type: 'json_object' }
    })
  })

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

async function callGemini(
  config: LlmConfig,
  context: string
): Promise<LlmSummary> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${config.model || 'gemini-2.0-flash'}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analise o repositório abaixo e retorne JSON com purpose, strengths[], limitations[], recommendation.\n\n${context}`
              }
            ]
          }
        ],
        generationConfig: { responseMimeType: 'application/json' }
      })
    }
  )

  const data = await response.json()
  return JSON.parse(data.candidates[0].content.parts[0].text)
}
