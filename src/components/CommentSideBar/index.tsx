import React, { Fragment } from "react";
import { HiXMark } from "react-icons/hi2";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

type CommentSideBarProps = {
  isCommentsSidebarOpen: boolean;
  setIsCommentsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
};

type CommentFormType = {
  text: string;
};

export const commentFormSchema = z.object({
  text: z.string().min(3),
});

const CommentSideBar = ({
  isCommentsSidebarOpen,
  setIsCommentsSidebarOpen,
  postId,
}: CommentSideBarProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  });

  const postRoute = trpc.useContext().post;

  const commentOnPost = trpc.post.commentOnPost.useMutation({
    onSuccess: () => {
      toast.success("Comment added successfully");
      postRoute.getComments.invalidate({ postId });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getComments = trpc.post.getComments.useQuery({ postId });

  return (
    <Transition.Root show={isCommentsSidebarOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setIsCommentsSidebarOpen(false)}>
        <div className="fixed right-0 top-0">
          <Transition.Child
            enter="transition duration-1000"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative h-screen w-screen bg-white shadow-md sm:w-[400px]">
              <div className="flex h-full w-full flex-col overflow-scroll px-6">
                <div className="mb-5 mt-10 flex items-center justify-between text-xl">
                  <h2 className="font-medium">Responses (4)</h2>
                  <div>
                    <HiXMark
                      className="cursor-pointer"
                      onClick={() => setIsCommentsSidebarOpen(false)}
                    />
                  </div>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit((data) =>
                      commentOnPost.mutate({ ...data, postId })
                    )}
                    className="flex w-full flex-col items-end space-y-5"
                  >
                    <textarea
                      id="comment"
                      rows={3}
                      className="w-full rounded-xl p-4 shadow-lg outline-none"
                      placeholder="What are your thoughts?"
                      {...register("text")}
                    />
                    {isValid && (
                      <button
                        type="submit"
                        className="flex items-center space-x-3 rounded border border-gray-300 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
                      >
                        Comment
                      </button>
                    )}
                  </form>
                  <div className="mt-10 flex flex-col items-center justify-center space-y-6">
                    {getComments.isSuccess &&
                      getComments.data.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex h-full w-full flex-col space-y-2 border-b border-gray-300 pb-4 last:border-none"
                        >
                          <div className="flex w-full items-center space-x-2">
                            <div className="relative h-8 w-8 rounded-full bg-gray-400">
                              {comment.user.image && (
                                <Image
                                  src={comment.user.image}
                                  alt={comment.user.name ?? ""}
                                  fill
                                  className="rounded-full"
                                />
                              )}
                            </div>
                            <div className="text-xs">
                              <p className="font-semibold">
                                {comment.user.name} &#x2022;
                                <span className="mx-1">
                                  {dayjs(comment.createdAt).fromNow()}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {comment.text}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentSideBar;
