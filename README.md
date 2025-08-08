# User Management System

A comprehensive Angular application for managing users with full CRUD operations, built with Angular Material and local storage.

## Features

### ✅ Core Functionality
- **List Users**: Display all users in a paginated table
- **Create User**: Add new users with form validation
- **Edit User**: Modify existing user information
- **Delete User**: Remove users with confirmation dialog
- **Search Users**: Search across name, email, and phone fields
- **Filter Users**: Filter by name and email separately
- **Sort Users**: Sort by First Name, Last Name, and Date of Birth

### ✅ User Schema Validation
- **First Name**: Required, 2-50 characters
- **Last Name**: Required, 2-50 characters
- **Gender**: Required, Male/Female selection
- **Date of Birth**: Required, between 100 years ago and current date
- **City**: Optional
- **Phone**: Required, valid phone number format
- **Email**: Required, valid email format

### ✅ Technical Features
- **Angular Material UI**: Modern, responsive design
- **Local Storage**: Data persistence without backend
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Works on desktop and mobile devices
- **Pagination**: Configurable page sizes (5, 10, 25, 50)
- **Sorting**: Multi-column sorting with visual indicators
- **Search & Filter**: Real-time search and filtering capabilities

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── user-list/           # User list with search, filter, sort
│   │   ├── user-form/           # Create/Edit user form
│   │   └── confirm-dialog/      # Delete confirmation dialog
│   ├── models/
│   │   └── user.model.ts        # User interfaces and types
│   ├── services/
│   │   └── user.service.ts      # User CRUD operations
│   ├── app.routes.ts            # Application routing
│   ├── app.config.ts            # App configuration
│   └── app.ts                   # Main app component
├── styles.css                   # Global styles and Material theme
└── main.ts                      # Application bootstrap
```

## Usage Guide

### Navigation
- **Users List**: View all users with search and filter options
- **Create User**: Add new users to the system
- **Edit User**: Click the edit icon on any user row
- **Delete User**: Click the delete icon and confirm

### Search & Filter
- **Global Search**: Search across name, email, and phone
- **Name Filter**: Filter users by first/last name
- **Email Filter**: Filter users by email address
- **Clear Filters**: Reset all filters to show all users

### Sorting
- Click column headers to sort by:
  - First Name (A-Z or Z-A)
  - Last Name (A-Z or Z-A)
  - Date of Birth (Oldest to Newest or vice versa)

### Pagination
- Navigate through pages using pagination controls
- Change page size: 5, 10, 25, or 50 users per page
- View total user count at the bottom

## Data Storage

The application uses **local storage** to persist user data:
- Data is automatically saved when creating, updating, or deleting users
- Sample data is initialized on first load
- Data persists between browser sessions
- No backend server required

## Form Validation

### Required Fields
- First Name (2-50 characters)
- Last Name (2-50 characters)
- Gender (Male/Female)
- Date of Birth (valid date, max 100 years ago)
- Phone Number (valid format)
- Email Address (valid email format)

### Validation Features
- Real-time validation feedback
- Clear error messages
- Form submission prevention if invalid
- Visual indicators for valid/invalid fields

## Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Stacked layout with touch-friendly controls

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode for development
npm run watch
```

### Key Technologies

- **Angular 20**: Latest Angular framework
- **Angular Material**: UI component library
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **Angular Forms**: Form handling and validation

## Customization

### Styling
- Modify `src/styles.css` for global styles
- Component-specific styles in respective `.css` files
- Material Design theme can be customized

### Features
- Add new user fields in `user.model.ts`
- Extend validation in `user-form.component.ts`
- Modify search/filter logic in `user.service.ts`

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 4200
   npx kill-port 4200
   ```

2. **Dependencies not found**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Local storage issues**
   - Clear browser cache and local storage
   - Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
