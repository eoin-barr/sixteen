# Github OAuth

Previously I worked on a project that used Magic Link to provide OAuth and while it did simplify the authentication process, it increased login times considerably. Because of this, I thought it would be a good idea to practice implmenting OAuth manually, before testing other tools like Firebase, Supabase, and SurrealDB.

When a user logs in with GitHub OAuth for the first time, a row is created in the `User` table with an associated row added to the `UserToken` table. A cookie is then stored in the user's browser so that they no longer have to login to the application again, unless they explicitly log out.

## Technologies used

| Backend | Frontend      |
| ------- | ------------- |
| GraphQL | Next.js       |
| Prisma  | TypeScript    |
| Nexus   | Tailwind      |
| Express | Apollo Client |

## How to run the app locally

1. Create a GitHub OAuth app.

2. Clone this repository.

3. Navigate to the web directory, create a `.env.local` file and add the following variables.

```
NEXT_PUBLIC_GITHUB_CLIENT_ID=<your-github-client-id>
NEXT_PUBLIC_LOGIN_REDIRECT_URI='http://localhost:3000/login/callback'
```

4. Install the required web packages using `yarn add`.

5. Open a new terminal, navigate to the web directory, create a `.env` file and add the following variables.

```
DATABASE_URL="postgresql://<username>:<password>@localhost:<prot>/<database-name>?schema=public"
APP_SECRET=<random-string-at-least-32-characters>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

5. Install the required server packages using `npm install`.

6. Run the app by using `yarn dev` in the web directory and `npm run dev` in the server directory.
