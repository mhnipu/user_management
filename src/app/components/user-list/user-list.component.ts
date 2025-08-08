import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, Subject } from 'rxjs';

import { User, UserFilters, UserSort } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['name', 'gender', 'dateOfBirth', 'email', 'phone', 'actions'];

  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  showFilterPanel = false;

  filters: UserFilters = { searchTerm: '', nameFilter: '', emailFilter: '' };
  userSort: UserSort = { field: 'firstName', direction: 'desc' }; // Default to desc to show recent first

  private searchChange$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userService.initializeSampleData();

    this.searchChange$.pipe(debounceTime(200)).subscribe(() => {
      this.currentPage = 1;
      this.loadUsers();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.searchUsers(this.filters, this.userSort, this.currentPage, this.pageSize)
      .subscribe({
        next: (result) => {
          this.users = result.users;
          this.totalUsers = result.total;
          this.dataSource.data = this.users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
          this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        }
      });
  }

  onFilterChange(): void {
    this.searchChange$.next();
  }

  clearAllFilters(): void {
    this.filters = { searchTerm: '', nameFilter: '', emailFilter: '' };
    this.onFilterChange();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  toggleSortField(): void {
    this.userSort.field = this.userSort.field === 'firstName' ? 'email' : 'firstName';
    this.currentPage = 1;
    this.loadUsers();
  }

  toggleSortDirection(): void {
    this.userSort.direction = this.userSort.direction === 'asc' ? 'desc' : 'asc';
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onCreateUser(): void { this.router.navigate(['/users/create']); }
  onEditUser(user: User): void { this.router.navigate(['/users/edit', user.id]); }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: (success) => {
            if (success) {
              if ((this.totalUsers - 1) <= (this.pageSize * (this.currentPage - 1)) && this.currentPage > 1) {
                this.currentPage -= 1;
              }
              this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
              this.loadUsers();
            } else {
              this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getFullName(user: User): string { return `${user.firstName} ${user.lastName}`; }
  getGenderIcon(gender: string): string { return gender === 'Male' ? 'male' : 'female'; }
  formatDate(date: Date): string { return new Date(date).toLocaleDateString(); }
} 