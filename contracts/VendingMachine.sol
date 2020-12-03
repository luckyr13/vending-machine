// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract VendingMachine is Ownable
{
	using SafeMath for uint256;
	uint256 public birthdate;
	bytes32 public name;
	bool private active;

	struct Product {
		bytes32 name;
		bytes32 description;
		bytes32 image;
		uint256 price;
		uint256 quantity;
		bool active;
	}

	struct Sale {
		address customer;
		uint256 productId;
		uint256 quantity;
		uint256 price;
		uint256 date;
	}

	struct CustomerSalesHistory {
		uint256 totalSales;
		uint256 totalRevenue;
	}

	mapping (uint256 => Product) public products;
	uint256 public totalProducts;
	mapping (uint256 => Sale) public sales;
	uint256 public totalSales;
	mapping (address => CustomerSalesHistory) public customersSalesHistory;
	address public topClient;

	/*
	*	Product must be active
	*/
	modifier isActiveProduct(uint256 _productId) {
		require(products[_productId].active, 'Product is inactive');
		_;
	}

	/*
	*	Contract must be active in order to work :)
	*/
	modifier contractMustBeActive() {
		require(active, 'Contract is inactive');
		_;
	}

	event Received(address _customer, uint256 _quantity);
	event NewProduct(uint256 _productId, bytes32 _name);
	event NewSale(address _customer, uint256 _productId, uint256 _quantity);
	
	/*
	*	Set vending machine basic data
	*/
	constructor(bytes32 _name) {
		birthdate = block.timestamp;
		name = _name;
		active = true;
	}

	/*
	* Activate/Deactivate contract functionality
	*/
	function activateDeactivateContract(bool _active) external onlyOwner {
		active = _active;
	}


	/*
	* Send any remaining funds in contract to owner
	*/
	function transferRemainingFunds(uint256 _weiUnits) external payable onlyOwner {
		address payable beneficiary = payable(owner());
		(bool success, ) = beneficiary.call{value: _weiUnits}('');
		require(success, 'Transfer error :(');
	}

	/*
	* Get contract's balance
	*/
	function getContractBalance() external view returns(uint256) {
		return address(this).balance;
	}

	/*
	* Fallback function
	*/
	receive() external payable contractMustBeActive {
		emit Received(msg.sender, msg.value);
	}

	/*
	* Return list of active products
	*/
	function getActiveProducts() 
		external view contractMustBeActive
		returns(uint256[] memory)
	{
		uint256[] memory prods = new uint256[](totalProducts);
		uint256 counter = 0;

		for (uint256 i = 1; i <= totalProducts; i = i.add(1)) {
			if (products[i].active && counter < totalProducts) {
				prods[counter] = i;
				counter = counter.add(1);
			}
		}

		return prods;
	}

	/*
	*	Add new product to contract's products list
	*/
	function addProduct(
		bytes32 _name,
		bytes32 _description,
		bytes32 _image,
		uint256 _quantity,
		uint256 _price
	)
		external 
		onlyOwner contractMustBeActive
		returns (uint256)
	{
		require(
			keccak256(abi.encode(_name)) != keccak256(abi.encode('')),
			'Name must be defined'
		);
		// Increase total products
		totalProducts = totalProducts.add(1);

		// First id must be one :)
		uint256 productId = totalProducts;
		products[productId] = Product(
			_name,
			_description,
			_image,
			_price,
			_quantity,
			true
		);
		emit NewProduct(productId, _name);
		return productId;
	}

	/*
	*	Update product info
	*/
	function updateProduct(
		uint256 _productId,
		bytes32 _name,
		bytes32 _description,
		bytes32 _image,
		uint256 _price
	)
		external
		onlyOwner contractMustBeActive
	{
		require(
			keccak256(abi.encode(products[_productId].name)) != keccak256(abi.encode('')),
			'Product does not exist'
		);
		require(
			keccak256(abi.encode(_name)) != keccak256(abi.encode('')),
			'Name must be defined'
		);
		products[_productId].name = _name;
		products[_productId].description = _description;
		products[_productId].image = _image;
		products[_productId].price = _price;
	}

	/*
	*	Activate/deactive product
	*	Only activated products are selled
	*/
	function activateDeactivateProduct(
		uint256 _productId,
		bool _active
	)
		external
		onlyOwner contractMustBeActive
	{
		products[_productId].active = _active;
	}

	/*
	*	Add stock to a product
	*/
	function addStock(
		uint256 _productId,
		uint256 _quantity
	) 
		external 
		onlyOwner contractMustBeActive
		isActiveProduct(_productId)
		returns (uint256)
	{
		products[_productId].quantity = products[_productId].quantity.add(
			_quantity
		);

		return products[_productId].quantity;
	}

	/*
	*	Remove stock from a product
	*/
	function removeStock(
		uint256 _productId,
		uint256 _quantity
	) 
		external 
		onlyOwner contractMustBeActive
		isActiveProduct(_productId)
		returns (uint256)
	{
		products[_productId].quantity = products[_productId].quantity.sub(
			_quantity
		);

		return products[_productId].quantity;
	}

	/*
	*	Save sales info history in contract's storage
	*/
	function _addSale(
		address _customer,
		uint256 _productId,
		uint256 _quantity,
		uint256 _price
	) 
		contractMustBeActive
		private 
	{

		totalSales++;
		sales[totalSales] = Sale(_customer, _productId, _quantity, _price, block.timestamp);
		customersSalesHistory[_customer].totalSales = customersSalesHistory[_customer].totalSales.add(1);
		customersSalesHistory[_customer].totalRevenue = customersSalesHistory[_customer].totalRevenue.add(
			_quantity.mul(_price)
		);
		
		emit NewSale(_customer, _productId, _quantity);
	}

	/*
	*	Set customer as new top client if he's total revenue
	* is greater than current top client
	*/
	function _setNewTopClient(address _customer) 
		private contractMustBeActive
	{
		if (customersSalesHistory[_customer].totalRevenue 
			  > customersSalesHistory[topClient].totalRevenue) {
			topClient = _customer;
		}
	}

	/*
	*	Buy a product from machine
	*/
	function buyProduct(uint256 _productId, uint256 _quantity) 
		external
		payable
		isActiveProduct(_productId) contractMustBeActive
	{
		require(products[_productId].quantity.sub(_quantity) >= 0, 'Not enough stock');
		require(
			msg.value == (_quantity.mul(products[_productId].price)),
			"You must send the exact amount of ether needed to buy this product"
		);
		// Remove _quantity from inventory
		products[_productId].quantity = products[_productId].quantity.sub(
			_quantity
		);
		// Save the sale info
		_addSale(msg.sender, _productId, _quantity, products[_productId].price);
		// Set new top client 
		_setNewTopClient(msg.sender);
		// Send payment to owner
		address payable beneficiary = payable(owner());
		(bool success, ) = beneficiary.call{value: msg.value}("");
		require(success, "Transfer error!!");

	}

	

	/*
	*	Get machine's age in seconds
	*/
	function getMachineAgeInSeconds() 
		external view 
		contractMustBeActive 
		returns(uint256) 
	{
		uint256 timeInSeconds = block.timestamp;
		return timeInSeconds.sub(birthdate).div(1 seconds);
	} 
	
	/*
	*	Get the list of the last _max customers
	*/
	function getLastCustomers(uint256 _max) 
		external view 
		contractMustBeActive
		returns(address[] memory)
	{
		if (totalSales < _max) {
			_max = totalSales;
		}
		address[] memory lastCustomers = new address[](_max);

		for (uint256 i = 1; i <= _max; i = i.add(1)) {
			Sale memory s = sales[i];
			lastCustomers[i.sub(1)] = s.customer;
		}

		return lastCustomers;
	}

	/*
	*	Get client's sales history
	*/
	function getSalesHistory(address _customer) 
		external view 
		contractMustBeActive
		returns(uint256[] memory) 
	{
		uint256 totalClientSales = customersSalesHistory[_customer].totalSales;
		uint256[] memory clientSales = new uint[](totalClientSales);
		uint256 counter = 0;

		for (uint256 i = 1; i <= totalSales; i = i.add(1)) {
			if (sales[i].customer == _customer && counter < totalClientSales) {
				clientSales[counter] = i;
				counter = counter.add(1);
			}
		}

		return clientSales;
	}

	/*
	*	Get products bought by the customer
	*/
	function getSalesHistoryByProducts(address _customer) 
		external view 
		contractMustBeActive
		returns(uint256[] memory) 
	{
		uint256 totalClientSales = customersSalesHistory[_customer].totalSales;
		uint256[] memory clientProducts = new uint[](totalClientSales);
		uint256 counter = 0;

		for (uint256 i = 1; i <= totalSales; i = i.add(1)) {
			if (sales[i].customer == _customer && counter < totalClientSales) {
				clientProducts[counter] = sales[i].productId;
				counter = counter.add(1);
			}
		}

		return clientProducts;
	}

}