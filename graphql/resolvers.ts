import { Context } from "./context";

export const resolvers = {
  Query: {
    links: async (_parent, args, ctx: Context) => {
      let queryResults = null;
      if (args?.after) {
        // check if there is a cursor at the argument
        queryResults = await ctx.prisma.link.findMany({
          take: args.first, // num of items to return from db
          skip: 1, // skip the cursor
          cursor: {
            id: args.after, // the cursor
          },
        });
      } else {
        // if no cursor, this means that this is the first request
        //  and we will return the first items in the database
        queryResults = await ctx.prisma.link.findMany({
          take: args.first,
        });
      }
      // if initial request returns links
      if (queryResults?.length > 0) {
        // get las element
        const lastLinkInResult = queryResults[queryResults.length - 1];
        // cursor we will return for subsequent requests
        const myCursor = lastLinkInResult.id;

        // query after the cursor to check if we have next page
        const secondQuery = await ctx.prisma.link.findMany({
          take: args.first,
          cursor: {
            id: myCursor,
          },
          orderBy: {
            id: "asc",
          },
        });
        // Response object
        return {
          pageInfo: {
            endCursor: myCursor,
            hasNextPage: secondQuery.length >= args.first,
          },
          edges: queryResults.map((link) => ({
            cursor: link.id,
            node: link,
          })),
        };
      }
      // no links
      return {
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
        edges: [],
      };
    },
  },
  Mutation: {
    createLink: async (_parent, { input }, { user, accessToken, prisma }) => {
      console.log(input);

      if (!user) {
        throw new Error("You need to be logged in to add link");
      }

      const prismaUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (prismaUser.role !== "ADMIN") {
        throw new Error(`You do not have permission to perform action`);
      }

      const newLink = {
        title: input.title,
        url: input.url,
        imageUrl: input.imageUrl,
        category: input.category,
        description: input.description,
      };
      return await prisma.link.create({
        data: newLink,
      });
    },
  },
};
