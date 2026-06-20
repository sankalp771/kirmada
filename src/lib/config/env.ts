// Free models via OpenRouter with large context windows and good reasoning
// Auto-rotation uses only the user-approved free models below.
export const FREE_MODELS = [
  {
    name: "meta-llama/llama-3.3-70b-instruct:free",
    contextWindow: 128000,
    displayName: "Llama 3.3 70B Instruct",
    free: true,
  },
  {
    name: "qwen/qwen3-coder:free",
    contextWindow: 128000,
    displayName: "Qwen3 Coder",
    free: true,
  },
  {
    name: "openai/gpt-oss-120b:free",
    contextWindow: 131072,
    displayName: "GPT-OSS 120B",
    free: true,
  },
  {
    name: "qwen/qwen3-next-80b-a3b-instruct:free",
    contextWindow: 131072,
    displayName: "Qwen3 Next 80B A3B Instruct",
    free: true,
  },
  {
    name: "google/gemma-4-31b-it:free",
    contextWindow: 128000,
    displayName: "Gemma 4 31B IT",
    free: true,
  },
  {
    name: "google/gemma-4-26b-a4b-it:free",
    contextWindow: 128000,
    displayName: "Gemma 4 26B A4B IT",
    free: true,
  },
];

// Rotation state
let modelRotationIndex = 0;
let lastRotationTime = Date.now();
let rotationCount = 0;

export function getNextModel() {
  const model = FREE_MODELS[modelRotationIndex];
  modelRotationIndex = (modelRotationIndex + 1) % FREE_MODELS.length;
  rotationCount++;
  lastRotationTime = Date.now();
  return model;
}

export function getCurrentModel() {
  return FREE_MODELS[modelRotationIndex];
}

export function getModelByName(name: string) {
  return FREE_MODELS.find((m) => m.name === name);
}

export function getRotationStats() {
  return {
    currentModel: FREE_MODELS[modelRotationIndex],
    modelIndex: modelRotationIndex,
    totalModels: FREE_MODELS.length,
    rotationCount,
    lastRotationTime,
  };
}

export const ENV = {
  databaseUrl: process.env.DATABASE_URL,
  mockLlm: (process.env.MOCK_LLM ?? "false").toLowerCase() === "true",
  openrouterApiKey1: process.env.OPENROUTER_API_KEY_1,
  openrouterApiKey2: process.env.OPENROUTER_API_KEY_2,
  openrouterApiUrl: "https://openrouter.ai/api/v1/chat/completions",
  autoRotate: true,
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "10143"),
  monadRpc: process.env.NEXT_PUBLIC_MONAD_RPC ?? "https://testnet-rpc.monad.xyz",
  identityRegistry:
    process.env.NEXT_PUBLIC_ERC8004_IDENTITY ??
    "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  mintPrivateKey: process.env.MONAD_MINTER_PRIVATE_KEY,
  mintToAddress: process.env.MONAD_MINTER_TO_ADDRESS,
  schismThreshold: Number(process.env.SCHISM_CRITICISM_THRESHOLD ?? "18"),
} as const;
