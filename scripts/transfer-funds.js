/**
 * Transfer funds from operator wallet to Gnosis Safe
 *
 * Usage:
 *   node scripts/transfer-funds.js [options]
 *
 * Options:
 *   --amount <amount>      Amount to transfer (default: all balance)
 *   --token <address>      Token address (default: native MATIC)
 *   --dry-run              Simulate without executing
 *
 * Environment variables:
 *   OPERATOR_PRIVATE_KEY   Private key of operator wallet
 *   GNOSIS_SAFE_ADDRESS    Gnosis Safe address
 *   RPC_URL                Polygon RPC endpoint
 */

require('dotenv').config({ path: '.env' });
const { ethers } = require('ethers');

// ABI for ERC20 token transfer
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function transferNative(provider, wallet, toAddress, amount) {
  console.log('\n=== Native Token (MATIC) Transfer ===');
  const balance = await provider.getBalance(wallet.address);
  console.log(`Current balance: ${ethers.formatEther(balance)} MATIC`);

  if (amount === null) {
    amount = balance;
  }

  // Estimate gas
  const gasPrice = await provider.getFeeData();
  const estimatedGas = await wallet.estimateGas({
    to: toAddress,
    value: amount
  });
  const gasCost = estimatedGas * gasPrice.gasPrice;

  console.log(`Transfer amount: ${ethers.formatEther(amount)} MATIC`);
  console.log(`Estimated gas cost: ${ethers.formatEther(gasCost)} MATIC`);
  console.log(`Total: ${ethers.formatEther(amount.add(gasCost))} MATIC`);

  if (amount.add(gasCost) > balance) {
    throw new Error('Insufficient balance including gas fees');
  }

  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: amount
  });

  console.log(`\nTransaction sent: ${tx.hash}`);
  console.log('Waiting for confirmation...');

  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  return tx.hash;
}

async function transferERC20(provider, wallet, toAddress, tokenAddress, amount) {
  console.log('\n=== ERC20 Token Transfer ===');
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  const balance = await tokenContract.balanceOf(wallet.address);
  const decimals = await tokenContract.decimals();
  const symbol = await tokenContract.symbol();

  console.log(`Token: ${symbol}`);
  console.log(`Current balance: ${ethers.formatUnits(balance, decimals)} ${symbol}`);

  if (amount === null) {
    amount = balance;
  }

  console.log(`Transfer amount: ${ethers.formatUnits(amount, decimals)} ${symbol}`);

  const tx = await tokenContract.transfer(toAddress, amount);
  console.log(`\nTransaction sent: ${tx.hash}`);
  console.log('Waiting for confirmation...');

  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  return tx.hash;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    amount: null,
    token: null,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--amount' && args[i + 1]) {
      options.amount = ethers.parseEther(args[i + 1]);
      i++;
    } else if (args[i] === '--token' && args[i + 1]) {
      options.token = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--help') {
      console.log(`
Usage: node scripts/transfer-funds.js [options]

Options:
  --amount <amount>      Amount to transfer in MATIC (default: all balance)
  --token <address>      ERC20 token address (default: native MATIC)
  --dry-run              Simulate without executing

Environment variables:
  OPERATOR_PRIVATE_KEY   Private key of operator wallet (required)
  GNOSIS_SAFE_ADDRESS    Gnosis Safe address (required)
  RPC_URL                Polygon RPC endpoint (required)

Example:
  # Transfer all MATIC balance
  node scripts/transfer-funds.js

  # Transfer specific amount
  node scripts/transfer-funds.js --amount 100

  # Transfer ERC20 token
  node scripts/transfer-funds.js --token 0x1234...abcd

  # Dry run simulation
  node scripts/transfer-funds.js --dry-run
      `);
      process.exit(0);
    }
  }

  return options;
}

async function main() {
  console.log('=== Gnosis Safe Fund Transfer Script ===\n');

  // Parse command line arguments
  const options = parseArgs();

  // Validate environment variables
  const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY;
  const gnosisSafeAddress = process.env.GNOSIS_SAFE_ADDRESS;
  const rpcUrl = process.env.RPC_URL;

  if (!operatorPrivateKey) {
    throw new Error('OPERATOR_PRIVATE_KEY environment variable is required');
  }
  if (!gnosisSafeAddress) {
    throw new Error('GNOSIS_SAFE_ADDRESS environment variable is required');
  }
  if (!rpcUrl) {
    throw new Error('RPC_URL environment variable is required');
  }

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(operatorPrivateKey, provider);

  console.log(`Operator wallet: ${wallet.address}`);
  console.log(`Gnosis Safe: ${gnosisSafeAddress}`);

  if (!ethers.isAddress(gnosisSafeAddress)) {
    throw new Error('Invalid GNOSIS_SAFE_ADDRESS');
  }

  // Dry run check
  if (options.dryRun) {
    console.log('\n[DRY RUN MODE] No transactions will be executed\n');
  }

  try {
    let txHash;

    if (options.token) {
      txHash = await transferERC20(
        provider,
        wallet,
        gnosisSafeAddress,
        options.token,
        options.amount
      );
    } else {
      txHash = await transferNative(
        provider,
        wallet,
        gnosisSafeAddress,
        options.amount
      );
    }

    console.log(`\n✅ Transfer completed: ${txHash}`);
  } catch (error) {
    console.error(`\n❌ Transfer failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { transferNative, transferERC20 };
