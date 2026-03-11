import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

export class FormUtils {
  //Mis expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$';

  //Mensajes de Error
  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `El valor mínimo es ${errors['min'].min}`;
        case 'email':
          return 'El valor debe ser un correo electrónico válido';
        case 'emailTaken':
          return 'El correo electrónico ya está registrado';

        case 'notStrider':
          return 'El valor no puede ser "strider"';
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static getFieldArrayError(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length == 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  //Comparar dos campos
  static fieldsMustMatch(passwordField: string, confirmPasswordField: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordField];
      const confirmPassword = formGroup.controls[confirmPasswordField];
      if (password.value === confirmPassword.value) {
        confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors({ noMatch: true });
      }
    };
  }

  //Validaciones async

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    console.log('Validando servidor...');

    await sleep();

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value?.trim().toLowerCase();
    if (value === 'strider') {
      return { notStrider: true };
    }
    return null;
  }
}
