
const { ethers } = require("hardhat");

async function main() {

  const AustralianFootballLeagueNFT = await ethers.getContractFactory("NFFT");
  const NFFT = await AustralianFootballLeagueNFT.deploy("Australian Football League NFT", "NFFT");

  await NFFT.deployed();
  console.log("Success! Contract was deployed to: ", NFFT.address);

  await NFFT.mint("https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/1.json");
  await NFFT.mint("https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/2.json");
  await NFFT.mint("https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/3.json");
  await NFFT.mint("https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/4.json");
  await NFFT.mint("https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/5.json");

  

  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
