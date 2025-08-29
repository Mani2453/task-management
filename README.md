

# Task Management App

## About the Application

The Task Management App is a modern, full-stack web application designed to help individuals and teams organize their work efficiently. With a focus on security, usability, and scalability, this app allows users to:

- Register and securely log in to their own account
- Create and manage multiple projects
- Add, update, and track tasks within each project
- Set task priorities, statuses, and due dates
- View all their projects and tasks in a clean, responsive dashboard
- Enjoy a seamless user experience with real-time feedback, notifications, and confirmation dialogs

All data is private to each user, ensuring that your projects and tasks are only visible to you. The app is built using the latest technologies (Next.js, MongoDB, Tailwind CSS) and follows best practices for authentication, validation, and code organization.

Whether you're managing personal to-dos or collaborating on team projects, this app provides a solid foundation for productivity and organization.

----

## Features

- **User Authentication**
	- Secure registration and login using JWT
	- Passwords are hashed for security
	- Session expiration and automatic logout

- **Project Management**
	- Create, update, delete, and view projects
	- Projects are private to each user

- **Task Management**
	- Create, update, delete, and view tasks
	- Tasks are linked to projects and users
	- Task fields: title, description, status, priority, due date

- **Modern UI/UX**
	- Built with Next.js (App Router) and Tailwind CSS
	- Responsive, clean, and user-friendly interface
	- Table views for projects and tasks
	- Global toast notifications and confirmation dialogs
	- Navigation hidden on the main landing page

- **API & Data**
	- All API calls use Axios with automatic session handling
	- MongoDB (native driver) for data storage
	- All data filtered by authenticated user
	- Zod for input validation

- **Configuration**
	- Database connection and name set via `.env.local`
	- JWT secret set via `.env.local`

---


## How to Access and Run This Project

Follow these steps to get the Task Management App running on your machine:

### 1. Clone the Repository

Clone the project from GitHub:

```sh
git clone https://github.com/Mani2453/task-management.git
cd task-management
```

### 2. Install Dependencies

Install all required Node.js packages:

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/
DB_NAME=taskmanager
JWT_SECRET=your_jwt_secret
```

- Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials.
- Set `DB_NAME` to your preferred database name (default is `taskmanager`).
- Set a strong `JWT_SECRET` for security.

### 4. Run the Development Server

Start the Next.js development server:

```sh
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Register and Use

1. Open the app in your browser.
2. Register a new user account.
3. Log in and start creating projects and tasks!

---

## Usage

1. **Register a new user** via the registration page.
2. **Log in** to access your dashboard.
3. **Create projects** and manage your tasks within each project.
4. **All data is private** to your account.

---

## Project Structure

```
├── app/
│   ├── api/           # API route handlers (auth, projects, tasks)
│   ├── components/    # Reusable UI components
│   ├── projects/      # Projects page and UI
│   ├── tasks/         # Tasks page and UI
│   ├── page.tsx       # Main landing page
│   └── ...
├── lib/               # Utility libraries (db, auth, axios, validation)
├── public/            # Static assets
├── styles/            # Global styles (Tailwind)
├── .env.local         # Environment variables
├── package.json
└── ...
```

---

## Security & Best Practices
- All API endpoints require authentication and are user-scoped.
- JWTs are stored in HTTP-only cookies for security.
- Passwords are hashed before storage.
- Input validation is enforced with Zod.
- Sensitive configuration is managed via environment variables.

---

## Customization
- **UI:** Modify Tailwind CSS classes or add new components in `app/components`.
- **Database:** Change `DB_NAME` or `DATABASE_URL` in `.env.local` to use a different MongoDB database.
- **Validation:** Update Zod schemas in `lib/validations.ts` as needed.

---

## License

This project is licensed under the MIT License.

---

## Credits

Created by Mani2453. Contributions welcome!
