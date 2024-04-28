---
title: Remix Jokes App
---

# Remix Jokes App

This is a Remix.js application for managing and sharing jokes. Users can log in, view their own jokes, add new jokes, and view jokes shared by other users. In this updated version, we have added the ability for users to select a specific user from the database whose jokes they want to view.

## Features

- **User Authentication**: Users can log in to the application to access their own jokes.

- **Select User**: Users can now select a specific user from the database whose jokes they want to view. This feature allows users to switch between different users and see their respective jokes.

- **Display User List**: The application displays a list of all users fetched from the Prisma database at the initial jokes page login. This list is shown in the app header, allowing users to easily switch between users.

- **Dynamic Jokes Rendering**: As the user selects a different user from the list, the application dynamically fetches the jokes list for the selected user from the database and renders them on the jokes page. This ensures that users can easily view jokes from different users without navigating away from the page.

- **Updated Types Import**: All types imports have been updated to use the latest types from the Remix library, ensuring compatibility and consistency throughout the application.

## Getting Started

From your terminal:
<br/>
skip this step if prisma is not installed.
```sh
npm install -g prisma

npx prisma generate
```
### Now run this

```sh
npm install

npx prisma migrate dev

npm run dev
```

This prepares the local dev database and starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then apply any database changes:

```sh
npx prisma migrate deploy
```

Then run the app in production mode:

```sh
npm start
```
