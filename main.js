// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "CCyHW6IYgjHSAsTO5b3DHttFcDcLJqLB",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const main = async () => {
  // Wallet address
  const address = "johnnyclem.eth";

  // Get token balances
  const balances = await alchemy.core.getTokenBalances(address);

  // Remove tokens with zero balance
  const nonZeroBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });

  console.log(`Token balances of ${address} \n`);

  // Counter for SNo of final output
  let i = 1;

  // Loop through all tokens with non-zero balance
  for (let token of nonZeroBalances) {
    // Get balance of token
    let balance = token.tokenBalance;

    // Get metadata of token
    const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

    // Compute token balance in human-readable format
    balance = balance / Math.pow(10, metadata.decimals);
    balance = balance.toFixed(2);

    // Print name, balance, and symbol of token
    console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
  }
};

const nftMain = async () => {
  // Wallet address
  const address = "johnnyclem.eth";

  // Get NFTs
  const nfts = await alchemy.nft.getNftsForOwner(address);

  console.log(`\nNFTs owned by ${address} \n`);

  // Counter for SNo of final output
  let i = 1;

  // Loop through all NFTs
  for (let nft of nfts.ownedNfts) {
    console.log(`${i++}. ${nft.contract.name}: Token ID #${nft.tokenId}`);
  }
};

const checkMAYC = async () => {
  // Wallet address
  const address = "johnnyclem.eth";
  
  // MAYC contract address
  const contractAddress = "0x60e4d786628fea6478f785a6d7e704777c86a7c6";

  try {
    // Use alchemy SDK instead of raw fetch
    const response = await alchemy.nft.verifyNftOwnership(
      address,
      contractAddress
    );
    console.log(`\nIs ${address} a MAYC holder? ${response}`);
  } catch (err) {
    console.error(err);
  }
};

// Replace multiple await calls with single main function
const runMain = async () => {
  try {
    await main();
    await nftMain();
    await checkMAYC();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

