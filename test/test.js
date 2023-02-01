const{expect}=require("chai");
const { BigNumber, utils } = require("ethers");
describe("Royality Contract",function(){
    let TestContract;
    let contract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function(){
        TestContract=await ethers.getContractFactory("Royality");
        [owner,addr1,addr2]=await ethers.getSigners();
        contract=await TestContract.deploy();
    });
    describe("Test contract", function () {
        
        it("should return true for supported interface ERC721", async () => {
          let result = await contract.supportsInterface("0x80ac58cd");
          expect(result).to.be.true;
        });
      
        it("should return true for supported interface ERC2981", async () => {
          let result = await contract.supportsInterface("0x2a55205a");
          expect(result).to.be.true;
        });
      
        it("should mint NFT", async () => {
          await contract.connect(owner).mintNFT(addr1.address, "tokenURI");
          const result = await contract.royaltyInfo(1, 100);
          expect(result[0]).to.equal(owner.address);
          expect(result[1]).to.equal(1);
        });
      
        it("should mint NFT with royalty", async () => {
          await contract.connect(owner).mintNFTWithRoyalty(addr1.address, "tokenURI", owner.address, 200);
          const result = await contract.royaltyInfo(1, 100);
          expect(result[0]).to.equal(owner.address);
          expect(result[1]).to.equal(2);
        });
      
        // it("should burn NFT", async () => {
        //   await contract.connect(owner).mintNFT(addr1.address, "tokenURI");
        //   await contract.connect(owner).burnNFT(1);
        //   let owner1 = await contract.ownerOf(1);
        //   expect(owner1).to.equal("0x0000000000000000000000000000000000000000");
        // });
      
        it("should fail to mint NFT by non-owner", async () => {
          await expect( contract.connect(addr1).mintNFT(addr1.address, "tokenURI")).to.revertedWith('Ownable: caller is not the owner');
        });
      
        it("should fail to burn NFT by non-owner", async () => {
          await contract.connect(owner).mintNFT(addr1.address, "tokenURI");
          await expect(contract.connect(addr1).burnNFT(1)).to.revertedWith('Ownable: caller is not the owner');
        });
    })
})



