import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    const image = Array.isArray(value) ? value.at(0) : value;

    if (!image) {
      return '/assets/images/no-image.jpg';
    }

    if (image.startsWith('http')) return image;

    return `${baseUrl}/files/product/${image}`;
  }
}
