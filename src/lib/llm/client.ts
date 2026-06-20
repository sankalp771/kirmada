import { ENV, FREE_MODELS, getNextModel, getModelByName, getRotationStats } from "../config/env";

type LlmChatOptions = {
  purpose: "generate_ideology" | "reflection" | "schism";
  mock: () => unknown;
  systemPrompt: string;
  userPrompt: string;
};

let apiKeyToggle = false;

function getApiKey(): string {
  apiKeyToggle = !apiKeyToggle;
  const key = apiKeyToggle ? (ENV.openrouterApiKey2 || ENV.openrouterApiKey1) : (ENV.openrouterApiKey1 || ENV.openrouterApiKey2);
  if (!key) throw new Error("No OpenRouter API key configured");
  return key;
}

export async function callLlmJson<T>(options: LlmChatOptions): Promise<T> {
  if (ENV.mockLlm) {
    return options.mock() as T;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY_1 or OPENROUTER_API_KEY_2 is required when MOCK_LLM=false");
  }

  // Auto-rotate through free models
  const model = getNextModel();
  const stats = getRotationStats();
  const displayName = `${model.displayName} [${stats.modelIndex + 1}/${stats.totalModels}]`;

  try {
    const response = await fetch(ENV.openrouterApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": ENV.appBaseUrl,
        "X-Title": "Kirmada Cult Simulator",
      },
      body: JSON.stringify({
        model: model.name,
        messages: [
          { role: "system", content: options.systemPrompt },
          { role: "user", content: options.userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      const errorMsg = (error as any)?.error?.message || JSON.stringify(error);
      throw new Error(`OpenRouter ${response.status}: ${errorMsg}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter returned empty content");
    }

    console.debug(`✓ Used ${displayName} for ${options.purpose}`);
    return JSON.parse(content) as T;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`LLM call failed: ${message}`);
  }
}
