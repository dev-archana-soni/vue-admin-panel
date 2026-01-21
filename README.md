# Admin Panel - Vue.js & Node.js RBAC System

A complete Role-Based Access Control (RBAC) admin panel built with Vue 3, Vuetify, Node.js/Express, and MongoDB.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)

---

## 🎯 Project Overview

This is a full-stack admin panel application featuring:
- **Authentication System**: JWT-based login, registration, and profile management
- **User Management**: Full CRUD operations with role assignment
- **Role Management**: Dynamic role creation and permission assignment
- **Permission System**: Granular permission control based on modules
- **Module Management**: Organize permissions by application modules
- **Dashboard**: Central hub for admin operations

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Library**: Vuetify 3
- **HTTP Client**: Axios
- **Styling**: SCSS, CSS

---

## 📁 Project Structure

```
Main-vue-demo/
├── node-admin-panel/                 # Backend
│   ├── src/
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js
│   │   │   ├── usersController.js
│   │   │   ├── rolesController.js
│   │   │   ├── permissionsController.js
│   │   │   └── modulesController.js
│   │   ├── models/                   # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   ├── Permission.js
│   │   │   └── Module.js
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── roles.js
│   │   │   ├── permissions.js
│   │   │   └── modules.js
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.js              # JWT verification
│   │   │   └── requirePermission.js # Permission checking
│   │   ├── config/
│   │   │   └── config.js            # Configuration settings
│   │   ├── scripts/                  # Database scripts
│   │   │   ├── seedModulesPermissions.js
│   │   │   ├── migrateUserRoles.js
│   │   │   └── activatePermissions.js
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
├── vue-admin-panel/                  # Frontend
│   ├── src/
│   │   ├── components/               # Reusable Vue components
│   │   │   ├── Alerts.vue
│   │   │   ├── Chat.vue
│   │   │   ├── ComposeEmail.vue
│   │   │   ├── EmailViewer.vue
│   │   │   ├── MediaUpload.vue
│   │   │   └── MediaViewer.vue
│   │   ├── composables/              # Vue composables
│   │   │   └── useAuth.js            # Authentication composable
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Profile.vue
│   │   │   ├── Users.vue
│   │   │   ├── Inbox.vue
│   │   │   ├── Chat.vue
│   │   │   ├── Media.vue
│   │   │   ├── NotFound.vue
│   │   │   └── security/
│   │   │       ├── Roles.vue         # Role management
│   │   │       └── Permissions.vue   # Permission management
│   │   ├── plugins/
│   │   │   └── vuetify.js            # Vuetify configuration
│   │   ├── router/
│   │   │   └── index.js              # Vue Router setup
│   │   ├── services/
│   │   │   └── authService.js        # API communication layer
│   │   ├── data/
│   │   │   └── menu.js               # Navigation menu config
│   │   ├── App.vue                   # Root component
│   │   ├── main.js                   # Vue app entry point
│   │   └── styles/
│   │       ├── theme.scss
│   │       └── style.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── package.json
```

---

## 🚀 Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd node-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in `node-admin-panel/`
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ips-admin
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=24h
   NODE_ENV=development
   ```

4. **Run database scripts** (in order)
   
   Seed modules and permissions:
   ```bash
   node src/scripts/seedModulesPermissions.js
   ```
   
   Activate all permissions:
   ```bash
   node src/scripts/activatePermissions.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   Or with nodemon for development:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### API Base URL
```
http://localhost:5000/api
```

---

## 🎨 Frontend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd vue-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

---

## ✨ Features

### Authentication Module
- ✅ User Registration with default 'user' role
- ✅ User Login with JWT token
- ✅ Token-based authentication (24-hour expiration)
- ✅ Profile viewing and management
- ✅ Password change functionality
- ✅ Secure logout

### User Management
- ✅ View all users with pagination
- ✅ Create new users and assign roles
- ✅ Edit user information and role assignment
- ✅ Delete users with confirmation
- ✅ Role dropdown with all available roles

### Role Management
- ✅ Create custom roles
- ✅ Edit role details and permissions
- ✅ Assign multiple permissions per role
- ✅ View assigned permissions in tree format
- ✅ Delete roles (with assigned users validation)
- ✅ Expandable permission categories by module

### Permission Management
- ✅ View permissions organized by modules
- ✅ Create new permissions with module selection
- ✅ Edit permission details and status
- ✅ Delete permissions with confirmation
- ✅ Active/Inactive status toggle
- ✅ Permission filtering by module

### Module Management
- ✅ Create application modules
- ✅ Edit module details (name, display name, icon, description)
- ✅ Activate/Deactivate modules
- ✅ Delete modules and cascade delete permissions
- ✅ Module icons from Material Design Icons

### Dashboard
- ✅ Admin overview
- ✅ Quick statistics
- ✅ Navigation menu

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "message": "User registered successfully",
  "userId": "user_id_here",
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": { ... }
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "Logged out successfully"
}
```

### User Endpoints

#### Get All Users
```http
GET /users
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "users": [ ... ]
}
```

#### Create User
```http
POST /users
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "role_id_here"
}

