import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <hr />
            <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
                <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
                    <div className="mb-12 flex-col flex gap-4">
                        <a className="flex items-center gap-2" href="/">
                            <span>Logo</span>
                        </a>
                        <p className="max-w-xs">Identify and fix slow code–in minutes, not months.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm tracking-tighter font-medium">Community</h2>
                            <ul className="gap-2 grid">
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="/chat">Discord</a></li>
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="https://twitter.com/milliondotjs">Twitter</a></li>
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="mailto:aiden@million.dev">Email</a></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm tracking-tighter font-medium">Legal</h2>
                            <ul className="gap-2 grid">
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="/docs/terms">Terms of Service</a></li>
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="/docs/privacy-policy">Privacy Policy</a></li>
                                <li><a className="cursor-pointer duration-200 font-[450] text-sm" href="/docs/code-policy">Code Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between rounded-md py-4 px-8 gap-2">
                    <div className="flex space-x-5 sm:justify-center sm:mt-0">
                        <a href="https://million.dev/chat">
                            <span className="sr-only">Discord</span>
                        </a>
                        <a href="https://twitter.com/milliondotjs">
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a href="https://github.com/aidenybai/million">
                            <span className="sr-only">Github</span>
                        </a>
                    </div>
                    <span className="text-sm sm:text-center">
                        Copyright © 2025 <a className="cursor-pointer" href="/">Million Software, Inc</a>. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;