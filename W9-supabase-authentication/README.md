# Supabase Authentication

![supabase](assets/w9.gif)

This project was based on [daniellaera's](https://github.com/daniellaera/supabase-react-auth) Supbase authentication tutorial. The tutorial goes through the basics of signing up and logging users in with Supabase's built in Magic link provider. Once signed up, users can then update their avatar, username and website. To explore the other basics of Supabase's functionality I also allowed users to create and view their projects.

## Technologies used

| Supabase | Next.js | Chakra UI |
| -------- | ------- | --------- |

## How run the app locally

1. Clone this repository

2. Create a new project on Supabase

3. Create an `env.local` file and add the following variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Run `yarn`

5. Run `yarn dev`

6. Open a new browser window `http://localhost:3000`
