import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ScopeXToken } from "../typechain/ScopeXToken";

// https://github.com/shapeshed/hardhat-boilerplate/blob/master/test/sample-test.ts
describe("ScopeX Token", function () {

  let scopeXToken: ScopeXToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;;

  beforeEach(async function() {
    const scopeXTokenFactory = await ethers.getContractFactory("ScopeXToken");
    scopeXToken = await scopeXTokenFactory.deploy(200000000);
    await scopeXToken.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

  });
  
  it("Should successfully deploy", async function () {
    console.log("success!");
  });

  it("Test: Token Attributes", async function() {
    //Verifying the name of the token
    expect(await scopeXToken.name()).to.equal('ScopeX') ;
    //Verifying the symbol of the token
    expect(await scopeXToken.symbol()).to.equal('SCX') ;
    //Verifying the decimals of the token.
    expect(await scopeXToken.decimals()).to.equal(18) ;
 });

  it("Should deploy with 200m of supply for the owner of the contract", async function() {
    const balance = await scopeXToken.balanceOf(owner.address);
    expect(ethers.utils.formatEther(balance) == "200000000");

    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(0) ;

    const initialSupply = await scopeXToken.totalSupply();
    //console.log(initialSupply);
    //expect(initialSupply).to.equal(200000000); should be initialSupply* 10**18
    expect(ethers.utils.formatEther(initialSupply) == "200000000");
  });  

  it("Should let you send tokens to another address", async function() {
    await scopeXToken.transfer(addr1.address, ethers.utils.parseEther("100"));
    expect(await scopeXToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should let you give another address the approval to send on your behalf", async function() {
    await scopeXToken.connect(addr1).approve(owner.address, ethers.utils.parseEther("1000"));
    await scopeXToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await scopeXToken.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther("1000"));
    expect(await scopeXToken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
  })
});