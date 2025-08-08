import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserFormData, UserFilters, UserSort } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'users';
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUsersFromStorage();
  }

  private loadUsersFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedUsers = localStorage.getItem(this.STORAGE_KEY);
        if (storedUsers) {
          this.users = JSON.parse(storedUsers).map((user: any) => ({
            ...user,
            dateOfBirth: new Date(user.dateOfBirth),
            dateCreated: new Date(user.dateCreated),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
          }));
        }
      } catch (error) {
        console.error('Error loading users from storage:', error);
      }
    }
    this.usersSubject.next([...this.users]);
  }

  private saveUsersToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
      } catch (error) {
        console.error('Error saving users to storage:', error);
      }
    }
    this.usersSubject.next([...this.users]);
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  createUser(userData: UserFormData): Observable<User> {
    const newUser: User = {
      id: this.generateId(),
      ...userData,
      dateOfBirth: userData.dateOfBirth!,
      dateCreated: new Date(),
      lastLogin: undefined
    };

    this.users.push(newUser);
    this.saveUsersToStorage();
    return of(newUser);
  }

  updateUser(id: string, userData: UserFormData): Observable<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      const updatedUser: User = {
        ...this.users[index],
        ...userData,
        dateOfBirth: userData.dateOfBirth!
      };
      this.users[index] = updatedUser;
      this.saveUsersToStorage();
      return of(updatedUser);
    }
    return of(null);
  }

  deleteUser(id: string): Observable<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.saveUsersToStorage();
      return of(true);
    }
    return of(false);
  }

  getUserById(id: string): Observable<User | null> {
    const user = this.users.find(user => user.id === id);
    return of(user || null);
  }

  searchUsers(filters: UserFilters, sort: UserSort, page: number = 1, pageSize: number = 10): Observable<{ users: User[], total: number }> {
    let filteredUsers = [...this.users];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone.includes(searchTerm)
      );
    }

    if (filters.nameFilter) {
      const nameFilter = filters.nameFilter.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(nameFilter)
      );
    }

    if (filters.emailFilter) {
      const emailFilter = filters.emailFilter.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(emailFilter)
      );
    }

    filteredUsers.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'firstName':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return of({
      users: paginatedUsers,
      total: filteredUsers.length
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  initializeSampleData(): void {
    if (this.users.length === 0) {
      const sampleUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          dateOfBirth: new Date('1990-05-15'),
          city: 'New York',
          phone: '+1234567890',
          email: 'john.doe@example.com',
          dateCreated: new Date('2023-01-15'),
          lastLogin: new Date('2024-01-20')
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female',
          dateOfBirth: new Date('1985-08-22'),
          city: 'Los Angeles',
          phone: '+1987654321',
          email: 'jane.smith@example.com',
          dateCreated: new Date('2023-02-10'),
          lastLogin: new Date('2024-01-19')
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Johnson',
          gender: 'Male',
          dateOfBirth: new Date('1992-12-03'),
          city: 'Chicago',
          phone: '+1555123456',
          email: 'michael.johnson@example.com',
          dateCreated: new Date('2023-03-05'),
          lastLogin: new Date('2024-01-18')
        }
      ];

      this.users = sampleUsers;
      this.saveUsersToStorage();
    }
  }
} 