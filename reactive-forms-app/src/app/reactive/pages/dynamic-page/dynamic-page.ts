import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.html',
})
export class DynamicPage {
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    
    favourite: this.fb.array(
      [
        ['MetalGear', Validators.required],
        ['DeathStranding', Validators.required],
      ],
      Validators.minLength(3),
      
    ),
    delete: ['', Validators.required],
  });



  newFavouriteGame = this.fb.control('', Validators.required);

  get favourite() {
    return this.myForm.get('favourite') as FormArray;
  }


  onAddToFavourites() {
    if(this.newFavouriteGame.invalid) return;
    const newGame = this.newFavouriteGame.value;

    this.favourite.push(this.fb.control(newGame, Validators.required));

    this.newFavouriteGame.reset();
  }
  

  onDelete(index: number) {
    this.favourite.removeAt(index);
  }

  onSubmit(){
    this.myForm.markAllAsTouched();
  }

}
