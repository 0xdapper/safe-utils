import { Command } from "commander";

interface CliOptions {
  safe: string;
  chainId: string;
  to: string;
  data: string;
  value: string;
  operation: string;
  nonce: string;
}

const program = new Command();

program
  .name("your-cli-name")
  .description("CLI description here")
  .version("1.0.0")
  .requiredOption("--safe <address>", "Safe contract address")
  .requiredOption("--chain-id <id>", "Chain ID")
  .requiredOption("--to <address>", "Destination address")
  .requiredOption("--data <data>", "Transaction data")
  .requiredOption("--nonce <nonce>", "Transaction nonce")
  .option("--value <amount>", "Transaction value", "0")
  .option("--operation <type>", "Operation type", "0");

program.parse();

const options = program.opts<CliOptions>();

// Access the options
// console.log("Options:", {
//   safe: options.safe,
//   chainId: options.chainId,
//   to: options.to,
//   data: options.data,
//   value: options.value,
//   operation: options.operation,
// });

const safeTransactionData = {
  types: {
    SafeTx: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "operation", type: "uint8" },
      { name: "safeTxGas", type: "uint256" },
      { name: "baseGas", type: "uint256" },
      { name: "gasPrice", type: "uint256" },
      { name: "gasToken", type: "address" },
      { name: "refundReceiver", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
    EIP712Domain: [
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
  },
  domain: {
    chainId: options.chainId,
    verifyingContract: options.safe,
  },
  primaryType: "SafeTx",
  message: {
    to: options.to,
    value: options.value,
    data: options.data,
    operation: options.operation,
    safeTxGas: "0",
    baseGas: "0",
    gasPrice: "0",
    gasToken: "0x0000000000000000000000000000000000000000",
    refundReceiver: "0x0000000000000000000000000000000000000000",
    nonce: options.nonce, // You might want to make this configurable or fetch it from somewhere
  },
};

console.log(safeTransactionData);
