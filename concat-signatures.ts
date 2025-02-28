import { Command } from "commander";
import { program } from "commander";

interface SignatureEntry {
  owner: string;
  signature: string;
}

program
  .name("signature-parser")
  .description("CLI to parse owner.signature format strings")
  .version("1.0.0")
  .argument("[signatures...]", "List of signatures in owner.signature format")
  .action((signatures: string[]) => {
    try {
      const parsedSignatures = parseSignatures(signatures);
      const sortedSignatures = sortByHexOwner(parsedSignatures);
      const concatenatedSignature =
        "0x" +
        sortedSignatures
          .map((entry) => entry.signature.replace("0x", ""))
          .reduce((acc, curr) => acc + curr, "");

      console.log("Concatenated signature:", concatenatedSignature);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        process.exit(1);
      }
    }
  });

function isValidHexAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function parseSignatures(signatures: string[]): SignatureEntry[] {
  return signatures.map((sig, index) => {
    const parts = sig.split(".");
    if (parts.length !== 2) {
      throw new Error(`Invalid signature format at position ${index}: ${sig}`);
    }

    const [owner, signature] = parts;
    if (!owner || !signature) {
      throw new Error(
        `Missing owner or signature at position ${index}: ${sig}`,
      );
    }

    if (!isValidHexAddress(owner)) {
      throw new Error(
        `Invalid hex address format at position ${index}: ${owner}`,
      );
    }

    return {
      owner,
      signature,
    };
  });
}

function sortByHexOwner(signatures: SignatureEntry[]): SignatureEntry[] {
  return [...signatures].sort((a, b) => {
    // Remove '0x' prefix and convert to BigInt for proper numeric comparison
    const aBigInt = BigInt(a.owner);
    const bBigInt = BigInt(b.owner);

    if (aBigInt < bBigInt) return -1;
    if (aBigInt > bBigInt) return 1;
    return 0;
  });
}

program.parse();
