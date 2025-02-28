import { encodeFunctionData } from "viem";
import { Command } from "commander";

const program = new Command();

interface CommandOptions {
  to: string;
  value: string;
  data: string;
  operation: string;
  signatures: string;
}

program
  .name("safe-tx-encoder")
  .description("Encode Safe transaction data")
  .requiredOption("--to <address>", "Destination address")
  .requiredOption("--data <bytes>", "Transaction data in hex")
  .requiredOption("--signatures <bytes>", "Signature bytes")
  .option("--value <amount>", "Transaction value in wei", "0")
  .option(
    "--operation <number>",
    "Operation type (0 for Call, 1 for DelegateCall)",
    "0",
  );

const execTransactionAbi = {
  inputs: [
    {
      internalType: "address",
      name: "to",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "value",
      type: "uint256",
    },
    {
      internalType: "bytes",
      name: "data",
      type: "bytes",
    },
    {
      internalType: "enum Enum.Operation",
      name: "operation",
      type: "uint8",
    },
    {
      internalType: "uint256",
      name: "safeTxGas",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "baseGas",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "gasPrice",
      type: "uint256",
    },
    {
      internalType: "address",
      name: "gasToken",
      type: "address",
    },
    {
      internalType: "address payable",
      name: "refundReceiver",
      type: "address",
    },
    {
      internalType: "bytes",
      name: "signatures",
      type: "bytes",
    },
  ],
  name: "execTransaction",
  outputs: [
    {
      internalType: "bool",
      name: "",
      type: "bool",
    },
  ],
  stateMutability: "payable",
  type: "function",
} as const;

program.parse(process.argv);
const options = program.opts<CommandOptions>();
console.log(options);
// Default values for other parameters
const DEFAULT_SAFE_TX_GAS = 0n; // 0 for estimation
const DEFAULT_BASE_GAS = 0n;
const DEFAULT_GAS_PRICE = 0n;
const DEFAULT_GAS_TOKEN = "0x0000000000000000000000000000000000000000";
const DEFAULT_REFUND_RECEIVER = "0x0000000000000000000000000000000000000000";

try {
  console.log([
    options.to, // to address
    BigInt(options.value), // value
    options.data as `0x${string}`, // data
    Number(options.operation), // operation
    DEFAULT_SAFE_TX_GAS, // safeTxGas
    DEFAULT_BASE_GAS, // baseGas
    DEFAULT_GAS_PRICE, // gasPrice
    DEFAULT_GAS_TOKEN, // gasToken
    DEFAULT_REFUND_RECEIVER, // refundReceiver
    options.signatures as `0x${string}`, // signatures
  ]);
  const encodedData = encodeFunctionData({
    abi: [execTransactionAbi],
    functionName: "execTransaction",
    args: [
      options.to as `0x${string}`, // to address
      BigInt(options.value), // value
      options.data as `0x${string}`, // data
      Number(options.operation), // operation
      DEFAULT_SAFE_TX_GAS, // safeTxGas
      DEFAULT_BASE_GAS, // baseGas
      DEFAULT_GAS_PRICE, // gasPrice
      DEFAULT_GAS_TOKEN, // gasToken
      DEFAULT_REFUND_RECEIVER, // refundReceiver
      options.signatures as `0x${string}`, // signatures
    ],
  });

  console.log("Encoded transaction data:", encodedData);
} catch (error) {
  console.error("Error encoding transaction data:", error);
  process.exit(1);
}
