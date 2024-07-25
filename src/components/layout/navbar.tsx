"use client";

import Image from "next/image";
import { Link, CircleUserRound, Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/" || pathname === "/profile")
    return (
      <div className="w-screen p-4 pl-6 flex justify-between items-center fixed top-0 sm:px-12 sm:pt-10 sm:pb-6 bg-white z-50">
        <div className="flex gap-2">
          <Image
            src="solar_link-circle-bold.svg"
            alt="hero"
            width={32}
            height={32}
          />
          <Image
            src="/devlinks.svg"
            alt="logo"
            width={108}
            height={21}
            className="hidden sm:block"
          />
        </div>

        <div className="flex justify-center items-center gap-0">
          <div
            className={
              "rounded py-[0.6875rem] px-[1.6875rem] flex gap-2 hover:cursor-pointer group" +
              (pathname === "/" ? " bg-light-purple" : "")
            }
            onClick={() => router.push("/")}
          >
            <Link
              size={20}
              className={pathname === "/" ? "lucidecurrent" : "lucide"}
            />
            <p
              className={
                "hidden font-instrument font-semibold leading-normal sm:inline group-hover:text-purple" +
                (pathname === "/" ? " text-purple" : " text-grey")
              }
            >
              Links
            </p>
          </div>
          <div
            className={
              "rounded py-[0.6875rem] px-[1.6875rem] flex gap-2 hover:cursor-pointer group" +
              (pathname === "/profile" ? " bg-light-purple" : "")
            }
            onClick={() => router.push("/profile")}
          >
            <CircleUserRound
              size={20}
              className={pathname === "/profile" ? "lucidecurrent" : "lucide"}
            />
            <p
              className={
                "hidden font-instrument font-semibold leading-normal sm:inline group-hover:text-purple" +
                (pathname === "/profile" ? " text-purple" : " text-grey")
              }
            >
              Profile Details
            </p>
          </div>
        </div>

        <div
          className="py-[0.6875rem] px-4 rounded border border-purple hover:bg-light-purple hover:cursor-pointer"
          onClick={() => router.push("/preview")}
        >
          <Eye size={20} color="#633CFF" className="sm:hidden" />
          <p className="hidden font-instrument font-semibold leading-normal sm:inline text-purple">
            Preview
          </p>
        </div>
      </div>
    );
}
