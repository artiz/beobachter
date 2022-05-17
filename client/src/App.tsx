import React from "react";
import { ReactComponent as Logo } from "images/logo.svg";
import "App.css";

function App() {
    return (
        <div className="h-screen flex items-center">
            <div className="w-full mx-auto">
                <Logo />
            </div>

            <div className="max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-2 lg:space-y-0 mb-2 lg:mb-4">
                    <div className="w-full lg:w-1/4">
                        <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs uppercase font-light text-gray-500">Customers</div>
                                    <div className="text-xl font-bold">23</div>
                                </div>
                                <svg
                                    className="stroke-current text-gray-500"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs uppercase font-light text-gray-500">PREVIEWS</div>
                                    <div className="text-xl font-bold">45</div>
                                </div>
                                <svg
                                    className="stroke-current text-gray-500"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs uppercase font-light text-gray-500">Links</div>
                                    <div className="text-xl font-bold">4078</div>
                                </div>
                                <svg
                                    className="stroke-current text-gray-500"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" x2="21" y1="14" y2="3"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <div className="widget w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs uppercase font-light text-gray-500">Watch Time</div>
                                    <div className="text-xl font-bold">31h 2m</div>
                                </div>
                                <svg
                                    className="stroke-current text-gray-500"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
