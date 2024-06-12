import {
  Facebook,
  Instagram,
  Globe,
  Linkedin,
  Github,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { zodiak } from "@/app/fonts";

export function Footer() {
  const socialIcons = [
    { link: "http://careerskills.sjp.ac.lk/", icon: Globe },
    { link: "https://facebook.com/jesa2022", icon: Facebook },
    { link: "https://www.instagram.com/jesa_2023/", icon: Instagram },
    {
      link: "https://www.linkedin.com/showcase/j-pura-employability-skills-awards/",
      icon: Linkedin,
    },
  ];

  const contactNames = [
    {
      name: "Naveen Hewage",
      phone: "+94711766662",
      linkedin: "https://www.linkedin.com/in/naveen-hewage/",
    },
    {
      name: "Induwara Gamage",
      phone: "+94718938256",
      linkedin: "https://www.linkedin.com/in/induwara-gamage/",
    },
  ];

  return (
    <footer className="pt-[300px] flex justify-center items-center w-full h-20 bg-background text-white">
      <div className="pb-8 space-y-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-16" />{" "}
        <div className="space-y-6">
          {" "}
          <h2 className="sr-only">Institutions</h2>
          <div className="flex justify-center items-center space-x-4">
            <Image
              alt=""
              src="/images/usjp.jpg"
              width={75}
              height={75}
              className="select-none pointer-events-none"
            />
            <Image
              alt=""
              src="/images/csds.png"
              width={75}
              height={75}
              className="select-none pointer-events-none"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center px-2">
            <span className={`${zodiak.className} font-bold`}>
              Career Skills Development Society
            </span>{" "}
            &#x2022; 2024 <br />
            in collaboration with Career Guidance Unit of{" "}
            <span className={`${zodiak.className} font-bold`}>
              University of Sri Jayewardenepura
            </span>
          </p>
        </div>
        <div className="space-y-6">
          {" "}
          <h2 className="sr-only">Contacts</h2>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-center">Contact Us</h3>
            <p className="text-sm text-muted-foreground text-center">
              For more details, please reach out to us at:
            </p>
            <div className="flex flex-col justify-center items-center space-x-2">
              {contactNames.map((contact, index) => (
                <div
                  className="flex flex-col gap-2 place-items-center"
                  key={index}
                >
                  <span className="text-sm text-muted-foreground">
                    {contact.name}
                  </span>
                  <span className="flex gap-2">
                    <Link href={contact.linkedin}>
                      <Button
                        className="border-muted-foreground "
                        variant="outline"
                        size="sm"
                      >
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </Link>
                    <Link href={`tel:${contact.phone}`}>
                      <Button
                        className="border-muted-foreground "
                        variant="outline"
                        size="sm"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="w-full h-px bg-primary-to-r from-transparent via-primary to-transparent" />
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2024 Career Skills Development Society
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Proudly Open Sourced on{" "}
            <Link
              href={"https://github.com/University-Of-Sri-Jayewardenepura/jesa"}
              target="_blank"
              className="hover:underline font-semibold"
            >
              GitHub &nbsp;
              <Github className="inline-flex align-center" size={16} />
            </Link>
          </p>
        </div>
        <div className="flex space-x-4 justify-center">
          <h2 className="sr-only">Social Icons</h2>
          {socialIcons.map((socialIcon, index) => (
            <Link
              key={index}
              href={socialIcon.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="text-primary/75 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
                variant="outline"
                size="icon"
              >
                <socialIcon.icon size={24} />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
