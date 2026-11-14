# BookSync

## Run locally

1. Install the dependencies with `npm ci` in both `server` and `client`.
2. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env.local`. Keep those local files private.
3. Set `MONGODB_URI` to the connection string for your Atlas database. BookSync's original catalog and accounts are in the `test` database. For that catalog, use the original database in Atlas and allow your machine's IP in the Atlas network access list.
4. Set a random `JWT_SECRET` in the server environment. Run `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` to generate one.
5. Set `GOOGLE_CLIENT_ID` on the server and `VITE_GOOGLE_CLIENT_ID` in the client to the same Google OAuth web client ID. The client must allow `http://localhost:5173` under Authorized JavaScript origins. Existing Atlas account roles determine admin access.
6. In `server`, run `npm start`. In a second terminal, run `npm run dev` in `client`. Open [BookSync](http://localhost:5173/auth/login). Sign in with Google and choose **Products** in the admin sidebar.

The client proxies `/api` to the loopback API on port 5000. If you change `PORT`, set `BOOKSYNC_API_TARGET` in the client's local environment to match. A hosted frontend also needs a same-origin `/api` route to the backend.

Set `MONGODB_MANAGE_SCHEMA=true` when initializing a fresh development database so Mongoose creates the collections and indexes. The default leaves the existing Atlas schema alone. Cloudinary credentials are needed for new image uploads. PayPal checkout requires a configured payment integration.
