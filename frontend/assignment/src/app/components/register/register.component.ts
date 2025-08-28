import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string;
  if (!v) return null;
  const ok = v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v);
  return ok ? null : { passwordPattern: true };
}

function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (!v) return null;
  const inputDate = new Date(v);
  const now = new Date();
  return inputDate < now ? null : { futureDate: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error = '';
  success = '';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      FullName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, passwordPatternValidator]],
      ConfirmPassword: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.pattern(/^\d{7,15}$/)]],
      DateOfBirth: ['', [pastDateValidator]],
      Role: ['User', [Validators.required]]
    }, { validators: this.matchPasswords });
  }

  matchPasswords(group: any) {
    const pass = group.get('Password')?.value;
    const confirm = group.get('ConfirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  submit() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.error = 'Please fix validation errors before submitting.';
      return;
    }
    const payload = { ...this.form.value } as any;
    delete payload.ConfirmPassword;

    this.auth.register(payload).subscribe({
      next: () => {
        this.success = 'Registration successful. You can now log in.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => this.error = err?.error?.error || 'Registration failed'
    });
  }
}
