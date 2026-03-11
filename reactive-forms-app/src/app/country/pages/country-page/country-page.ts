import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { JsonPipe } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.html',
})
export class CountryPage {
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);
  countryByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanup) => {
    const regionSubscription = this.onRegionChange();
    const countrySubscription = this.onCountryChange();

    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  onRegionChange() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => {
          this.borders.set([]);
          this.countryByRegion.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region ?? '')),
      )
      .subscribe((countries) => {
        this.countryByRegion.set(countries);
      });
  }

  onCountryChange() {
    return this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')!.setValue('')),
      filter( value => value!.length>0),
      switchMap(alphaCode => this.countryService.getCountryByCode(alphaCode ?? '')),
      switchMap(country => this.countryService.getCountriesNamesByCodes(country.borders))
    )
    
    
    .subscribe((borders) => {
      this.borders.set(borders);
    });
  }
}
