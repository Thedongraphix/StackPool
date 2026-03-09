# StackPool — Testnet Deployment

## Contract Details

| Field | Value |
|-------|-------|
| **Network** | Stacks Testnet |
| **Contract ID** | `ST3322670ZG8HJV7B0XBKDZST33Y2KT0YR5GS4X54.stackpool` |
| **Deployer Address** | `ST3322670ZG8HJV7B0XBKDZST33Y2KT0YR5GS4X54` |
| **Clarity Version** | 3.0 |
| **Deploy TX** | `0x3e3e71eb88ea8cfb16e22c4e99e2f1b1d38d1c10b365823e6027e50c5b96954e` |
| **Block Height** | 3,884,099 |
| **Deploy Cost** | ~0.1 STX |

## Explorer Links

- [Contract on Explorer](https://explorer.hiro.so/address/ST3322670ZG8HJV7B0XBKDZST33Y2KT0YR5GS4X54.stackpool?chain=testnet)
- [Deploy Transaction](https://explorer.hiro.so/txid/0x3e3e71eb88ea8cfb16e22c4e99e2f1b1d38d1c10b365823e6027e50c5b96954e?chain=testnet)

## Contract Functions

### Public (Write)

| Function | Description |
|----------|-------------|
| `create-pool` | Create a new pool with title, description, target, recipient, deadline, min-contribution |
| `contribute` | Contribute STX to a pool |
| `withdraw-funds` | Creator withdraws funds after target is met |
| `refund-contributor` | Refund a contributor from an expired pool |
| `finalize-refund` | Mark a fully-refunded pool as complete |
| `cancel-pool` | Creator cancels a pool with zero contributions |

### Read-Only

| Function | Description |
|----------|-------------|
| `get-pool` | Get pool metadata by ID |
| `get-pool-count` | Total number of pools created |
| `get-contribution` | Get a contributor's amount for a pool |
| `is-pool-funded` | Check if a pool has reached its target |
| `get-pool-contributor` | Get contributor address by pool ID and index |

## Environment Variables

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST3322670ZG8HJV7B0XBKDZST33Y2KT0YR5GS4X54
NEXT_PUBLIC_CONTRACT_NAME=stackpool
NEXT_PUBLIC_USE_CONTRACT=true
```

## Verified Transactions

| Operation | TX ID | Result |
|-----------|-------|--------|
| Deploy | `0x3e3e71eb...` | `success` |
| Create Pool | `0x00f07f3f...` | `(ok u0)` |
| Contribute 0.5 STX | `0x02a77f6b...` | `(ok true)` |
