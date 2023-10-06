import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
import dayjs from "dayjs";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";

type PostProps = RouterOutputs["post"]["getPosts"][number];

const Post = ({ ...post }: PostProps) => {
  const [isBookmarked, setIsBookmarked] = useState(!!post.bookmarks?.length);

  const updateBookmarkState = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: updateBookmarkState,
  });

  const unbookmarkPost = trpc.post.unbookmarkPost.useMutation({
    onSuccess: updateBookmarkState,
  });

  return (
    <div
      key={post.id}
      className="flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      <Link
        href={`/users/${post.author.username}`}
        className="group flex w-full items-center space-x-2"
      >
        <div className="relative h-10 w-10 rounded-full bg-gray-400">
          {post.author.image && (
            <Image
              src={post.author.image}
              alt={post.author.name ?? ""}
              fill
              className="rounded-full"
            />
          )}
        </div>
        <div>
          <p className="font-semibold">
            <span className="decoration-indigo-600 group-hover:underline">
              {post.author.name}
            </span>{" "}
            &#x2022;
            <span className="mx-1">
              {dayjs(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm">Founder, teacher & developer</p>
        </div>
      </Link>
      <Link
        href={`/${post.slug}`}
        className="group grid w-full grid-cols-12 gap-4"
      >
        <div className="col-span-8 space-y-4">
          <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline">
            {post.title}
          </p>
          <p className="break-words text-sm text-gray-500 line-clamp-6">
            {post.description}
          </p>
        </div>
        <div className="col-span-4">
          <div className="aspect-video h-full w-full rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
        </div>
      </Link>
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200/50 px-6 py-3">
                tag {i}
              </div>
            ))}
          </div>
          <div>
            {isBookmarked ? (
              <CiBookmarkCheck
                onClick={() => unbookmarkPost.mutate({ postId: post.id })}
                className="cursor-pointer text-3xl text-indigo-600"
              />
            ) : (
              <CiBookmarkPlus
                onClick={() => bookmarkPost.mutate({ postId: post.id })}
                className="cursor-pointer text-3xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
