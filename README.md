# StackPool

**Bitcoin-powered group payments built on Stacks.**

Pool money toward a shared goal — split bills, collect chama contributions, fund harambees, or coordinate group expenses — with automatic release and refund logic handled by a Clarity smart contract on the Stacks blockchain.

> *Pool money. Trust the contract. Not the person.*

---

## What is StackPool?

StackPool lets groups of people collectively contribute **sBTC** (Bitcoin on Stacks) toward a target amount. When the target is reached, funds are automatically released to the designated recipient. If the deadline passes without reaching the target, every contributor is refunded in full. No middlemen. No trust required.

### The Problem

- Friends split a dinner bill and someone never pays back
- Chama members send monthly contributions via M-Pesa with zero transparency
- Harambee pledges are tracked on paper with no accountability
- Roommates split rent through awkward back-and-forth transfers
- Group travel costs turn into a reconciliation nightmare

Existing tools rely on trusting a person to hold and distribute money. StackPool replaces that trust with a smart contract — transparent, automatic, and final.

### How It Solves This

| Problem | StackPool Solution |
|---|---|
| Someone disappears with pooled money | Smart contract holds funds and auto-releases on target |
| No visibility into who has paid | On-chain contribution tracking, publicly viewable |
| Manual reconciliation of payments | Automatic distribution when the target is hit |
| Partial contributions stuck in limbo | Full refund to all contributors if the deadline passes |
| Requires crypto expertise to use | Simple UI with QR sharing, fiat estimates, no jargon |

---

## Built on Stacks

StackPool runs on the **Stacks** blockchain — a Bitcoin Layer 2 that brings smart contracts to Bitcoin. Contributions are made in **sBTC**, a 1:1 Bitcoin-backed asset on Stacks, meaning every contribution is backed by real Bitcoin.

The pool logic is written in **Clarity**, the smart contract language for Stacks. Clarity is decidable — you can read exactly what the contract will do before signing a transaction. No surprises.

**Why Stacks and not another chain?**
- Transactions are anchored to Bitcoin's proof-of-work for finality
- sBTC provides native Bitcoin exposure without bridges or wrapping
- Clarity contracts are readable and auditable by design
- BNS (Bitcoin Name System) gives contributors human-readable identities like `alice.btc`

---

## Features

**For Pool Creators:**
- Create a pool with a title, description, target amount, deadline, and recipient
- Share via QR code, direct link, WhatsApp, X, or Telegram
- Withdraw funds once the pool is fully funded
- Cancel a pool if no contributions have been made yet

**For Contributors:**
- View pool progress with a visual progress ring and percentage
- Contribute any amount in sBTC with quick-select buttons
- See live fiat estimates alongside sBTC amounts
- View the full contributor list with BNS names and timestamps

