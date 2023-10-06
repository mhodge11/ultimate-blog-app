import React from "react";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { SlShareAlt } from "react-icons/sl";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import MainLayout from "../../layouts/MainLayout";
import Avatar from "../../components/Avatar";
import Post from "../../components/Post";
import { trpc } from "../../utils/trpc";

const UserProfilePage = () => {
  const router = useRouter();

  const currentUser = useSession();

  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username }
  );

  const userPosts = trpc.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username }
  );

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          <div className="flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-md">
            <div className="relative h-44 w-full bg-gradient-to-br from-rose-100 to-teal-100">
              <div className="absolute -bottom-10 left-12">
                <div className="group relative h-28 w-28 rounded-full border-2 border-white bg-gray-100">
                  {userProfile.data?.image && (
                    <Avatar
                      src={userProfile.data.image}
                      alt={userProfile.data?.name ?? ""}
                    />
                  )}
                  {currentUser.data?.user?.id === userProfile.data?.id && (
                    <label
                      htmlFor="avatarFile"
                      className="absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full transition group-hover:bg-black/20"
                    >
                      <BiEdit className="hidden text-3xl text-white group-hover:block" />
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-12 mt-10 flex flex-col space-y-0.5 py-5">
              <div className="text-2xl font-semibold text-gray-800">
                {userProfile.data?.name}
              </div>
              <div className="text-gray-600">@{userProfile.data?.username}</div>
              <div className="text-gray-600">
                {userProfile.data?._count.posts ?? 0} Posts
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("URL copied to clipboard!");
                }}
                className="flex w-fit items-center space-x-3 rounded border border-gray-300 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
              >
                <div>Share</div>
                <div>
                  <SlShareAlt />
                </div>
              </button>
            </div>
          </div>
          <div className="my-10 w-full">
            {userPosts.isSuccess &&
              userPosts.data?.posts &&
              userPosts.data.posts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
