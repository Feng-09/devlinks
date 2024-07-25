"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { Github, ArrowRight, Youtube, Linkedin, Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

export default function Profile() {
  const [user] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [firstNameWarn, setFirstNameWarn] = useState("");
  const [lastNameWarn, setLastNameWarn] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [linkArr, setLinkArr] = useState<
    {
      platform: string;
      link: string;
    }[]
  >([]);
  const router = useRouter();
  const { toast } = useToast()

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

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const fileLink = URL.createObjectURL(file);
    setImageSrc(fileLink);
  };

  const saveProfileDataToDatabase = async () => {
    if (firstName === "" && lastName === "") {
      setFirstNameWarn("can't be empty");
      setLastNameWarn("can't be empty");
    }
    if (firstName === "" || lastName === "") {
      if (firstName === "") {
        setFirstNameWarn("can't be empty");
      } else {
        setLastNameWarn("can't be empty");
      }
    } else {
      try {
        const userRef = db.collection("users").doc(user?.uid);
        await userRef.set(
          {
            firstName: firstName,
            lastName: lastName,
            profilePic: imageSrc,
            // email: email,
            // links: linkArr
          },
          { merge: true }
        );
        toast({
          description: "Profile updated!"
        })
        router.push("/preview");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 pt-[5.625rem] bg-background-grey sm:p-6 sm:pt-[6.75rem] lg:flex-row-reverse lg:gap-6">
      <section className="flex flex-col items-center w-full h-full justify-between lg:w-3/5 bg-white">
        <section className="bg-white flex flex-col gap-10 p-6 sm:p-10 w-full">
          <header className="flex flex-col gap-y-2 mb-4">
            <h1 className="font-instrument text-2xl leading-9 font-bold text-dark-grey sm:text-[2rem]">
              Profile Details
            </h1>
            <p className="font-instrument text-grey leading-6">
              Add your details to create a personal touch to your profile.
            </p>
          </header>

          <section className="flex flex-col gap-6 w-full">
            <div className="p-5 bg-background-grey sm:flex sm:gap-6 sm:items-center">
              <p className="font-instrument text-grey mb-4 sm:flex-grow">
                Profile picture
              </p>
              <div className="bg-light-purple py-16 px-10 rounded-xl flex flex-col items-center justify-center gap-4 w-fit mb-6 relative overflow-hidden">
                <Image
                  src="/ph_image.svg"
                  alt="image"
                  width={40}
                  height={40}
                  className={"z-10" + (imageSrc != "" ? " lucide img" : "")}
                />
                <label
                  htmlFor="profile-picture"
                  className={
                    "font-instrument font-semibold leading-normal hover:cursor-pointer z-10" +
                    (imageSrc === "" ? " text-purple" : " text-white")
                  }
                >
                  {imageSrc === "" ? "+ Upload Image" : "Change Image"}
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/jpeg, image/png"
                  className="opacity-0 pointer-events-none absolute"
                  onChange={handleImageUpload}
                />
                {imageSrc != "" ? (
                  <Image
                    src={imageSrc}
                    alt="profile picture"
                    width={193}
                    height={193}
                    className="absolute top-0 rounded-xl w-full h-full"
                  />
                ) : null}
              </div>
              <p className="font-instrument text-xs leading-normal text-grey sm:w-32">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>

            <div className="p-5 bg-background-grey flex flex-col gap-3">
              <div className="flex flex-col gap-1 sm:w-full sm:flex-row sm:items-center relative">
                <label
                  htmlFor="first-name"
                  className="font-instrument text-xs text-dark-grey leading-normal sm:w-60"
                >
                  First name*
                </label>
                <input
                  id="first-name"
                  required
                  placeholder="Ben"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameWarn("");
                  }}
                  className="font-instrument leading-normal text-dark-grey py-3 px-4 border border-grey rounded sm:flex-grow focus:border-purple caret-purple inpshad"
                />
                <p className="text-error-red font-instrument text-sm leading-normal absolute top-4 right-4">
                  {firstNameWarn}
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:w-full sm:flex-row sm:items-center relative">
                <label
                  htmlFor="last-name"
                  className="font-instrument text-xs text-dark-grey leading-normal sm:w-60"
                >
                  Last name*
                </label>
                <input
                  id="last-name"
                  required
                  placeholder="Wright"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameWarn("");
                  }}
                  className="font-instrument leading-normal text-dark-grey py-3 px-4 border border-grey rounded sm:flex-grow focus:border-purple caret-purple inpshad"
                />
                <p className="text-error-red font-instrument text-sm leading-normal absolute top-4 right-4">
                  {lastNameWarn}
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:w-full sm:flex-row sm:items-center">
                <label
                  htmlFor="email"
                  className="font-instrument text-xs text-dark-grey leading-normal sm:w-60"
                >
                  Email
                </label>
                <input
                  id="email"
                  placeholder="ben@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="font-instrument leading-normal text-dark-grey py-3 px-4 border border-grey rounded sm:flex-grow focus:border-purple caret-purple inpshad"
                />
              </div>
            </div>
          </section>
        </section>

        <div className="p-4 w-full border-t border-grey">
          <Button
            className="bg-purple w-full sm:w-fit sm:float-right"
            onClick={saveProfileDataToDatabase}
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
          <div className="absolute w-[14.8125rem] h-[32.125rem] flex flex-col justify-start gap-12">
            <div className="w-[14.8125rem] h-[9.875rem] flex flex-col gap-6 items-center">
              <div
                className={
                  "rounded-full w-24 h-24 relative overflow-hidden" +
                  (imageSrc === ""
                    ? " bg-[#EEEEEE]"
                    : " border-2 border-purple")
                }
              >
                {imageSrc != "" ? (
                  <Image
                    src={imageSrc}
                    alt="profile picture"
                    width={193}
                    height={193}
                    className="absolute top-0 rounded-xl w-full h-full"
                  />
                ) : null}
              </div>
              <div
                className={
                  "h-4 rounded-[6.5rem] font-instrument text-lg font-semibold text-dark-grey text-center" +
                  (firstName !== "" || lastName !== ""
                    ? " w-fit"
                    : " bg-[#EEEEEE] w-40")
                }
              >
                {firstName + " " + lastName}
              </div>
              <div
                className={
                  "h-2 rounded-[6.5rem] font-instrument text-sm font-semibold text-grey text-center" +
                  (email === "" ? " bg-[#EEEEEE] w-[4.5rem]" : " w-fit")
                }
              >
                {email}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {linkArr?.map((link, id) => {
                return (
                  <div
                    key={id}
                    className={
                      "w-full h-11 rounded flex relative px-4 py-3 gap-2 items-center text-white font-instrument" +
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
    </main>
  );
}
