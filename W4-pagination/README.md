# Pagination

![Pagination](assets/pagination.gif)

For this week I decided to implement two of the most common types of pagination; `offset` and `cursor-based`. `Offset-based` pagination requires only a limit (to indicate the number of items) and an offset (which item to start after). I liked Github's implementation and so copied their design. `Cursor-based` pagination (a.k.a infinite scroll) is trickier to implement but more robust that `offset-based` pagination. By taking the `id` of the last item taken, protects the pagination from being affected when new data is created.

## Technologies used

| Backend | Frontend      |
| ------- | ------------- |
| GraphQL | Next.js       |
| Prisma  | TypeScript    |
| Nexus   | Tailwind      |
| Express | Apollo Client |

## How to run the app locally

1. Clone this repository.

2. Navigate to the web directory and install the required web packages using `yarn`.

3. Open a new terminal, navigate to the web directory, create a `.env` file and add the following variables.

```
DATABASE_URL="postgresql://<username>:<password>@localhost:<prot>/<database-name>?schema=public"
```

4. Install the required server packages using `yarn`.

5. Run the app by using `yarn dev` in the web directory and `yarn dev` in the server directory.
