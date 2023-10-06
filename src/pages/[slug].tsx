import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import CommentSideBar from "../components/CommentSideBar";
import MainLayout from "../layouts/MainLayout";
import { trpc } from "../utils/trpc";

const PostPage = () => {
  const router = useRouter();

  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false);

  const postRoute = trpc.useContext().post;

  const getPost = trpc.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug }
  );

  const invalidateCurrentPostPage = useCallback(() => {
    postRoute.getPost.invalidate({ slug: router.query.slug as string });
  }, [postRoute.getPost, router.query.slug]);

  const likePost = trpc.post.likePost.useMutation({
    onSuccess: invalidateCurrentPostPage,
  });

  const unlikePost = trpc.post.unlikePost.useMutation({
    onSuccess: invalidateCurrentPostPage,
  });

  return (
    <MainLayout>
      {getPost.data?.id && (
        <CommentSideBar
          isCommentsSidebarOpen={isCommentsSidebarOpen}
          setIsCommentsSidebarOpen={setIsCommentsSidebarOpen}
          postId={getPost.data.id}
        />
      )}
      {getPost.isLoading && (
        <div className="flex h-full w-full items-center justify-center space-x-4">
          <div>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
          <div>Loading...</div>
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="flex w-full max-w-screen-md flex-col space-y-6">
          <div className="relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg">
            <div className="bg-opacity-500 absolute flex h-full w-full items-center justify-center">
              <div className="rounded-xl bg-black bg-opacity-50 p-4 text-white">
                {getPost.data?.title}
              </div>
            </div>
          </div>
          <div className="border-l-4 border-gray-800 pl-6">
            {getPost.data?.description}
          </div>
          <div>{getPost.data?.text}</div>
        </div>
      </div>
      {getPost.isSuccess && (
        <div className="fixed bottom-10 flex w-full items-center justify-center">
          <div className="group flex items-center space-x-4 rounded-full border border-gray-400 bg-white px-6 py-3 transition duration-300 hover:border-gray-900">
            <div className="border-r pr-4 group-hover:border-gray-900">
              {getPost.data?.likes && getPost.data?.likes.length > 0 ? (
                <FcLike
                  onClick={() =>
                    getPost.data?.id &&
                    unlikePost.mutate({ postId: getPost.data?.id })
                  }
                  className="cursor-pointer text-xl"
                />
              ) : (
                <FcLikePlaceholder
                  onClick={() =>
                    getPost.data?.id &&
                    likePost.mutate({ postId: getPost.data?.id })
                  }
                  className="cursor-pointer text-xl"
                />
              )}
            </div>
            <div>
              <BsChat
                onClick={() => setIsCommentsSidebarOpen(true)}
                className="cursor-pointer text-base"
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PostPage;
