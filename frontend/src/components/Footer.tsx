import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-400 shadow text-gray-300">
            <div className="container max-w-lg mx-auto flex py-8">
                <div className="w-full mx-auto flex flex-wrap">
                    <div className="flex w-full md:w-1/2 ">
                        <div className="px-8">
                            <h3 className="font-bold font-bold text-gray-100">About</h3>
                            <p className="py-4 text-gray-600 text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis tempus
                                commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full md:w-1/2">
                        <div className="px-8">
                            <h3 className="font-bold font-bold text-gray-100">Links</h3>
                            <ul className="list-reset items-center text-sm pt-3">
                                <li>
                                    Author&nbsp;
                                    <a
                                        className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                        href="https://artiz.github.io/"
                                    >
                                        artiz.github.io
                                    </a>
                                </li>
                                <li>
                                    Source&nbsp;
                                    <a
                                        className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                        href="https://github.com/Buuntu/fastapi-react"
                                    >
                                        Buuntu/fastapi-react
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