Response (201):
{
  "user": { ... }
}
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Smith",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "new_role_id"
}

Response (200):
{
  "user": { ... }
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "User deleted successfully"
}
```

### Role Endpoints

#### Get All Roles
```http
GET /roles
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "roles": [ ... ]
}
```

#### Create Role
```http
POST /roles
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "editor",
  "description": "Editor role",
  "permissions": ["permission_id_1", "permission_id_2"]
}

Response (201):
{
  "role": { ... }
}
```

#### Update Role
```http
PUT /roles/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "editor",
  "description": "Updated editor role",
  "permissions": ["permission_id_1", "permission_id_2"]
}

Response (200):
{
  "role": { ... }
}
```

#### Delete Role
```http
DELETE /roles/:id
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "Role deleted successfully"
}
```

### Permission Endpoints

#### Get All Permissions
```http
GET /permissions
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "permissions": [ ... ]
}
```

#### Get Permissions by Module
```http
GET /permissions/module/:moduleId
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "permissions": [ ... ]
}
```

#### Create Permission
```http
POST /permissions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "users.view",
  "module": "module_id_here",
  "description": "View users",
  "isActive": true
}

Response (201):
{
  "permission": { ... }
}
```

#### Update Permission
```http
PUT /permissions/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "users.view",
  "description": "View all users",
  "isActive": true
}

Response (200):
{
  "permission": { ... }
}
```

#### Delete Permission
```http
DELETE /permissions/:id
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "Permission deleted successfully"
}
```

### Module Endpoints

#### Get All Modules
```http
GET /modules
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "modules": [ ... ]
}
```

#### Get Active Modules
```http
GET /modules/active/list
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "modules": [ ... ]
}
```

#### Create Module
```http
POST /modules
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "users",
  "displayName": "Users",
  "description": "User management module",
  "icon": "mdi-account-multiple",
  "isActive": true
}

Response (201):
{
  "module": { ... }
}
```

#### Update Module
```http
PUT /modules/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "users",
  "displayName": "Users",
  "description": "Updated description",
  "icon": "mdi-account-multiple",
  "isActive": true
}

Response (200):
{
  "module": { ... }
}
```

#### Delete Module
```http
DELETE /modules/:id
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "Module deleted successfully"
}
```

---

## 📖 Usage Guide

### First-Time Setup

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd node-admin-panel
   npm install
   npm start
   ```

3. **Start Frontend Dev Server** (in another terminal)
   ```bash
   cd vue-admin-panel
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Open `http://localhost:5173` in your browser

### Default Credentials

The system seeds with default roles and permissions:

**Roles:**
- `admin` - Full access to all modules and permissions
- `user` - Limited access (view-only for users and profiles)
- `editor` - Content management permissions
- `moderator` - Moderation permissions
- `guest` - Guest access (minimal permissions)

**Default Modules:**
- Users
- Roles
- Permissions
- Dashboard
- Profile

### Creating a New User

1. Navigate to `Users` in the sidebar
2. Click `ADD USER` button
3. Fill in the form:
   - Name
   - Email
   - Password
   - First Name
   - Last Name
   - Phone
   - Address
   - Select Role
4. Click `Create`

### Managing Roles

1. Go to `Security` → `Roles`
2. Click `ADD ROLE` to create new role
3. Assign permissions by selecting modules and their permissions
4. Click `Create` to save

### Managing Permissions

1. Go to `Security` → `Permissions`
2. Permissions are organized by modules
3. Click `ADD PERMISSION` to create new permission
4. Select module and fill in permission details
5. Toggle `Active` switch and save

---

## 🔐 Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed before storage
- All API endpoints require authentication
- Permission checking is enforced at middleware level
- CORS is configured for localhost:5173

---

## 📝 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  role: ObjectId (Reference to Role),
  createdAt: Date,
  updatedAt: Date
}
```

### Role
```javascript
{
  name: String (unique),
  description: String,
  permissions: [ObjectId] (Reference to Permission),
  createdAt: Date,
  updatedAt: Date
}
```

### Permission
```javascript
{
  name: String (unique),
  module: ObjectId (Reference to Module),
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Module
```javascript
{
  name: String (unique),
  displayName: String,
  description: String,
  icon: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env` file
- Verify database name is correct

**Port Already in Use**
- Change PORT in `.env` or kill process using port 5000

**JWT Errors**
- Verify JWT_SECRET is set in `.env`
- Check token expiration with `JWT_EXPIRES_IN`

### Frontend Issues

**CORS Errors**
- Ensure backend is running on port 5000
- Check CORS configuration in backend `app.js`

**Blank Pages**
- Check browser console for errors
- Verify API calls in Network tab
- Ensure token is being sent correctly

**Permission Not Showing**
- Run `activatePermissions.js` script
- Refresh browser to reload data
- Check database for permission records

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Last Updated:** January 2026
**Version:** 1.0.0
