# Safe Transaction Utilities

A collection of command-line utilities for working with Gnosis Safe transactions.

## Available Commands

### 1. Concatenate Signatures (`concat-signatures`)

Combines multiple signatures in `<owner>.<signature>` format into a single concatenated signature string. Signatures are automatically sorted by owner address.

```bash
# Example usage
bun run concat-signatures.ts \
  "0x123...abc.0xsig1..." \
  "0x456...def.0xsig2..." \
  "0x789...ghi.0xsig3..."

# Output
Concatenated signature: 0x[combined signatures sorted by owner address]
```

### 2. Execute Transaction Encoder (`exec-transaction`)

Encodes Safe transaction data for the `execTransaction` function call.

```bash
# Example usage
bun run exec-transaction.ts \
  --to 0x123...abc \
  --data 0x... \
  --signatures 0x[concatenated signatures] \
  --value 1000000000000000000 \
  --operation 0

# Required parameters:
# --to: Destination address
# --data: Transaction data in hex
# --signatures: Concatenated signature bytes

# Optional parameters:
# --value: Transaction value in wei (default: 0)
# --operation: Operation type (0 for Call, 1 for DelegateCall) (default: 0)
```

### 3. Safe Typed Data Generator (`safe-typed-data`)

Generates EIP-712 typed data structure for Safe transaction signing.

```bash
# Example usage
bun run safe-typed-data.ts \
  --safe 0x123...abc \
  --chain-id 1 \
  --to 0x456...def \
  --data 0x... \
  --nonce 42 \
  --value 1000000000000000000 \
  --operation 0

# Required parameters:
# --safe: Safe contract address
# --chain-id: Chain ID
# --to: Destination address
# --data: Transaction data
# --nonce: Transaction nonce

# Optional parameters:
# --value: Transaction value (default: 0)
# --operation: Operation type (default: 0)
```

## Complete Transaction Flow Example

Here's how you might use these utilities together:

1. First, generate the typed data for signing:

```bash
bun run safe-typed-data.ts \
  --safe 0x123...abc \
  --chain-id 1 \
  --to 0x456...def \
  --data 0x... \
  --nonce 42
```

2. After collecting signatures, concatenate them:

```bash
bun run concat-signatures.ts \
  "0xowner1.0xsig1..." \
  "0xowner2.0xsig2..." \
  "0xowner3.0xsig3..."
```

3. Finally, encode the transaction with the concatenated signatures:

```bash
bun run exec-transaction.ts \
  --to 0x456...def \
  --data 0x... \
  --signatures 0x[concatenated signatures from step 2]
```

## Notes

- All addresses should be in hexadecimal format with the "0x" prefix
- Signatures must be in the correct format: "ownerAddress.signature"
- The concatenated signatures will be automatically sorted by owner address
