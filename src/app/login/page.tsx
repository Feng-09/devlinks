"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailWarn, setEmailWarn] = useState("");
  const [passWarn, setPassWarn] = useState("");

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    const regex = /\w@\w.\w/;
    const emailPass = regex.test(email);
    if (email === "" && password === "") {
      setEmailWarn("can't be empty");
      setPassWarn("please recheck");
    } else if (email === "" || password === "") {
      if (email !== "") {
        if (!emailPass) {
          setEmailWarn("invalid email");
        }
        setPassWarn("can't be empty");
      } else {
        setEmailWarn("can't be empty");
      }
    } else {
      try {
        const res = await signInWithEmailAndPassword(email, password);
        if ({ res }) {
          router.push("/");
        } else {
        }
        console.log({ res });
        setEmail("");
        setPassword("");
      } catch (e) {
        console.error(e);
      }
    }
  };
  return (
    <main className="bg-background-grey p-8 flex flex-col items-center min-h-screen h-fit gap-10 w-screen sm:justify-center">
      <header className="flex gap-2 items-center w-full sm:justify-center">
        <Image
          src="/solar_link-circle-bold.svg"
          alt="hero"
          width={40}
          height={40}
        />
        <Image src="/devlinks.svg" alt="hero" width={135} height={26.25} />
      </header>

      <section className="bg-white rounded flex flex-col gap-y-6 w-full p-4 sm:p-10 sm:w-[29.75rem] sm:h-[30.125rem]">
        <div className="flex flex-col gap-y-2 mb-4 sm:w-full">
          <h1 className="font-instrument text-2xl leading-9 font-bold text-dark-grey sm:text-[2rem]">
            Login
          </h1>
          <p className="font-instrument text-grey leading-6">
            Add your details below to get back into the app
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="email"
            className={
              "font-instrument text-xs leading-normal" +
              (emailWarn === "" ? " text-dark-grey" : " text-error-red")
            }
          >
            Email Address
          </label>
          <div className="relative w-full">
            <input
              id="email"
              required
              title=""
              placeholder="e.g. alex@email.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailWarn("");
              }}
              className="font-instrument leading-normal text-dark-grey border rounded-lg border-[#D9D9D9] py-3 px-4 pl-10 w-full focus:border-purple caret-purple inpshad"
            />
            <Image
              src="/ph_envelope-simple-fill.svg"
              alt="email"
              width={16}
              height={16}
              className="absolute top-4 left-4"
            />
            <p className="text-error-red font-instrument text-sm leading-normal absolute top-4 right-4">
              {emailWarn}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="password"
            className={
              "font-instrument text-xs leading-normal" +
              (passWarn === "" ? " text-dark-grey" : " text-error-red")
            }
          >
            Password
          </label>
          <div className="relative w-full">
            <input
              id="password"
              required
              title=""
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPassWarn("");
              }}
              className="font-instrument leading-normal text-dark-grey border rounded-lg border-[#D9D9D9] py-3 px-4 pl-10 w-full focus:border-purple caret-purple inpshad"
            />
            <Image
              src="/ph_lock-key-fill.svg"
              alt="email"
              width={16}
              height={16}
              className="absolute top-4 left-4"
            />
            <p className="text-error-red font-instrument text-sm leading-normal absolute top-4 right-4">
              {passWarn}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-purple w-full py-[0.6875rem] px-[1.6875rem] text-white font-semibold leading-normal"
          onClick={handleSignIn}
        >
          Login
        </Button>

        <p className="font-instrument text-grey leading-normal text-center">
          Don’t have an account?
          <br className="sm:hidden" />{" "}
          <span
            className="text-purple hover:cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Create account
          </span>
        </p>
      </section>
    </main>
  );
}
