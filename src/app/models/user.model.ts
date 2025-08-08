export interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: Date;
  city?: string;
  phone: string;
  email: string;
  dateCreated: Date;
  lastLogin?: Date;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: Date | null;
  city: string;
  phone: string;
  email: string;
}

export interface UserFilters {
  searchTerm: string;
  nameFilter: string;
  emailFilter: string;
}

export interface UserSort {
  field: 'firstName' | 'email';
  direction: 'asc' | 'desc';
} 