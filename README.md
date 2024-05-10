# TMA SPA

Frontend single-page application (SPA) for Task Manager App project.

## Prerequisites

- [Node.js v16](https://nodejs.org/en/)

- [(Optional) Visual Studio Code](https://code.visualstudio.com/)

- [(Optional) Angular CLI](https://angular.io/cli)

- [(Optional) Docker](https://www.docker.com/products/docker-desktop)

## Setup

Run `npm install` to install all dependencies.

## Architecture

This project is built using [Angular](https://angular.io/)

The state management solution applied is RxJS Observable Data Services

### Folder Structure

The following folders are in the `src/app` subdirectory:

- `directives`
  - Custom directives for common use cases
- `guards`
  - Route guards to handle if a user is authenticated before seeing a route, and preventing unsaved changes when users exit a form page route
- `helpers`
  - General helper functions and classes
- `interceptors`
  - HTTP interceptors to handle authentication, errors and loading
- `models`
  - Interfaces, models, DTOs and configuration objects for entities and services
- `pages`
  - Route components and feature-specific components
- `pipes`
  - Custom pipes for common use cases
- `services`
  - Services for data access, business logic and state management
- `shared`
  - Shared components and modules
- `util`
  - Static Angular services for common use cases, mostly just pure functions
  - The methods of these services are the most important ones to add unit tests for, as they are provide an easy and preditactable way to test the application, the tests are in `/util/__tests__`
  - `/util/constants`
    - Constant values used throughout the application

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`.

## (Optional) Docker setup

Run `docker-compose up --build -d` to build and run the docker container. Navigate to `http://localhost:4200/`.

## Running tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Formatting

To format the code, run `npm run format`

## Low-Priority Possible Improvements

These are some architectural and performance improvements that could be eventually made to the application, but are not necessary for the application to function.

- Add more unit tests and review coverage
- Convert static Angular services to functions
- Convert folder structure to Feature Slices
- Add TanStack Query to improve server-side state management
  - Configure caching via setQueryData() and staleTime configurations

## Contributing

Feel free to submit a pull request with any improvements you see fit, suggestions are also welcome!
