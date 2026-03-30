# tradeshelper

A Node.js Express backend for managing users and contractors. Includes authentication, MongoDB integration, and RESTful API structure.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your environment variables.
3. Start the server:
   ```bash
   node server.js
   ```

## Project Structure
- `models/` — Mongoose models
- `routes/` — Express route handlers
- `public/` — Static files
- `server.js` — Entry point

## Dependencies
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
