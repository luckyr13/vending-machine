import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { OwnerRoutingModule } from './owner-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProductComponent } from './add-product/add-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';


@NgModule({
  declarations: [DashboardComponent, AddProductComponent, UpdateProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    OwnerRoutingModule
  ]
})
export class OwnerModule { }
