# Getting Started with Create React App

This project contains a frontend and backend section to test react-query library with a fake API. This training is intended for v3 version of the library from examples based on the official documentation. The fake API is made with express.js

## Available Scripts

In the project directory, you can run:

### `npm run start`

This command is available in `frontend` and `backend` folders, you need both of them running to use most of this app

## Setup

- When running the fake API, you can use the get endopoint `/posts/gen/:qty`, where `qty` is the quantity to generate the posts.
  This way, you can work properly with the examples that require pagination.
- `/posts` get requests have a version paginated and a vanilla one, just inspect the file to know how to use the values.

## Usage

Go to `/frontend/App.js` file and uncomment the section that you want to test.
