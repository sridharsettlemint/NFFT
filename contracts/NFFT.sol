//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFFT is ERC721URIStorage, Pausable, Ownable {
            using Counters for Counters.Counter;
            Counters.Counter private _tokenIds;

            mapping(address => uint256) private _rewardPoints;
            uint256 public totalSupply;
            uint256 public totalMinted;


        constructor(string memory _name, string memory _symbol, uint256 _totalSupply) 
        ERC721(_name, _symbol) {
            totalSupply =  _totalSupply;
        }

        function pause() public onlyOwner {
            _pause();
        }

        function unpause() public onlyOwner {
            _unpause();
        }

        function mint(address to,string memory tokenURI)   public onlyOwner whenNotPaused  returns (uint256){
                require(totalSupply > totalMinted,"Maximum supply already reached");
            _tokenIds.increment();

            uint256 newItemId = _tokenIds.current();
            _safeMint(to, newItemId);
            _setTokenURI(newItemId, tokenURI);
            _rewardPoints[to] = 100; // intial bonus pruchase points from Australian Football League
            totalMinted +=1;

            return newItemId;
        }

        function getTokenURI(uint256 tokenId) public view returns (string memory) {
            return tokenURI(tokenId);
        }

        function balanceOf(address owner) public view override returns(uint256) {
            return super.balanceOf(owner);
        }

        function ownerOf(uint256 tokenId) public view override returns(address) {
            return super.ownerOf(tokenId);
        }

        function setApprovalForAll(address operator, bool approved) public override whenNotPaused{
            super.setApprovalForAll(operator, approved);
        }

        function isApprovedForAll(address owner, address operator) public view override whenNotPaused returns(bool) {
            return super.isApprovedForAll(owner,operator);
        }

        function approve(address to, uint256 tokenId) public virtual override whenNotPaused{
            super.approve(to,tokenId);
        }

        function getApproved(uint256 tokenId) public view override whenNotPaused returns(address) {
            return super.getApproved(tokenId);
        }

        function transferFrom(address from,address to,uint256 tokenId) public override whenNotPaused {
            safeTransferFrom(from, to, tokenId);
        }

        function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
            return super.supportsInterface(interfaceId);
        }

        function burnToken(uint256 tokenId) public whenNotPaused{
            _burn(tokenId);
        }

        // to add reward points to account holder after the match
        function addRewardPoints(address to, uint256 points) public onlyOwner whenNotPaused{
            _rewardPoints[to] += points;
        }

        // to reduce reward points to account holder after the match
        function reduceRewardPoints(address to, uint256 points) public onlyOwner whenNotPaused{
            _rewardPoints[to] -= points;
        }
        
        // to get reward points of account holder 
        function getRewardPoints(address to) public view whenNotPaused returns(uint256){
            return _rewardPoints[to];
        }

         // to burn reward points of account holder
        function burnRewardPoints(address to) public onlyOwner whenNotPaused {
            _rewardPoints[to] = 0;
        }

}