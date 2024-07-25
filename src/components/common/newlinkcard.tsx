"use client";

import { Link, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Github, Youtube, Linkedin, Facebook } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

type NewLinkCardProps = {
  linkNo: number;
  linkArr: { platform: string; link: string }[];
  setLinkArr: React.Dispatch<
    React.SetStateAction<{ platform: string; link: string }[]>
  >;
  setNewPlatform: React.Dispatch<React.SetStateAction<string>>;
  saved: boolean | undefined;
};

export default function NewLinkCard({
  linkNo,
  linkArr,
  setLinkArr,
  setNewPlatform,
  saved,
}: NewLinkCardProps) {
  const [user] = useAuthState(auth);
  const [expand, setExpand] = useState(false);
  const [platformIndex, setPlatFormIndex] = useState(linkNo - 1 || 0);
  const [link, setLink] = useState("");
  const [warn, setWarn] = useState("");

  const dropdown = () => {
    setExpand((a) => !a);
  };

  if (saved === false && link === "") {
    setWarn("can't be empty");
  }

  const getDataFromDatabase = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      if (userDoc) {
        const userData = userDoc.data();
        setLink(userData?.links[linkNo - 1].link);
        return userData;
      } else {
        console.log("User data not found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      getDataFromDatabase();
    }
  }, []);

  //   useEffect(() => {
  //     if (typeof linkArr[linkNo - 1].link != "undefined") {
  //       setLink(linkArr[linkNo - 1].link);
  //     }
  //   }, [linkArr]);

  const remove = () => {
    const newArr = linkArr.filter((item, id) => {
      return id != linkNo - 1;
    });
    setLinkArr(newArr);
  };

  const platforms = [
    {
      platform: "GitHub",
      placeholder: "e.g. https://www.github.com/johnappleseed",
    },
    {
      platform: "YouTube",
      placeholder: "e.g. https://www.youtube.com/watch?v=johnappleseed",
    },
    {
      platform: "LinkedIn",
      placeholder: "e.g. https://www.linkedin.com/in/johnappleseed",
    },
    {
      platform: "Facebook",
      placeholder: "e.g. https://www.facebook.com/johnappleseed",
    },
    {
      platform: "Frontend Mentor",
      placeholder: "e.g. https://www.frontendmentor.io/johnappleseed",
    },
  ];

  setNewPlatform(platforms[linkNo].platform);

  return (
    <div className="p-5 flex flex-col gap-3 w-full bg-background-grey">
      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center">
          <div className="flex flex-col gap-1 hover:cursor-pointer">
            <div className="w-3 h-[1px] bg-grey"></div>
            <div className="w-3 h-[1px] bg-grey"></div>
          </div>
          <h2 className="font-bold font-instrument text-grey">
            Link #{linkNo}
          </h2>
        </div>
        <h2
          className="font-instrument text-grey hover:cursor-pointer"
          onClick={remove}
        >
          Remove
        </h2>
      </div>

      <div className="flex flex-col gap-2 w-full group">
        <h1 className="font-instrument text-xs leading-normal text-dark-grey">
          Platform
        </h1>
        <div className="relative w-full">
          <input
            placeholder="Choose your platform"
            value={platforms[platformIndex].platform}
            onChange={() => {}}
            className="font-instrument leading-normal text-dark-grey border rounded-lg border-[#D9D9D9] py-3 px-4 pl-10 w-full focus:border-purple caret-purple inpshad"
          />
          {platforms[platformIndex].platform === "GitHub" ? (
            <Github className="absolute top-4 left-4 w-4 h-4" />
          ) : platforms[platformIndex].platform === "YouTube" ? (
            <Youtube className="absolute top-4 left-4 w-4 h-4" />
          ) : platforms[platformIndex].platform === "LinkedIn" ? (
            <Linkedin className="absolute top-4 left-4 w-4 h-4" />
          ) : platforms[platformIndex].platform === "Facebook" ? (
            <Facebook className="absolute top-4 left-4 w-4 h-4" />
          ) : platforms[platformIndex].platform === "Frontend Mentor" ? (
            <Image
              src="/frontendmentor.svg"
              alt="frontend mentor"
              width={16}
              height={16}
              className="absolute top-4 left-4"
            />
          ) : null}
          <ChevronDown
            size={20}
            color="#633CFF"
            className="absolute top-4 right-4 hover:cursor-pointer"
            onClick={dropdown}
          />
        </div>
        <div
          className={
            "bg-white rounded flex-col gap-3 border border-[#D9D9D9] w-full px-4 py-3 overflow-hidden duration-500" +
            (!expand ? " hidden h-0" : " flex h-fit")
          }
        >
          <div
            className="flex items-center gap-3 w-full border-b border-[#D9D9D9] pb-3 hover:cursor-pointer"
            onClick={() => {
              setPlatFormIndex(0);
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1 ? { ...item, platform: "GitHub" } : item
                )
              );
              dropdown();
            }}
          >
            <Github className="w-4 h-4" />
            <p className="font-instrument text-dark-grey leading-normal flex-grow hover:text-purple">
              GitHub
            </p>
          </div>
          <div
            className="flex items-center gap-3 w-full border-b border-[#D9D9D9] pb-3 hover:cursor-pointer"
            onClick={() => {
              setPlatFormIndex(1);
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1 ? { ...item, platform: "YouTube" } : item
                )
              );
              dropdown();
            }}
          >
            <Youtube className="w-4 h-4" />
            <p className="font-instrument text-dark-grey leading-normal flex-grow hover:text-purple">
              YouTube
            </p>
          </div>
          <div
            className="flex items-center gap-3 w-full border-b border-[#D9D9D9] pb-3 hover:cursor-pointer"
            onClick={() => {
              setPlatFormIndex(2);
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1 ? { ...item, platform: "LinkedIn" } : item
                )
              );
              dropdown();
            }}
          >
            <Linkedin className="w-4 h-4" />
            <p className="font-instrument text-dark-grey leading-normal flex-grow hover:text-purple">
              LinkedIn
            </p>
          </div>
          <div
            className="flex items-center gap-3 w-full border-b border-[#D9D9D9] pb-3 hover:cursor-pointer"
            onClick={() => {
              setPlatFormIndex(3);
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1 ? { ...item, platform: "Facebook" } : item
                )
              );
              dropdown();
            }}
          >
            <Facebook className="w-4 h-4" />
            <p className="font-instrument text-dark-grey leading-normal flex-grow hover:text-purple">
              Facebook
            </p>
          </div>
          <div
            className="flex items-center gap-3 w-full border-b border-[#D9D9D9] pb-3 hover:cursor-pointer"
            onClick={() => {
              setPlatFormIndex(4);
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1
                    ? { ...item, platform: "Frontend Mentor" }
                    : item
                )
              );
              dropdown();
            }}
          >
            <Image
              src="/frontendmentor.svg"
              alt="frontend mentor"
              width={16}
              height={16}
            />
            <p className="font-instrument text-dark-grey leading-normal flex-grow hover:text-purple">
              Frontend Mentor
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h1 className="font-instrument text-xs leading-normal text-dark-grey">
          Link
        </h1>
        <div className="relative w-full">
          <input
            placeholder={platforms[platformIndex].placeholder}
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setWarn("");
              setLinkArr((prevArr) =>
                prevArr.map((item, id) =>
                  id === linkNo - 1 ? { ...item, link: link } : item
                )
              );
            }}
            className="font-instrument leading-normal text-dark-grey border rounded-lg border-[#D9D9D9] py-3 px-4 pl-10 w-full focus:border-purple caret-purple inpshad"
          />
          <Link size={16} className="absolute top-4 left-4" />
          <p className="text-error-red font-instrument text-sm leading-normal absolute top-4 right-4">
            {warn}
          </p>
        </div>
      </div>
    </div>
  );
}
