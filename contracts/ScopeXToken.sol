// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2; 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol"; 

contract ScopeXToken is ERC20, ERC20Burnable, Pausable, AccessControl {

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private immutable _cap;

    constructor(uint256 initialSupply_) ERC20("ScopeX Token", "SXT") {
        require(initialSupply_ > 0, "ScopeXToken: initialSupply is 0");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _grantRole(PAUSER_ROLE, msg.sender);

        _mint(msg.sender, initialSupply_ * 10 ** decimals());

        _grantRole(MINTER_ROLE, msg.sender);

        _cap = initialSupply_ * 10 * 10 ** decimals();

    } 

    function pause() public onlyRole(PAUSER_ROLE) {

        _pause();

    } 

    function unpause() public onlyRole(PAUSER_ROLE) {

        _unpause();

    } 

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev See {ERC20-_mint}.
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(ERC20.totalSupply() + amount <= cap(), "ScopeXToken: cap exceeded");
        _mint(to, amount);

    } 

    function _beforeTokenTransfer(address from, address to, uint256 amount)

        internal

        whenNotPaused

        override

    {

        super._beforeTokenTransfer(from, to, amount);

    }

}