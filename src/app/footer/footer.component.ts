import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	ethereumAddress: string = '0x64A7226d0D6a527f8982F6efB00d44A297da1b0e';
	
  constructor() { }

  ngOnInit(): void {
  }

}
