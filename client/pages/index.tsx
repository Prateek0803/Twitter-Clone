import React, { useCallback, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiBookmark, BiHash, BiHomeCircle, BiSolidUser } from "react-icons/bi";
import { IoNotificationsSharp } from "react-icons/io5";
import { CgMail } from "react-icons/cg";
import { BsImage } from "react-icons/bs";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import {createTweet, getAllTweets} from "@/hooks/tweets"
import Image from "next/image";
import { Tweet } from "@/gql/graphql";

interface TwitterSidebarButtons {
  title: String;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButtons[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <IoNotificationsSharp />,
  },
  {
    title: "Messages",
    icon: <CgMail />,
  },
  {
    title: "Bookmark",
    icon: <BiBookmark />,
  },
  {
    title: "Profile",
    icon: <BiSolidUser />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const {tweets = []} = getAllTweets()
  const {mutate} = createTweet()
  const queryClient = useQueryClient();
  const[content,setContent] = useState("")
  const successHandler = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if (!googleToken) return toast.error("Token not found");
    const { verifyGoogleToken } = await graphqlClient.request(
      verifyUserGoogleTokenQuery,
      { token: googleToken }
    );
    toast.success("Verified");
    if (verifyGoogleToken) {
      window.localStorage.setItem("_token_twitter", verifyGoogleToken);
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    } else {
      toast.error("Failed");
    }
  }, [queryClient]);
  const errorHandler = useCallback(() => {
    toast.error("Something went wrong");
  }, []);
  const handleImageSelect = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);
  const handleCreateTweet = useCallback(() => {
    mutate({
      content
    })
  },[content])
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-8 px-4 relative">
          <div className="text-4xl hover:bg-gray-800 transition-all h-fit w-fit p-3 rounded-full">
            <FaXTwitter />
          </div>
          <div className="text-2xl mt-4 pr-5 font-semibold">
            <ul>
              {sidebarMenuItems.map((elem) => (
                <li className="flex justify-start items-center gap-2 hover:bg-gray-800 px-4 py-3 rounded-full w-fit">
                  <span>{elem.icon}</span>
                  <span>{elem.title}</span>
                </li>
              ))}
            </ul>
            <button className="bg-sky-500 p-3 rounded-full w-full mt-5 hover:bg-sky-600">
              Post
            </button>
          </div>
        </div>
        {user && user.ProfileImageUrl ? (
          <div className="absolute bottom-5 flex gap-3 px-3 py-2 text-xl bg-slate-800 rounded-full">
            <div>
              <Image
                src={user.ProfileImageUrl}
                width={50}
                height={50}
                className="rounded-full"
                alt={"user image"}
              />
            </div>
            <div className="flex items-center">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
            </div>
          </div>
        ) : null}
        <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-800">
          <div className="flex gap-4  grid-cols-12 p-4 justify-around py-4">
            <div className="col-span-1">
              {user && user.ProfileImageUrl ? (
                <Image
                  src={user.ProfileImageUrl}
                  width={50}
                  height={50}
                  className="rounded-full"
                  alt={"user image"}
                />
              ) : null}
            </div>
            <div className="col-span-11 w-full">
              <textarea
                placeholder="What's Happening?!"
                rows={4}
                className="bg-inherit w-full resize-none px-2 py-1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-between items-center px-2">
                <BsImage className="text-xl cursor-pointer" onClick={handleImageSelect}/>
                <div>
                  <button className=" bg-sky-600 px-4 py-2 rounded-full" onClick={handleCreateTweet}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) => tweet ? <FeedCard data={tweet as Tweet} key={tweet.id} /> : null)}
        </div>
        {user ? null : (
          <div className="col-span-3">
            <GoogleLogin
              onSuccess={(cred) => successHandler(cred)}
              onError={errorHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}
