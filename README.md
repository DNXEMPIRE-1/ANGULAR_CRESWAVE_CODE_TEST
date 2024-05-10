
Task Manager App (TMA) 🚀
Welcome to the Task Manager App (TMA) project! Manage your tasks efficiently with this Angular-based application. Below is all you need to know to get started, from setup instructions to architecture overview and development guidelines.

Prerequisites 🛠️
Node.js v16
(Optional) Visual Studio Code
(Optional) Angular CLI
(Optional) Docker
Setup 🛠️
Run npm install to install all dependencies.

Architecture 🏗️
This project is built using Angular.

The state management solution applied is RxJS Observable Data Services.

Folder Structure 📁
The project follows a structured folder organization:

directives: Custom directives for common use cases.
guards: Route guards to handle user authentication and form page exit prevention.
helpers: General helper functions and classes.
interceptors: HTTP interceptors for authentication, error handling, and loading.
models: Interfaces, models, DTOs, and configuration objects.
pages: Route components and feature-specific components.
pipes: Custom pipes for common use cases.
services: Data access, business logic, and state management services.
shared: Shared components and modules.
util: Static Angular services for common use cases and constants.
Development server 🖥️
Run npm run start for a dev server. Navigate to http://localhost:4200/.

(Optional) Docker setup 🐳
Run docker-compose up --build -d to build and run the Docker container. Navigate to http://localhost:4200/.

Running tests 🧪
Run ng test to execute the unit tests via Karma.

Formatting ✨
To format the code, run npm run format.

Feel free to explore, contribute, and make the Task Manager App even better! 🚀📝
