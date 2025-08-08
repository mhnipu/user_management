import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserFormData } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  loading = false;
  submitting = false;

  genderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }];
  maxDate = new Date();
  minDate = new Date(this.maxDate.getFullYear() - 100, this.maxDate.getMonth(), this.maxDate.getDate());

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.dateRangeValidator(this.minDate, this.maxDate)]],
      city: [''],
      phone: ['', [Validators.required, this.phoneValidator()]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]]
    });
  }

  private phoneValidator() {
    return (control: any) => {
      const phone = control.value;
      if (!phone) return null;
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      return phoneRegex.test(phone) ? null : { invalidPhone: true };
    };
  }

  private dateRangeValidator(min: Date, max: Date): ValidatorFn {
    return (control: AbstractControl) => {
      const val = control.value;
      if (!val) return null;
      const date = new Date(val);
      if (isNaN(date.getTime())) return { invalidDate: true };
      if (date < min || date > max) return { outOfRange: true };
      return null;
    };
  }

  private checkEditMode(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.loadUserData();
    }
  }

  private loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId!).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            dateOfBirth: this.toInputDate(user.dateOfBirth),
            city: user.city || '',
            phone: user.phone,
            email: user.email
          });
        } else {
          this.snackBar.open('User not found', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.snackBar.open('Error loading user', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  private toInputDate(d: Date): string {
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.submitting = true;
      const formValue = this.userForm.value;
      const payload: UserFormData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        gender: formValue.gender,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : null,
        city: formValue.city || '',
        phone: formValue.phone,
        email: formValue.email
      };

      const operation = this.isEditMode
        ? this.userService.updateUser(this.userId!, payload)
        : this.userService.createUser(payload);

      operation.subscribe({
        next: (result) => {
          if (result) {
            const message = this.isEditMode ? 'User updated successfully' : 'User created successfully';
            this.snackBar.open(message, 'Close', { duration: 3000 });
            this.router.navigate(['/users']);
          } else {
            this.snackBar.open('Error saving user', 'Close', { duration: 3000 });
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error saving user:', error);
          this.snackBar.open('Error saving user', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void { this.router.navigate(['/users']); }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must be at most ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['email'] || field.errors['pattern']) return 'Please enter a valid email address';
      if (field.errors['invalidPhone']) return 'Please enter a valid phone number';
      if (field.errors['outOfRange']) return 'Date must be within last 100 years and not in the future';
      if (field.errors['invalidDate']) return 'Invalid date';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
} 