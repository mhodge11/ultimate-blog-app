import slugify from "slugify";
import { z } from "zod";
import { writeFormSchema } from "../../../components/WriteFormModal";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(writeFormSchema)
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, text },
      }) => {
        const post = await prisma.post.findFirst({ where: { title } });
        if (post) throw new Error("Post already exists");

        await prisma.post.create({
          data: {
            title,
            description,
            text,
            slug: slugify(title),
            author: { connect: { id: session.user.id } },
          },
        });
      }
    ),
  getPosts: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        bookmarks: session?.user?.id
          ? {
              where: { userId: session?.user?.id },
            }
          : false,
      },
    });
    return posts;
  }),
  getPost: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
      const post = await prisma.post.findUnique({
        where: { slug },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          likes: session?.user?.id
            ? {
                where: { userId: session?.user?.id },
              }
            : false,
        },
      });
      return post;
    }),
  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.create({
        data: {
          user: { connect: { id: session.user.id } },
          post: { connect: { id: postId } },
        },
      });
    }),
  unlikePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),
  bookmarkPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          user: { connect: { id: session.user.id } },
          post: { connect: { id: postId } },
        },
      });
    }),
  unbookmarkPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),
  commentOnPost: protectedProcedure
    .input(z.object({ text: z.string().min(3), postId: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { postId, text } }) => {
      await prisma.comment.create({
        data: {
          text,
          user: { connect: { id: session.user.id } },
          post: { connect: { id: postId } },
        },
      });
    }),
  getComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const comments = await prisma.comment.findMany({
        where: { postId },
        select: {
          id: true,
          text: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return comments;
    }),
  getReadingList: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: session.user.id },
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          post: {
            select: {
              title: true,
              description: true,
              slug: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return bookmarks;
    }
  ),
});
