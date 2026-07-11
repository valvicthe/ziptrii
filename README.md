# Ziptrii (2020)

Ziptrii is a custom server implementation and web portal recreating the 2020 era. This repository uses a monorepo architecture designed for seamless deployment.

## 🚀 Repository Architecture

- `/backend`: Node.js + Express application driving all core APIs (`auth`, `users`, `games`) via sub-domain routing middleware.
- `/frontend`: Responsive dark-mode layouts matching the exact 2020 design tokens.
- `/launcher`: Registry entry configurations and client activation handlers.

## 🛠️ Local Setup Instructions

1. Install dependencies inside the backend directory:
   ```bash
   cd backend
   npm install
