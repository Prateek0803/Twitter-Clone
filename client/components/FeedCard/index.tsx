import React, { useState } from "react";
import Image from "next/image";
import { TbMessageCircle } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";
import { AiOutlineUpload } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import { likeTweet } from "@/hooks/tweets";
import { GoHeartFill } from "react-icons/go";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const [liked, setLiked] = useState(data.likes ? true : false);
  const { mutate } = likeTweet();
  const likeHandler = (id: string) => {
    mutate({
      id: id,
    });
    setLiked(true)
  };
  return (
    <div className="p-4 hover:bg-slate-800 border-gray-600 border-t-[1px] border-l-0 border-r-0 border-b-0 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.author?.ProfileImageUrl && (
            <Image
              src={data.author?.ProfileImageUrl}
              alt="user-image"
              height={50}
              width={50}
              className="rounded-full"
            />
          )}
        </div>
        <div className="col-span-11">
          <h5>
            {data.author?.firstName} {data.author?.lastName}
          </h5>
          <p>{data.content}</p>
          <div className="flex justify-between mt-5 text-xl items-center px-10 mr-4">
            <div>
              <TbMessageCircle />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div className="flex gap-2">
              {liked ? (
                <GoHeartFill
                  className="text-red-800"
                  onClick={() => likeHandler(data.id)}
                />
              ) : (
                <FaRegHeart onClick={() => likeHandler(data.id)} />
              )}
              <span className="text-sm">{data.likes}</span>
            </div>
            <div>
              <AiOutlineUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
