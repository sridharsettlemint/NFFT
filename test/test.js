const { expect, assert, chai } = require("chai");
const { ethers } = require("hardhat");


describe('ERC721', () => {
  let advancedERC721;
  let adminUser;
  let userOne;
  let userTwo;
  let AustralianFootballLeagueNFT,NFFT; 

  beforeEach(async function () {
    [adminUser, userOne, userTwo] = await ethers.getSigners();
    AustralianFootballLeagueNFT = await ethers.getContractFactory("NFFT");
    NFFT = await AustralianFootballLeagueNFT.deploy("Australian Football League NFT", "NFFT",100);
  
    await NFFT.deployed();    
  });

  it('Has a name', async function () {
    console.log("Success! Contract was deployed to: ", NFFT.address);
    console.log("Owner of the contract: ", adminUser.address);
    const name = await NFFT.name();
    console.log("Name of the NFT: ", name );    
    expect(await NFFT.name()).to.equal('Australian Football League NFT');
  });

  it('Has a symbol', async function () {
    const symbol = await NFFT.symbol();
    console.log("Symbol of the Australian Football League NFT: ", symbol ); 
    expect(await NFFT.symbol()).to.equal('NFFT');
  });

  it('Total Supply', async function () {
    const supply = await NFFT.totalSupply();
    console.log("Total Supply of the Australian Football League NFT: ", supply.toNumber() ); 
    expect(supply).to.equal(100);
  });

  it('Supports interface id', async function () {
    const interfaceId = '0x01ffc9a7';
    expect(await NFFT.supportsInterface(interfaceId)).to.equal(true);
  });


  it('Minting NFT', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    let newTokenId = await NFFT.mint(adminUser.address,metaData);
    //console.log("New Token # : ",newTokenId);
  });

  it('balanceOf Owner after 3 mints', async function () {

    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.mint(adminUser.address,metaData);
    const bal = await NFFT.balanceOf(adminUser.address);
    console.log("balanceOf Owner "+adminUser.address+" is: "+bal.toNumber());
    console.log("total minted : "+ await NFFT.totalMinted());
    //console.log(" New Token # : ",newTokenId.value.toNumber());
    expect(bal).to.equal(3);
  });

  it('ownerOf token # 1', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    const newTokenIdOwner = await NFFT.ownerOf(1);
    console.log("Owner Of token # 1: ",newTokenIdOwner); 
    expect(newTokenIdOwner).to.equal(adminUser.address);
  });

  it('tokenURI token # 1', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    const tokenURI = await NFFT.getTokenURI(1);
    console.log("tokenURI Of token # 1: ",tokenURI); 
    expect(tokenURI).to.equal(metaData);
  });

  it('transfer of token from Admin to UserOne', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.transferFrom(adminUser.address,userOne.address,1);
    const balAdminUser = await NFFT.balanceOf(adminUser.address);
    console.log("balanceOf Owner "+adminUser.address+" is: "+balAdminUser.toNumber());
    const balUserOne = await NFFT.balanceOf(userOne.address);
    console.log("balanceOf Owner "+userOne.address+" is: "+balUserOne.toNumber());
    expect(balUserOne).to.equal(1);
    
  });

  it('transfer of token from Admin to UserOne', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.connect(adminUser).approve(userOne.address,1)
    await NFFT.connect(userOne).transferFrom(adminUser.address,userOne.address,1);  
    const balAdminUser = await NFFT.balanceOf(adminUser.address);
    console.log("balanceOf Owner "+adminUser.address+" is: "+balAdminUser.toNumber());
    const balUserOne = await NFFT.balanceOf(userOne.address);
    console.log("balanceOf Owner "+userOne.address+" is: "+balUserOne.toNumber());
    expect(balAdminUser).to.equal(0);
  });

  it('transfer of token from Admin to UserOne via  proxy accounts(userTwo)', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.connect(adminUser).setApprovalForAll(userTwo.address,true);
    await NFFT.connect(userTwo).transferFrom(adminUser.address,userOne.address,1);  
    const balAdminUser = await NFFT.balanceOf(adminUser.address);
    console.log("balanceOf Owner "+adminUser.address+" is: "+balAdminUser.toNumber());
    const balUserOne = await NFFT.balanceOf(userOne.address);
    console.log("balanceOf Owner "+userOne.address+" is: "+balUserOne.toNumber());
    expect(balAdminUser).to.equal(0);
  });

  it('Burn token ', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.burnToken(1);
    const balAdminUser = await NFFT.balanceOf(adminUser.address);
    console.log("balanceOf Owner "+adminUser.address+" after burnToken is: "+balAdminUser.toNumber());
    expect(balAdminUser).to.equal(0);
  });

  it('Reward points Of account holder after NFT mint', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    const rewardPoints = await NFFT.getRewardPoints(adminUser.address);

    console.log("rewardPoints Of Owner "+adminUser.address+" after minting: "+rewardPoints);
    expect(rewardPoints).to.equal(100);
  });

  it('Add reward points to account holder', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.addRewardPoints(adminUser.address,150);

    const rewardPoints = await NFFT.getRewardPoints(adminUser.address);

    console.log("rewardPoints Of Owner "+adminUser.address+" after adding : "+rewardPoints);
    expect(rewardPoints).to.equal(250);
  });

  it('Reduce reward points to account holder', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.reduceRewardPoints(adminUser.address,50);

    const rewardPoints = await NFFT.getRewardPoints(adminUser.address);

    console.log("rewardPoints Of Owner "+adminUser.address+" after reducing: "+rewardPoints);
    expect(rewardPoints).to.equal(50);
  });

  it('Burn reward points of account holder', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.burnRewardPoints(adminUser.address);

    const rewardPoints = await NFFT.getRewardPoints(adminUser.address);

    console.log("rewardPoints Of Owner "+adminUser.address+" after burn: "+rewardPoints);
    expect(rewardPoints).to.equal(0);
  });



/*   it('transfer of token from UserOne to Admin (Should throw an error):', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
    await NFFT.connect(userOne).transferFrom(adminUser.address,userOne.address,1);  
  }); */

/*   it('Pause and Mint (Should throw an error):', async function () {
    //await NFFT.connect(userOne).pause(); // only Owner
    await NFFT.pause();
    //await NFFT.unpause();
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.mint(adminUser.address,metaData);
  }); */

/*   it('Mint with other than admin (Should throw an error):', async function () {
    const metaData = 'https://ipfs.io/ipfs/QmPaH5VdPRiGvCwaUCVG97wq38LK7Kn2QKtdHCds2cTooL/1.json';
    await NFFT.connect(userOne).mint(userOne.address,metaData);
  }); */


});