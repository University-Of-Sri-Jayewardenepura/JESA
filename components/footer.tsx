import React from "react";
import { Facebook, Twitter, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer>
      <hr />
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/images/jesa-min.png"
                width={72}
                height={20}
                alt="JESA 2024"
                className="ml-[-1rem] w-auto h-auto"
              />
              <span className="sr-only">JESA</span>
            </Link>
            <p className="max-w-xs text-sm text-slate-300">
              Career Skills Development Society • 2025/2026 <br />
              in collaboration with Career Guidance Unit of <br /> University of
              Sri Jayewardenepura Contacts
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm tracking-tighter font-medium">
                Community
              </h2>
              <ul className="gap-2 grid">
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="/chat"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="https://twitter.com/milliondotjs"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="mailto:aiden@million.dev"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm tracking-tighter font-medium">
                Legal
              </h2>
              <ul className="gap-2 grid">
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="/docs/terms"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="/docs/privacy-policy"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer duration-200 font-[450] text-sm"
                    href="/docs/code-policy"
                  >
                    Code Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md py-4 px-8 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            <Link href="https://million.dev/chat">
              <Facebook className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
              <span className="sr-only">Discord</span>
            </Link>
            <Link href="https://twitter.com/milliondotjs">
              <Twitter className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://github.com/aidenybai/million">
              <Github className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
              <span className="sr-only">Github</span>
            </Link>
          </div>
          <span className="text-sm sm:text-center">
            Copyright © 2025{" "}
            <a className="cursor-pointer" href="/">
              CDSD
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
