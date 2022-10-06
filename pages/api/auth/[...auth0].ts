import { handleAuth } from "@auth0/nextjs-auth0";

// this automatically creates /login /logout /callback /me routes
export default handleAuth();
