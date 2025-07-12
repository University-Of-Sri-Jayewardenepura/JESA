"use client";

import React from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { contactNames } from "@/constants/contacts";

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
                alt="JESA 2025"
                className="ml-[-1.2rem] mt-[-1.6rem] w-auto h-auto"
              />
              <span className="sr-only">JESA</span>
            </Link>
            <div className="flex justify-start items-center space-x-2">
              <Image
                alt="USJP Logo"
                src="/images/usjp.jpg"
                width={40}
                height={40}
                className="select-none pointer-events-none"
              />
              <Image
                alt="CSDS Logo"
                src="/images/csds.png"
                width={40}
                height={40}
                className="select-none pointer-events-none"
              />
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              Career Skills Development Society • 2025/2026 <br />
              in collaboration with Career Guidance Unit of <br /> University of
              Sri Jayewardenepura Contacts
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 tracking-tighter font-medium">Contacts</h2>
              <ul className="gap-4 grid">
                {contactNames.map((contact, index) => (
                  <li key={index}>
                    <Link
                      className="cursor-pointer duration-200 text-slate-500"
                      href={contact.linkedin}
                    >
                      {contact.name}
                    </Link>{" "}
                    <br />
                    <Link
                      className="cursor-pointer duration-200 text-slate-700"
                      href={`tel:${contact.phone}`}
                    >
                      {contact.phone}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-6 tracking-tighter font-medium">Show</h2>
              <ul className="gap-4 grid">
                <li>
                  <Link
                    className="cursor-pointer duration-200 text-slate-500"
                    href="awards"
                  >
                    Awards{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="cursor-pointer duration-200 text-slate-500"
                    href="/hall-of-fame"
                  >
                    Hall of Fame{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="cursor-pointer duration-200 text-slate-500"
                    href="/terms"
                  >
                    Terms & Conditions{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between rounded-md py-4 px-8 gap-4">
          <span className="text-sm text-slate-500 sm:text-center">
            Copyright © 2025{" "}
            <a className="cursor-pointer" href="/">
              CDSD
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            <Link href="https://facebook.com/jesa2022" target="_blank">
              <Facebook className="h-6 w-6 text-gray-100 hover:text-gray-300 transition-colors" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://www.linkedin.com/showcase/j-pura-employability-skills-awards/"
              target="_blank"
            >
              <Linkedin className="h-6 w-6 text-gray-100 hover:text-gray-300 transition-colors" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://www.instagram.com/jesa_2023/" target="_blank">
              <Instagram className="h-6 w-6 text-gray-100 hover:text-gray-300 transition-colors" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
