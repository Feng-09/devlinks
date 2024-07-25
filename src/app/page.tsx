"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NewLinkCard from "@/components/common/newlinkcard";
import { useState, useEffect } from "react";
import { Github, ArrowRight, Youtube, Linkedin, Facebook } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

export default function Home() {
  const [user] = useAuthState(auth);
  const [linkArr, setLinkArr] = useState<
    {
      platform: string;
      link: string;
    }[]
  >([]);
  const [newPlatform, setNewPlatform] = useState("GitHub");
  const [saved, setSaved] = useState<boolean | undefined>();
  const [warn, setWarn] = useState("");
  const router = useRouter();

  if (!user) {
    return router.push("/register");
  }

  const addLink = () => {
    setLinkArr((prevArr) => [
      ...prevArr,
      {
        platform: newPlatform,
        link: "",
      },
    ]);
  };

  const saveLinksAndEmailToDatabase = async () => {
    try {
      if (saved) {
        const userRef = db.collection("users").doc(user.uid);
        await userRef.set(
          {
            email: user.email,
            links: linkArr,
          },
          { merge: true }
        );
        alert("Link added");
        router.push("/profile");
      } else {
        setSaved((a) => a);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDataFromDatabase = async () => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();
      if (userDoc) {
        const userData = userDoc.data();
        // if (userData?.links.length != 0) {
        setLinkArr(userData?.links);
        // }
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

  useEffect(() => {
    saveLinks();
  }, [saved]);

  const saveLinks = () => {
    linkArr.forEach((item) => {
      let linkTest: string = "";
      if (item.platform === "GitHub") {
        linkTest = "https://www.github.com";
      } else if (item.platform === "YouTube") {
        linkTest = "https://www.youtube.com";
      } else if (item.platform === "LinkedIn") {
        linkTest = "https://www.linkedin.com";
      } else if (item.platform === "Facebook") {
        linkTest = "https://www.facebook.com";
      } else if (item.platform === "Frontend Mentor") {
        linkTest = "https://www.frontendmentor.io";
      }
      if (item.link === "") {
        setSaved(false);
        setWarn("One or more invalid links");
      } else if (!item.link.includes(linkTest)) {
        setSaved(false);
        setWarn("One or more invalid links");
      } else {
        setSaved(true);
        router.push("/profile");
        // localStorage.setItem('linkArr', JSON.stringify(linkArr))
      }
    });
    // localStorage.setItem('linkArr', JSON.stringify(linkArr))
  };

  return (
    <main className="flex min-h-screen h-fit flex-col items-center justify-between p-4 pt-[5.625rem] bg-background-grey sm:p-6 sm:pt-[6.75rem] lg:flex-row-reverse lg:gap-6">
      <section className="flex flex-col items-center w-full h-full justify-between lg:w-3/5 bg-white">
        <section className="p-6 flex flex-col gap-10 sm:p-10 w-full">
          <header className="flex flex-col gap-y-2 mb-4">
            <h1 className="font-instrument text-2xl leading-9 font-bold text-dark-grey sm:text-[2rem]">
              Customize your links
            </h1>
            <p className="font-instrument text-grey leading-6">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
          </header>

          <section className="flex flex-col gap-6 bg-white">
            <Button
              variant="outline"
              className="font-instrument font-semibold text-purple leading-normal border-purple"
              onClick={addLink}
            >
              + Add new link
            </Button>
            <p className="text-error-red font-instrument text-sm leading-normal">
              {warn}
            </p>
            {linkArr?.length !== 0 ? (
              linkArr?.map((link, id) => {
                return (
                  <NewLinkCard
                    key={id}
                    linkNo={id + 1}
                    linkArr={linkArr}
                    setLinkArr={setLinkArr}
                    setNewPlatform={setNewPlatform}
                    saved={saved}
                  />
                );
              })
            ) : (
              <div className="px-5 py-11 flex flex-col gap-6 items-center sm:py-24">
                <Image
                  src="Group 273.svg"
                  alt="hero"
                  width={124.766}
                  height={80}
                  className="sm:scale-[2] sm:mb-12 scale"
                />
                <h1 className="font-instrument text-2xl leading-9 font-bold text-dark-grey sm:text-[2rem]">
                  Let’s get you started
                </h1>
                <p className="font-instrument text-grey leading-6 text-center sm:w-[30.5rem]">
                  Use the “Add new link” button to get started. Once you have
                  more than one link, you can reorder and edit them. We’re here
                  to help you share your profiles with everyone!
                </p>
              </div>
            )}
          </section>
        </section>

        <div className="p-4 w-full border-t border-grey">
          <Button
            className={
              "bg-purple w-full sm:w-fit sm:float-right" +
              (linkArr?.length == 0 ? " opacity-60 pointer-events-none" : "")
            }
            onClick={saveLinksAndEmailToDatabase}
          >
            Save
          </Button>
        </div>
      </section>

      <section className="hidden h-full flex-grow lg:flex items-center justify-center bg-white p-6">
        <div className="flex items-center justify-center w-[19.1875rem] h-[39.4375rem] relative">
          <Image
            src="/phone-frame.svg"
            alt="hero"
            width={307}
            height={631}
            className="absolute"
          />
          <Image
            src="/Subtract.svg"
            alt="hero"
            width={285}
            height={611}
            className="absolute"
          />
          <div className="absolute w-[14.8125rem] h-[32.125rem] flex flex-col justify-between">
            <Image
              src="/phone-profile.svg"
              alt="hero"
              width={237}
              height={158}
            />
            <div className="flex flex-col gap-5">
              {linkArr
                ?.concat(Array(5 - linkArr.length).fill(undefined))
                .map((item, id) => {
                  if (item) {
                    return (
                      <div
                        key={id}
                        className={
                          "w-full h-11 rounded flex relative px-4 py-3 gap-2 items-center text-white font-instrument" +
                          (item.platform === "GitHub"
                            ? " bg-[#1A1A1A]"
                            : item.platform === "YouTube"
                            ? " bg-[#EE3939]"
                            : item.platform === "LinkedIn"
                            ? " bg-[#2D68FF]"
                            : item.platform === "Facebook"
                            ? " bg-blue-800"
                            : item.platform === "Frontend Mentor"
                            ? " bg-blue-400"
                            : "")
                        }
                      >
                        {item.platform === "GitHub" ? (
                          <Github color="#ffffff" size={20} />
                        ) : item.platform === "YouTube" ? (
                          <Youtube color="#ffffff" size={20} />
                        ) : item.platform === "LinkedIn" ? (
                          <Linkedin color="#ffffff" size={20} />
                        ) : item.platform === "Facebook" ? (
                          <Facebook color="#ffffff" size={20} />
                        ) : item.platform === "Frontend Mentor" ? (
                          <Github color="#ffffff" size={20} />
                        ) : null}
                        <p>{item.platform}</p>
                        <ArrowRight
                          className="absolute right-4"
                          size={16}
                          color="#ffffff"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={id}
                        className="w-full h-11 rounded bg-[#EEEEEE]"
                      ></div>
                    );
                  }
                })}
              {/* {linkArr[0] ? (<div className={"w-full h-11 rounded flex relative px-4 py-3 gap-2 items-center text-white font-instrument" + (linkArr[0].platform === "GitHub" ? " bg-[#1A1A1A]" : linkArr[0].platform === "YouTube" ? " bg-[#EE3939]" : linkArr[0].platform === "LinkedIn" ? " bg-[#2D68FF]" : linkArr[0].platform === "Facebook" ? " bg-blue-800" : linkArr[0].platform === "Frontend Mentor" ? " bg-blue-400" : "")}>
                {linkArr[0].platform === "GitHub" ? (<Github color="#ffffff" size={20} />) : linkArr[0].platform === "YouTube" ? (<Youtube color="#ffffff" size={20} />): linkArr[0].platform === "LinkedIn" ? (<Linkedin color="#ffffff" size={20} />) : linkArr[0].platform === "Facebook" ? (<Facebook color="#ffffff" size={20} />) : linkArr[0].platform === "Frontend Mentor" ? (<Github color="#ffffff" size={20} />) : null}
                <p>{linkArr[0].platform}</p>
                <ArrowRight className="absolute right-4" size={16} color="#ffffff" />
              </div>) : (<div className="w-full h-11 rounded bg-[#EEEEEE]"></div>)}
              {linkArr[1] ? (<div className={"w-full h-11 rounded flex gap-2 relative items-center px-4 py-3 text-white leading-[44px] font-instrument" + (linkArr[1].platform === "GitHub" ? " bg-[#1A1A1A]" : linkArr[1].platform === "YouTube" ? " bg-[#EE3939]" : linkArr[1].platform === "LinkedIn" ? " bg-[#2D68FF]" : linkArr[1].platform === "Facebook" ? " bg-blue-800" : linkArr[1].platform === "Frontend Mentor" ? " bg-blue-400" : "")}>
                {linkArr[1].platform === "GitHub" ? (<Github color="#ffffff" size={20} />) : linkArr[1].platform === "YouTube" ? (<Youtube color="#ffffff" size={20} />): linkArr[1].platform === "LinkedIn" ? (<Linkedin color="#ffffff" size={20} />) : linkArr[1].platform === "Facebook" ? (<Facebook color="#ffffff" size={20} />) : linkArr[1].platform === "Frontend Mentor" ? (<Github color="#ffffff" size={20} />) : null}
                <p>{linkArr[1].platform}</p>
                <ArrowRight className="absolute right-4" size={16} color="#ffffff" />
              </div>) : (<div className="w-full h-11 rounded bg-[#EEEEEE]"></div>)}
              {linkArr[2] ? (<div className={"w-full h-11 rounded flex gap-2 relative items-center px-4 py-3 text-white leading-[44px] font-instrument" + (linkArr[2].platform === "GitHub" ? " bg-[#1A1A1A]" : linkArr[2].platform === "YouTube" ? " bg-[#EE3939]" : linkArr[2].platform === "LinkedIn" ? " bg-[#2D68FF]" : linkArr[2].platform === "Facebook" ? " bg-blue-800" : linkArr[2].platform === "Frontend Mentor" ? " bg-blue-400" : "")}>
                {linkArr[2].platform === "GitHub" ? (<Github color="#ffffff" size={20} />) : linkArr[2].platform === "YouTube" ? (<Youtube color="#ffffff" size={20} />): linkArr[2].platform === "LinkedIn" ? (<Linkedin color="#ffffff" size={20} />) : linkArr[2].platform === "Facebook" ? (<Facebook color="#ffffff" size={20} />) : linkArr[2].platform === "Frontend Mentor" ? (<Github color="#ffffff" size={20} />) : null}
                <p>{linkArr[2].platform}</p>
                <ArrowRight className="absolute right-4" size={16} color="#ffffff" />
              </div>) : (<div className="w-full h-11 rounded bg-[#EEEEEE]"></div>)}
              {linkArr[3] ? (<div className={"w-full h-11 rounded flex gap-2 relative items-center px-4 py-3 text-white leading-[44px] font-instrument" + (linkArr[3].platform === "GitHub" ? " bg-[#1A1A1A]" : linkArr[3].platform === "YouTube" ? " bg-[#EE3939]" : linkArr[3].platform === "LinkedIn" ? " bg-[#2D68FF]" : linkArr[3].platform === "Facebook" ? " bg-blue-800" : linkArr[3].platform === "Frontend Mentor" ? " bg-blue-400" : "")}>
                {linkArr[3].platform === "GitHub" ? (<Github color="#ffffff" size={20} />) : linkArr[3].platform === "YouTube" ? (<Youtube color="#ffffff" size={20} />): linkArr[3].platform === "LinkedIn" ? (<Linkedin color="#ffffff" size={20} />) : linkArr[3].platform === "Facebook" ? (<Facebook color="#ffffff" size={20} />) : linkArr[3].platform === "Frontend Mentor" ? (<Github color="#ffffff" size={20} />) : null}
                <p>{linkArr[3].platform}</p>
                <ArrowRight className="absolute right-4" size={16} color="#ffffff" />
              </div>) : (<div className="w-full h-11 rounded bg-[#EEEEEE]"></div>)}
              {linkArr[4] ? (<div className={"w-full h-11 rounded flex gap-2 relative items-center px-4 py-3 text-white leading-[44px] font-instrument" + (linkArr[4].platform === "GitHub" ? " bg-[#1A1A1A]" : linkArr[4].platform === "YouTube" ? " bg-[#EE3939]" : linkArr[4].platform === "LinkedIn" ? " bg-[#2D68FF]" : linkArr[4].platform === "Facebook" ? " bg-blue-800" : linkArr[4].platform === "Frontend Mentor" ? " bg-blue-400" : "")}>
                {linkArr[4].platform === "GitHub" ? (<Github color="#ffffff" size={20} />) : linkArr[4].platform === "YouTube" ? (<Youtube color="#ffffff" size={20} />): linkArr[4].platform === "LinkedIn" ? (<Linkedin color="#ffffff" size={20} />) : linkArr[4].platform === "Facebook" ? (<Facebook color="#ffffff" size={20} />) : linkArr[4].platform === "Frontend Mentor" ? (<Github color="#ffffff" size={20} />) : null}
                <p>{linkArr[4].platform}</p>
                <ArrowRight className="absolute right-4" size={16} color="#ffffff" />
              </div>) : (<div className="w-full h-11 rounded bg-[#EEEEEE]"></div>)} */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
