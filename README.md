# Lightombo Frontend

Developer tools and transaction stream service for the Movement ecosystem.

## Features

- Wallet connection with Petra, Razor, and other Move-compatible wallets
- Transaction stream dashboard with real-time event decoding
- DEX swap detection, transfers, mints, and burns
- Contract address filtering for event streams
- 0.1 MOVE token subscription payment (persisted per wallet)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Start the backend (in a separate terminal):

```bash
cd ../solomove && cargo run
```

Open http://localhost:3000 with your browser.

## Pages

- `/` - Landing page
- `/login` - Connect wallet
- `/dashboard` - Event stream dashboard (requires wallet connection and payment)

## Configuration

Payment address is hardcoded to: `0x2196a365aee43fff15be60561625bc1c5d2d8e821294e1264c6c0b86f0dbdd74`

To change the backend URL, set `NEXT_PUBLIC_BACKEND_URL` environment variable.
