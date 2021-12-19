import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ScopeXToken } from "../typechain/ScopeXToken";

// https://github.com/shapeshed/hardhat-boilerplate/blob/master/test/sample-test.ts
// https://reza-seirafifar.medium.com/a-focus-on-ethereum-erc20s-unit-testing-a66b084100df
describe("ScopeX Token", function () {

  let scopeXToken: ScopeXToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;;

  beforeEach(async function() {
    const scopeXTokenFactory = await ethers.getContractFactory("ScopeXToken");
    scopeXToken = await scopeXTokenFactory.deploy(2000);
    await scopeXToken.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

  });
  
  it("Should successfully deploy", async function () {
    console.log("success!");
  });

  it("Should have correct token attributes", async function() {
    //Verifying the name of the token
    expect(await scopeXToken.name()).to.equal('ScopeX') ;
    //Verifying the symbol of the token
    expect(await scopeXToken.symbol()).to.equal('SCX') ;
    //Verifying the decimals of the token.
    expect(await scopeXToken.decimals()).to.equal(18) ;
 });

  it("Should deploy with 20000 of supply for the owner of the contract", async function() {
    const balance = await scopeXToken.balanceOf(owner.address);
    expect(ethers.utils.formatEther(balance) == "2000");

    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(0) ;

    const initialSupply = await scopeXToken.totalSupply();
    //console.log(initialSupply);
    //expect(initialSupply).to.equal(200000000); should be initialSupply* 10**18
    expect(ethers.utils.formatEther(initialSupply) == "2000");
  });  

  it("Should let you send tokens to another address", async function() {
    await scopeXToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1000"));
  });  

  it("Should transfer successfully and emit Tranfer event", async function() {
    //transfer 1000 SCX from owner to addr1.
    //Verifying the event generated after the transfer execution.
    expect(await scopeXToken.transfer(addr1.address, ethers.utils.parseEther("1000")))
       .to.emit(scopeXToken, "Transfer")
       .withArgs(owner.address, addr1.address, ethers.utils.parseEther("1000"));
    //verifying the balances of owner and addr1 and the total supply after the transfer.
    //let balance = await scopeXToken.balanceOf(addr1.address);
    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1000"));
    expect(await scopeXToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1000")) ;
    expect(await scopeXToken.totalSupply()).to.equal(ethers.utils.parseEther("2000"));
 });

 it("Should not exceeds balance while transferring", async function() {
    //transfer 31 KOL from owner to addr1.
    //Verifying the error message after the transfer execution.
    await expect(scopeXToken.transfer(addr1.address, ethers.utils.parseEther("2001")))
       .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    //Verifying the balances of accounts after a reverted transaction
    expect(await scopeXToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("2000")) ;
    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(0) ;
    expect(await scopeXToken.totalSupply()).to.equal(ethers.utils.parseEther("2000"));
 });

 it("Should let you give another address the approval to send on your behalf", async function() {
    await scopeXToken.connect(addr1).approve(owner.address, ethers.utils.parseEther("1000"));
    await scopeXToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await scopeXToken.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther("1000"));
    expect(await scopeXToken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
  });

});
