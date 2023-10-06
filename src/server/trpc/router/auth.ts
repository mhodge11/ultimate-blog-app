import { router, publicProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx: { session } }) => {
    return session;
  }),
});
