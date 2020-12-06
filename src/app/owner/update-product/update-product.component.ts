import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendingMachineService } from './../../contracts/vending-machine.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-owner-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {
		loading: boolean = false;
	productForm: FormGroup = new FormGroup({
		id: new FormControl('', [ Validators.required ]),
		name: new FormControl('', [ Validators.required ]),
		description: new FormControl('', [ Validators.required ]),
		image: new FormControl('', [ Validators.required ]),
		price: new FormControl('', [ Validators.required ]),
		
	});

	get id() {
		return this.productForm.get('id');
	}

	get name() {
		return this.productForm.get('name');
	}

	get description() {
		return this.productForm.get('description');
	}

	get image() {
		return this.productForm.get('image');
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
  	const id = parseInt(this.id.value);
  	const price = parseInt(this.price.value);

		console.log(name, description, image, id, price);
		this.loading = true;

		try {
			this.vendingMachine.updateProduct(
	  		id,
		    name,
		    description,
		    image,
		    price
		  ).on('confirmation', (confirmationNumber, receipt) => {
		  	this.snackBar.open(
					`Transaction confirmed! ${JSON.stringify(confirmationNumber)}`,
					'X',
					{duration: 3000}
				);
				
				alert('confirmation!')
		  }).on('receipt', (receipt) => {
		  	
		  	this.snackBar.open(
					`Transaction created: ${JSON.stringify(receipt)}`,
					'X',
					{duration: 3000}
				);
				this.productForm.reset();
				this.loading = false;
				
		  }).on('error', (reason) => {
		  	this.snackBar.open(
					`Error updating product: ${JSON.stringify(reason)}`,
					'X',
					{duration: 3000}
				);
				this.productForm.reset();
				this.loading = false;
		  });
		} catch (err) {
			this.snackBar.open(
				`ErrorSubmit: ${JSON.stringify(err)}`,
				'X',
				{duration: 3000}
			);
			this.productForm.reset();
			this.loading = false;
		}
  	
	  
  }

}
