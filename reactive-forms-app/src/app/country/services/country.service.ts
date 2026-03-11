import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private http = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}?fields=name,cca3,borders`;
    return this.http.get<Country[]>(url);
  }


  getCountryByCode(code: string): Observable<Country> {
    const url = `${this.baseUrl}/alpha/${code}?fields=name,cca3,borders`;
    return this.http.get<Country>(url);
  }

  getCountriesNamesByCodes(codes: string[]): Observable<Country[]> {
    
    if(!codes || codes.length == 0) return of([]);

    const countriesRequests: Observable<Country>[] =[]

    codes.forEach( code =>{
      const request = this.getCountryByCode(code);
      countriesRequests.push(request);
    })
    return combineLatest(countriesRequests);
    
  }

}
