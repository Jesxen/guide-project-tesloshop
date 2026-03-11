import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);

  productIdSlug = toSignal(
    this.route.params.pipe(map(params => params['idSlug']))
  );

  productResource = rxResource({
    params: () => this.productIdSlug(),
    stream: ({ params }) => this.productService.getProductByIdSlug(params)
  });
 }
