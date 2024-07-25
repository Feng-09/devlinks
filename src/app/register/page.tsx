"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailWarn, setEmailWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");
  const [confirmPasswordWarn, setConfirmPasswordWarn] = useState("");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    const regex = /\w@\w.\w/;
    const emailPass = regex.test(email);
    const passChars = password.split("");
    const passLength = passChars.length;
    if (email === "" && password === "") {
      setEmailWarn("can't be empty");
      setPasswordWarn("can't be empty");
      setConfirmPasswordWarn("can't be empty");
    } else if (email === "" || password === "") {
      if (email === "") {
        setEmailWarn("can't be empty");
      } else {
        setPasswordWarn("can't be empty");
      }
    } else if (passLength < 8) {
      setPasswordWarn("At least 8 characters");
    } else if (confirmPassword !== password) {
      setConfirmPasswordWarn("doesn't match");
    } else if (!emailPass) {
      setEmailWarn("invalid email");
    } else {
      try {
        const res = await createUserWithEmailAndPassword(email, password);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.push("/");
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

      <section className="bg-white rounded flex flex-col gap-y-6 w-full p-4 sm:p-10 sm:w-[29.75rem] sm:h-fit">
        <div className="flex flex-col gap-y-2 mb-4 sm:w-full">
          <h1 className="font-instrument text-2xl leading-9 font-bold text-dark-grey sm:text-[2rem]">
            Create account
          </h1>
          <p className="font-instrument text-grey leading-6">
            Let’s get you started sharing your links!
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h1 className="font-instrument text-xs leading-normal text-dark-grey">
            Email Address
          </h1>
          <div className="relative w-full">
            <input
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
          <h1 className="font-instrument text-xs leading-normal text-dark-grey">
            Create password
          </h1>
          <div className="relative w-full">
            <input
              placeholder="At least 8 characters"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordWarn("");
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
              {passwordWarn}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h1 className="font-instrument text-xs leading-normal text-dark-grey">
            Confirm password
          </h1>
          <div className="relative w-full">
            <input
              placeholder="At least 8 characters"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordWarn("");
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
              {confirmPasswordWarn}
            </p>
          </div>
        </div>

        <p className="font-instrument text-xs leading-normal text-grey">
          Password must contain at least 8 characters
        </p>

        <Button
          className="bg-purple w-full py-[0.6875rem] px-[1.6875rem] text-white font-semibold leading-normal"
          onClick={handleSignUp}
        >
          Create new account
        </Button>

        <p className="font-instrument text-grey leading-normal text-center">
          Already have an account?
          <br className="sm:hidden" />{" "}
          <span
            className="text-purple hover:cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </section>
    </main>
  );
}
