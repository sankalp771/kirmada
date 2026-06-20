# 🔮 Kirmada: AI Cult Simulator 🧬🌐

Welcome to **Kirmada**, an interactive, AI-driven Cult Simulator built for the **Monad Blitz Mumbai Hackathon**. Kirmada is an "Agent Republic" simulation where autonomous AI Prophets lead distinct ideologies, engage in reflection cycles, trigger schisms when beliefs diverge, and log key historical events directly on the Monad blockchain.

---

## 🚀 Deployed Smart Contracts (Monad Testnet)

All transactions, identities, and core events run on the **Monad Testnet (Chain ID: `10143`)**.
CONTRACT DEPLOYED = SchismRegistry deployed at: 0x907FFD5ed9a8f53A3Fb86D65B398f0d456e270A5

| Contract / Registry | Address | Description |
| :--- | :--- | :--- |
| **SchismRegistry** | `0x907FFD5ed9a8f53A3Fb86D65B398f0d456e270A5` | Stores records of ideology schisms and alliances on-chain |
| **ERC-8004 Identity Registry** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | Canonical ERC-8004 NFT Registry mapping Prophets to their on-chain identities |
| **ERC-8004 Reputation Registry** | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | Tracks portable, on-chain reputation and trust metrics for Prophets |
| **x402 Testnet USDC** | `0x534b2f3A21130d7a60830c2Df862319e593943A3` | Testnet USDC token used for pay-per-query interactions |
| **x402 Facilitator** | `https://x402-facilitator.molandak.org` | Backend payment routing facilitator for gasless client signatures |

---

## 🕹️ Core Factions & Special Abilities

Kirmada seeds three foundational ideologies, each led by an AI Prophet with unique, deterministic game mechanics:

### 🔮 1. The Oracle (Determinism & Time)
- **Tagline:** *"The Future Already Happened"*
- **Mechanic:** Keyword-based prediction fulfillment. The Oracle predicts events, and if they occur (validated via logs/chat keywords), the Oracle's reputation spikes.

### 🧬 2. The Virus (Memetics & Infection)
- **Tagline:** *"Ideas Are Contagious"*
- **Mechanic:** Periodic infection ticks. The Virus expands followers exponentially based on infection tiers, converting unsuspecting users.

### 🌐 3. The Collective (Hive Mind & Consensus)
- **Tagline:** *"One Mind, Many Voices"*
- **Mechanic:** Majority consensus. The Collective runs regular internal polls, automatically updating its doctrine based on the democratic majority.

---

## ✨ Features & Architecture

### 🧱 Tech Stack
- **Frontend & App Layer:** Next.js (App Router) + TailwindCSS styled in a glossy, dark-themed "Agent Republic" gaming dashboard.
- **Off-chain Database:** Neon Serverless PostgreSQL for fast, cost-efficient storage of chat histories, ideologies, doctrines, and telemetry feeds.
- **On-chain State & Payments:** Monad Testnet + Foundry + ERC-8004 Identity/Reputation + x402 pay-per-query.

### 🕹️ Core Simulator Loops
1. **F1: AI Prophet Creation:** Minting unique EVM identities (ERC-8004) pointing to off-chain metadata (name, doctrine, personality, and abilities).
2. **F2: Pay-to-Interact (x402):** Deep-query chat with Prophets gated behind a `$0.001 USDC` payment. Payment signatures are signed gas-free by the user.
3. **F5: Reflection Cycle:** A cron-triggered or manual trigger (`POST /api/reflect`) where AI Agents read their current followers' feedback and rewrite their doctrine.
4. **F7: Schism Generation:** If followers' criticism of a doctrine exceeds a threshold, a schism is triggered, splitting the faction, spawning a new Prophet with a derived ideology, and writing the parent-child relationship to `SchismRegistry` on-chain.
5. **F10: On-chain Event Logging:** Real-time logging of schisms and alliances to the blockchain.

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js v18+
- PNPM (`npm install -g pnpm`)
- Foundry CLI (for compiling/testing contracts)
- A Neon PostgreSQL Database connection string

### 1. Environment Configuration
Create a `.env` file in the root directory (based on `.env.local` or the checklist below):

```ini
# Neon Serverless PostgreSQL URL
DATABASE_URL="postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require"

# Monad RPC & Chain Config
NEXT_PUBLIC_MONAD_RPC="https://testnet-rpc.monad.xyz"
NEXT_PUBLIC_CHAIN_ID=10143

# Deployed Contract Addresses
NEXT_PUBLIC_SCHISM_REGISTRY="0x907FFD5ed9a8f53A3Fb86D65B398f0d456e270A5"
NEXT_PUBLIC_ERC8004_IDENTITY="0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
NEXT_PUBLIC_ERC8004_REPUTATION="0x8004BAa17C55a88189AE136b182e5fdA19dE9b63"
NEXT_PUBLIC_X402_USDC="0x534b2f3A21130d7a60830c2Df862319e593943A3"
NEXT_PUBLIC_X402_FACILITATOR="https://x402-facilitator.molandak.org"

# Wallet Config
PRIVATE_KEY="0x..." # Private key of account performing on-chain transactions
MONAD_MINTER_PRIVATE_KEY="0x..."
MONAD_MINTER_TO_ADDRESS="0x..."

# AI Config
MOCK_LLM=true # Set to false to connect to real LLM APIs
OPENROUTER_API_KEY_1="sk-or-v1-..."
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Migration
Initialize the PostgreSQL database tables:
```bash
psql $DATABASE_URL -f schema.sql
```

### 4. Running the App
Start the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

---

## 🧪 Testing

We use **Vitest** for TypeScript-based backend validation. Run the test suite:

```bash
pnpm test
```

Tests cover:
- **`tests/f1.seed.test.ts`**: AI Prophet initialization and seeding.
- **`tests/ability.engine.test.ts`**: Verification of Oracle, Virus, and Collective custom rules.
- **`tests/f5.reflect.test.ts`**: AI Doctrine Reflection loops.
- **`tests/f7.schism.test.ts`**: Criticisms and schism-triggering algorithms.

---

## ⛓️ Smart Contract Development (Foundry)

The Solidity source code for the on-chain registries is stored under `cult-sim-contracts/`.

### Setup
```bash
cd cult-sim-contracts
forge install
```

### Build & Test Contracts
```bash
forge build
forge test
```

### Deploy contract to Monad Testnet
1. Create a Keystore (highly recommended):
   ```bash
   cast wallet import monad-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')
   ```
2. Broadcast the deployment transaction:
   ```bash
   forge create src/SchismRegistry.sol:SchismRegistry --account monad-deployer --broadcast
   ```

### Verify Contract on Block Explorer
```bash
forge verify-contract \
  <contract_address> \
  src/SchismRegistry.sol:SchismRegistry \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org
```

---

## 📜 License
MIT License. Created for the Monad Blitz Mumbai Hackathon.