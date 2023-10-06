import { z } from "zod";
// import { decode } from "base64-arraybuffer";
// import isDataURI from "validator/lib/isDataURI";
// import { createClient } from "@supabase/supabase-js";
// import { TRPCError } from "@trpc/server";
import {
  router,
  publicProcedure,
  // protectedProcedure
} from "../trpc";

// const supabase = createClient(env.SUPABASE_PUBLIC_URL, env.SUPABASE_SECRET_KEY);

export const userRouter = router({
  getUserProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
      return user;
    }),
  getUserPosts: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          posts: {
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
          },
        },
      });
      return user;
    }),
  // uploadUserAvatar: protectedProcedure
  //   .input(
  //     z.object({
  //       imageAsDataUrl: z.string().refine(isDataURI),
  //       username: z.string(),
  //     })
  //   )
  //   .mutation(
  //     async ({
  //       ctx: { prisma, session },
  //       input: { imageAsDataUrl, username },
  //     }) => {
  //       const imageBase64Str = imageAsDataUrl.replace(/^.+,/, "");

  //       const { data, error } = await supabase.storage
  //         .from("public")
  //         .upload(`avatars/${username}.png`, decode(imageBase64Str), {
  //           contentType: "image/png",
  //           upsert: true,
  //         });

  //       if (error)
  //         throw new TRPCError({
  //           code: "INTERNAL_SERVER_ERROR",
  //           message: "upload failed to supabase",
  //         });

  //       const {
  //         data: { publicUrl },
  //       } = supabase.storage.from("public").getPublicUrl(data?.path);

  //       await prisma.user.update({
  //         where: { username },
  //         data: { image: publicUrl },
  //       });
  //     }
  //   ),
});
