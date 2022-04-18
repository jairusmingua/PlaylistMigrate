&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<p align="left">
  <img height=50 src="img/logo.png" />
</p>

A platform that allows user migrate their spotify playlist to youtube playlist and vice versa.
<br>
<br>
# Pre-requisites
PlaylistMigrate runs with these primary technologies:

1.  **[Next.js](https://nextjs.org/)** - an all in one framework to serve front-end and back-end services of the application.
2.  **[React.js](https://reactjs.org/)** - used for templating the front-end of the application
3.  **[Prisma.js](https://www.prisma.io/)** - Prisma helps app developers build faster and make fewer errors with an open source database toolkit for PostgreSQL, MySQL, SQL Server, and SQLite
4.  **[PostgresSQL](https://www.pgadmin.org/download/)** - primary database of the application

# Installation
To run this application, simply install pre-requisites from [package.json](package.json) by running.
```
npm run install
```
# Migrations
Prisma handles migration easily by just running 
```
npx prisma migrate dev 
```
Make sure you fill up the your environment variables **.env** with the following [env.example](.env.example)

# Running the Application
## Debugging
You can debug via vs code by running
```
npm run dev
```
## Building
```
npm run build
```
## Deploying
```
npm run start
```
