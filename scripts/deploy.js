
const { ethers } = require("hardhat");

async function main() {

  const AustralianFootballLeagueNFT = await ethers.getContractFactory("NFFT");
  const NFFT = await AustralianFootballLeagueNFT.deploy("Australian Football League NFT", "NFFT",100);
  const accountAddress = '0xA353884673B0971e47e5520a5502E379b237600D'

  await NFFT.deployed();
  console.log("Success! Contract was deployed to: ", NFFT.address);

  await NFFT.mint(accountAddress,"https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/1.json");
  await NFFT.mint(accountAddress,"https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/2.json");
  await NFFT.mint(accountAddress,"https://ipfs.io/ipfs/QmYDzPqUFptMxxQfN5mGvGP2qSdnjiq6SGoyAFWgpATVPx/3.json");

  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
