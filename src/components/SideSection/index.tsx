import React from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";

const SideSection = () => {
  const getReadingList = trpc.post.getReadingList.useQuery();

  return (
    <aside className="col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might be interested in
        </h3>
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-5">
              <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
              <div>
                <div className="text-sm font-bold text-gray-900">John Doe</div>
                <div className="text-xs">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Earum, sit! Cupiditate, corporis aut?
                </div>
              </div>
              <div>
                <button className="flex items-center space-x-3 rounded border border-gray-400 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
        <div className="flex flex-col space-y-8">
          {getReadingList.isSuccess &&
            getReadingList.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                <div className="flex w-3/5 flex-col space-y-2">
                  <div className="text-lg font-semibold decoration-indigo-600 group-hover:underline">
                    {bookmark.post.title}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-5">
                    {bookmark.post.description}
                  </div>
                  <div className="flex w-full items-center space-x-4">
                    <div className="relative h-5 w-5 rounded-full bg-gray-300">
                      {bookmark.post.author.image && (
                        <Image
                          src={bookmark.post.author.image}
                          alt={bookmark.post.author.name ?? ""}
                          fill
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex">
                      <div>{bookmark.post.author.name} &#x2022;</div>
                      <div className="ml-1">
                        {dayjs(bookmark.post.createdAt).format("DD/MM/YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
};

export default SideSection;
