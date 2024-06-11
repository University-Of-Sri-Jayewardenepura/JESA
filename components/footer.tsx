import { Facebook, Instagram, Globe, Linkedin, Github } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

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

  return (
    <footer className="pt-[300px] flex justify-center items-center w-full h-20 bg-background text-white">
      <div className="pb-8 space-y-4">
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
        <div className="flex space-x-4 justify-center">
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
