"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Github, ArrowRight, Youtube, Linkedin, Facebook } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

export default function Preview() {
  const [user] = useAuthState(auth);
  const [linkArr, setLinkArr] = useState<
    {
      platform: string;
      link: string;
    }[]
  >([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    const linkArrJson = localStorage.getItem("linkArr");
    console.log(linkArrJson);
    if (typeof linkArrJson === "string") {
      setLinkArr(JSON.parse(linkArrJson));
      console.log(linkArr);
    }
  }, []);

  const getDataFromDatabase = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      if (userDoc) {
        const userData = userDoc.data();
        setFirstName(userData?.firstName || "");
        setLastName(userData?.lastName || "");
        setImageSrc(userData?.profilePic || "");
        setLinkArr(userData?.links);
        setEmail(userData?.email);
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
    } else {
      router.push("/login");
    }
  }, []);

  const copyToClipboard = (id: number) => {
    navigator.clipboard.writeText(linkArr[id].link);
    toast({
      description: "Copied to clipboard!"
    })
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background-grey sm:p-6">
      <div className="hidden sm:block absolute top-0 w-screen h-[22.3125rem] rounded-b-[2rem] bg-purple"></div>
      <header className="fixed top-0 py-4 px-6 flex justify-between w-full mb-[3.75rem] sm:bg-white sm:rounded-xl sm:static z-10 sm:mb-32">
        <Button
          variant="outline"
          className="font-instrument font-semibold leading-normal text-purple border-purple"
          onClick={() => router.push("/")}
        >
          Back to Editor
        </Button>
        <Button className="bg-purple text-white font-instrument font-semibold leading-normal">
          Share Link
        </Button>
      </header>

      <section className="flex flex-col gap-14 sm:bg-white rounded-3xl items-center shad px-8 py-6 sm:px-14 sm:py-12 z-10 max-sm:mt-28">
        <div className="flex flex-col gap-6 items-center">
          <Image
            src={imageSrc}
            alt="profile picture"
            width={104}
            height={104}
            className="rounded-full border-2 border-purple"
          />
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-[2rem] font-instrument text-dark-grey font-bold leading-normal">
              {firstName + " " + lastName}
            </h1>
            <p className="font-instrument text-grey leading-normal mb-8">
              {email}
            </p>
            <div className="flex flex-col gap-5">
              {linkArr?.map((link, id) => {
                return (
                  <div
                    key={id}
                    className={
                      "w-full h-11 rounded flex relative px-4 py-3 gap-2 items-center text-white font-instrument lg:w-[14.8125rem] hover:cursor-pointer hover:opacity-70" +
                      (linkArr[id].platform === "GitHub"
                        ? " bg-[#1A1A1A]"
                        : linkArr[id].platform === "YouTube"
                        ? " bg-[#EE3939]"
                        : linkArr[id].platform === "LinkedIn"
                        ? " bg-[#2D68FF]"
                        : linkArr[id].platform === "Facebook"
                        ? " bg-blue-800"
                        : linkArr[id].platform === "Frontend Mentor"
                        ? " bg-blue-400"
                        : "")
                    }
                    onClick={() => copyToClipboard(id)}
                  >
                    {linkArr[id].platform === "GitHub" ? (
                      <Github color="#ffffff" size={20} />
                    ) : linkArr[id].platform === "YouTube" ? (
                      <Youtube color="#ffffff" size={20} />
                    ) : linkArr[id].platform === "LinkedIn" ? (
                      <Linkedin color="#ffffff" size={20} />
                    ) : linkArr[id].platform === "Facebook" ? (
                      <Facebook color="#ffffff" size={20} />
                    ) : linkArr[id].platform === "Frontend Mentor" ? (
                      <Github color="#ffffff" size={20} />
                    ) : null}
                    <p>{linkArr[id].platform}</p>
                    <ArrowRight
                      className="absolute right-4"
                      size={16}
                      color="#ffffff"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Button
        variant="outline"
        className="font-instrument font-semibold leading-normal text-purple border-purple mt-20"
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem("user");
          router.push("/login");
        }}
      >
        Logout
      </Button>
    </main>
  );
}
