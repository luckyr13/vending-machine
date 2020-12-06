import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendingMachineService } from './../../contracts/vending-machine.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-owner-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
	loading: boolean = false;
	productForm: FormGroup = new FormGroup({
		name: new FormControl('', [ Validators.required ]),
		description: new FormControl('', [ Validators.required ]),
		image: new FormControl('', [ Validators.required ]),
		quantity: new FormControl('', [ Validators.required ]),
		price: new FormControl('', [ Validators.required ]),
		
	});

	get name() {
		return this.productForm.get('name');
	}

	get description() {
		return this.productForm.get('description');
	}

	get image() {
		return this.productForm.get('image');
	}

	get quantity() {
		return this.productForm.get('quantity');
	}

	get price() {
		return this.productForm.get('price');
	}

  constructor(
  	private vendingMachine: VendingMachineService,
  	private snackBar: MatSnackBar,
  	private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
  	const name = this.auth.web3.utils.padRight(
  		this.auth.web3.utils.utf8ToHex(
  			String.prototype.trim.call(this.name.value)
  		),
  		64
  	);
  	const description = this.auth.web3.utils.padRight(
  		this.auth.web3.utils.utf8ToHex(
  			String.prototype.trim.call(this.description.value)
  		),
  		64
  	);
  	const image = this.auth.web3.utils.padRight(
  		this.auth.web3.utils.utf8ToHex(
  			String.prototype.trim.call(this.image.value)
  		),
  		64
  	);
  	const quantity = parseInt(this.quantity.value);
  	const price = parseInt(this.price.value);

		// console.log(name, description, image, quantity, price);
		this.loading = true;

  	this.vendingMachine.createProduct(
	    name,
	    description,
	    image,
	    quantity,
	    price
	  ).then((productId) => {
	  	this.snackBar.open(
				`Transaction created: ${JSON.stringify(productId)}`,
				'X',
				{duration: 3000}
			);
			this.productForm.reset();
			this.loading = false;
	  }).catch((reason) => {
	  	this.snackBar.open(
				`Error creating product: ${JSON.stringify(reason)}`,
				'X',
				{duration: 3000}
			);
			this.productForm.reset();
			this.loading = false;
	  });
  }

}