**General:**
- Live countdown timer for pool deadlines
- Search and filter public pools by status
- Dashboard showing pools you've created and contributed to
- Toast notifications for actions and transaction states
- Fully responsive — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | [Stacks](https://www.stacks.co/) (Bitcoin L2) |
| Smart Contract | [Clarity](https://clarity-lang.org/) |
| Payment Asset | sBTC (1:1 Bitcoin-backed) |
| Frontend | [Next.js 15](https://nextjs.org/) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Wallet Connectivity | `@stacks/connect` |
| Contract Interaction | `@stacks/transactions` |
| Identity | BNS (Bitcoin Name System) |
| Contract Dev & Testing | [Clarinet](https://github.com/hirosystems/clarinet) |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+

### Installation

```bash
git clone https://github.com/Thedongraphix/StackPool.git
cd StackPool
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── create/page.tsx     # Create Pool (multi-step form)
│   ├── pool/[id]/page.tsx  # Pool detail page
│   ├── dashboard/page.tsx  # My Pools dashboard
│   ├── explore/page.tsx    # Browse public pools
│   ├── layout.tsx          # Root layout (Navbar, Footer, Toast)
│   └── globals.css         # Design tokens and global styles
├── components/
│   ├── ui/                 # Button, Input, Badge, ProgressBar, ProgressRing, Toast, etc.
│   ├── layout/             # Navbar, Footer
│   ├── pool/               # PoolCard, ContributorList, Countdown
│   └── modals/             # Modal, ConnectWalletModal, ShareModal
├── lib/
│   ├── mockData.ts         # Sample pool data for Phase 1
│   └── utils.ts            # Formatting, address helpers, status mapping
└── types/
    └── index.ts            # Pool, Contributor, WalletState types
```

---

## Screens

### Landing Page (`/`)
Hero section with the tagline, animated stats (pools created, sBTC pooled, successful pools), a three-step "How It Works" section, four use-case cards (Chamas, Harambees, Bill Splitting, Group Travel), and a bottom CTA.

### Create Pool (`/create`)
A three-step form: **Details** (title, description, emoji icon) → **Settings** (target amount with fiat estimate, recipient address, deadline, optional minimum contribution) → **Review** (summary card with gas estimate and confirmation). A live preview sidebar updates as you fill in the form.

### Pool Detail (`/pool/[id]`)
The most important screen — what contributors see when they open a shared link. Shows a large progress ring with the current amount, a horizontal progress bar, contributor count and days remaining, a contribution form with quick-select amounts, a live countdown timer, the full contributor list, an expandable details section, and a share sidebar with QR code and social buttons. Pool creators also see withdraw and cancel controls.

### Dashboard (`/dashboard`)
Profile header with stats, tabbed between "My Pools" (pools you created) and "Contributions" (pools you contributed to). Shows pool cards in a grid with progress bars, status badges, and quick actions. Empty state with a prompt to create your first pool.

### Explore (`/explore`)
Search by title, filter by status (All, Active, Funded, Ending Soon), sort by newest/most funded/ending soon. Displays public pools in a responsive card grid.

---

## Smart Contract (Phase 2)

The Clarity contract manages the full pool lifecycle:

```
CREATED → ACTIVE → FUNDED → WITHDRAWN (success)
                 ↓
              EXPIRED → REFUNDED (failure)
```

**Public functions:**
- `create-pool` — Set title, target, deadline, and recipient
- `contribute` — Add sBTC to a pool; auto-releases if the target is hit
- `withdraw-funds` — Creator withdraws after the pool is fully funded
- `refund-all` — Refunds all contributors if the deadline passes
- `cancel-pool` — Creator cancels before any contributions

**Read-only functions:**
- `get-pool` — Full pool metadata
- `get-contribution` — Amount contributed by a specific wallet
- `get-pool-count` — Total pools created
- `is-pool-funded` — Whether the target has been reached

The contract will live in `contracts/stackpool.clar` with tests in `tests/stackpool.test.ts` using the Clarinet JS SDK.

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| **Phase 1** | UI prototype with mock data | **In progress** |
| **Phase 2** | Clarity smart contract + Clarinet tests | Upcoming |
| **Phase 3** | Wallet integration + contract wiring | Upcoming |
| **Phase 4** | Mainnet deployment + polish | Upcoming |

---

## Design

- **Dark theme** with Bitcoin orange (`#F7931A`) as the primary accent
- **Inter** for UI text, **JetBrains Mono** for amounts and addresses
- 4px spacing grid, 12px card radius, 8px input radius
- Skeleton shimmer loaders instead of spinners
- Staggered fade-in animations on card grids
- Fully responsive across mobile, tablet, and desktop

---

## Target Users

**Primary:** Chama members across Africa (Kenya, Nigeria, Ghana, Uganda), friend groups splitting expenses, church and community harambee organizers.

**Secondary:** Freelancer collectives sharing tool subscriptions, small business partners splitting startup costs, event organizers collecting contributions.

---

## Roadmap

- Recurring pools for monthly chama rounds
- Pool templates (one-click Chama, Harambee, Bill Split setup)
- Multi-signature release for large pools
- M-Pesa offramp integration via Minisend
- sBTC yield on idle pooled funds via Zest Protocol
- React Native mobile app
- Public pool discovery feed

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## License

MIT

---

*Built on [Stacks](https://www.stacks.co/). Secured by Bitcoin.*
