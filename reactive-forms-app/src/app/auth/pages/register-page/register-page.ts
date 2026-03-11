import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControlOptions,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
      email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)], [FormUtils.checkingServerResponse]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(FormUtils.notOnlySpacesPattern), FormUtils.notStrider]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(FormUtils.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      
    },
    {
      validators: FormUtils.fieldsMustMatch('password', 'confirmPassword'),
    } as AbstractControlOptions,
  );

  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
