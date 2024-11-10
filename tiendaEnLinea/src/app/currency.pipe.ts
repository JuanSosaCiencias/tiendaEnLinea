import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  standalone: true,
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '';
    }

    return '$' + value.toFixed(2); // Formatea el número como una cadena con dos decimales
  }

}