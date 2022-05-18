import React from "react";
// import { ReactComponent as Logo } from "images/logo.svg";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "App.css";

function App() {
    return (
        <>
            <nav id="header" className="bg-gray-900 fixed w-full z-10 top-0 shadow">
                <div className="w-full container mx-auto flex flex-wrap items-center mt-0 pt-3 pb-3 md:pb-0">
                    <div className="w-1/2 pl-2 md:pl-0">
                        <a
                            className="text-gray-100 text-base xl:text-xl no-underline hover:no-underline font-bold"
                            href={process.env.PUBLIC_URL + "/"}
                        >
                            <span>{process.env.REACT_APP_WEBSITE_NAME}</span>
                        </a>
                    </div>
                    <div className="w-1/2 pr-0">
                        <div className="flex relative inline-block float-right">
                            <div className="relative text-sm text-gray-100">
                                <button id="userButton" className="flex items-center focus:outline-none mr-3">
                                    <img
                                        className="w-8 h-8 rounded-full mr-4"
                                        src="http://i.pravatar.cc/300"
                                        alt="Avatar of User"
                                    />{" "}
                                    <span className="hidden md:inline-block text-gray-100">Hi, User</span>
                                    <svg
                                        className="pl-2 h-2 fill-current text-gray-100"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 129 129"
                                        enableBackground="new 0 0 129 129"
                                    >
                                        <g>
                                            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                                        </g>
                                    </svg>
                                </button>
                                <div
                                    id="userMenu"
                                    className="bg-gray-900 rounded shadow-md mt-2 absolute mt-12 top-0 right-0 min-w-full overflow-auto z-30 invisible"
                                >
                                    <ul className="list-reset">
                                        <li>
                                            <a
                                                href="#"
                                                className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                                            >
                                                My account
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                                            >
                                                Notifications
                                            </a>
                                        </li>
                                        <li>
                                            <hr className="border-t mx-2 border-gray-400" />
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="block lg:hidden pr-4">
                                <button
                                    id="nav-toggle"
                                    className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-100 hover:border-teal-500 appearance-none focus:outline-none"
                                >
                                    <svg
                                        className="fill-current h-3 w-3"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>Menu</title>
                                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 bg-gray-900 z-20"
                        id="nav-content"
                    >
                        <ul className="list-reset lg:flex flex-1 items-center px-4 md:px-0">
                            <li className="mr-6 my-2 md:my-0">
                                <a
                                    href="#"
                                    className="block py-1 md:py-3 pl-1 align-middle text-blue-400 no-underline hover:text-gray-100 border-b-2 border-blue-400 hover:border-blue-400"
                                >
                                    <i className="mr-3 text-blue-400">
                                        <Icon icon={["fas", "home"]} />
                                    </i>
                                    <span className="pb-1 md:pb-0 text-sm">Home</span>
                                </a>
                            </li>
                            <li className="mr-6 my-2 md:my-0">
                                <a
                                    href="#"
                                    className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-pink-400"
                                >
                                    <i className="mr-3">
                                        <Icon icon={["fas", "tasks"]} />
                                    </i>
                                    <span className="pb-1 md:pb-0 text-sm">Tasks</span>
                                </a>
                            </li>
                            <li className="mr-6 my-2 md:my-0">
                                <a
                                    href="#"
                                    className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-purple-400"
                                >
                                    <i className="fa fa-envelope fa-fw mr-3"></i>
                                    <span className="pb-1 md:pb-0 text-sm">Messages</span>
                                </a>
                            </li>
                            <li className="mr-6 my-2 md:my-0">
                                <a
                                    href="#"
                                    className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-green-400"
                                >
                                    <i className="mr-3">
                                        <Icon icon={["fas", "chart-area"]} />
                                    </i>
                                    <span className="pb-1 md:pb-0 text-sm">Analytics</span>
                                </a>
                            </li>
                            <li className="mr-6 my-2 md:my-0">
                                <a
                                    href="#"
                                    className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-100 border-b-2 border-gray-900  hover:border-red-400"
                                >
                                    <i className="fa fa-wallet fa-fw mr-3"></i>
                                    <span className="pb-1 md:pb-0 text-sm">Payments</span>
                                </a>
                            </li>
                        </ul>

                        <div className="relative pull-right pl-4 pr-4 md:pr-0">
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal"
                            />
                            <div className="absolute search-icon" style={{ top: "0.375rem", left: "1.75rem" }}>
                                <svg
                                    className="fill-current pointer-events-none text-gray-500 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Container */}
            <div className="container w-full mx-auto pt-20">
                <div className="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">
                    {/* Console Content */}

                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-green-600">
                                            <i className="fa fa-wallet fa-2x fa-fw fa-inverse"></i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">Total Revenue</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">
                                            $3249{" "}
                                            <span className="text-green-500">
                                                <i>
                                                    <Icon icon={["fas", "caret-up"]} />
                                                </i>
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-pink-600">
                                            <i>
                                                <Icon icon={["fas", "users"]} inverse={true} size="2x" />
                                            </i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">Total Users</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">
                                            249{" "}
                                            <span className="text-pink-500">
                                                <i>
                                                    <Icon icon={["fas", "exchange-alt"]} />
                                                </i>
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-yellow-600">
                                            <i>
                                                <Icon icon={["fas", "user-plus"]} inverse={true} size="2x" />
                                            </i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">New Users</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">
                                            2{" "}
                                            <span className="text-yellow-600">
                                                <i>
                                                    <Icon icon={["fas", "caret-up"]} />
                                                </i>
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-blue-600">
                                            <i>
                                                <Icon icon={["fas", "server"]} inverse={true} size="2x" />
                                            </i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">Server Uptime</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">152 days</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-indigo-600">
                                            <i>
                                                <Icon icon={["fas", "tasks"]} inverse={true} size="2x" />
                                            </i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">To Do List</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">7 tasks</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow p-2">
                                <div className="flex flex-row items-center">
                                    <div className="flex-shrink pr-4">
                                        <div className="rounded p-3 bg-red-600">
                                            <i>
                                                <Icon icon={["fas", "inbox"]} inverse={true} size="2x" />
                                            </i>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right md:text-center">
                                        <h5 className="font-bold uppercase text-gray-400">Issues</h5>
                                        <h3 className="font-bold text-3xl text-gray-600">
                                            3{" "}
                                            <span className="text-red-500">
                                                <i className="fas fa-caret-up">
                                                    <Icon icon={["fas", "caret-up"]} />
                                                </i>
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b-2 border-gray-600 my-8 mx-4" />

                    <div className="flex flex-row flex-wrap flex-grow mt-2">
                        <div className="w-full md:w-1/2 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-7"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-0"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-1"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                                </div>
                                <div className="p-5">
                                    <canvas
                                        id="chartjs-4"
                                        className="chartjs"
                                        width="undefined"
                                        height="undefined"
                                    ></canvas>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Template</h5>
                                </div>
                                <div className="p-5"></div>
                            </div>
                        </div>

                        <div className="w-full p-3">
                            <div className="bg-gray-900 border border-gray-800 rounded shadow">
                                <div className="border-b border-gray-800 p-3">
                                    <h5 className="font-bold uppercase text-gray-600">Table</h5>
                                </div>
                                <div className="p-5">
                                    <table className="w-full p-5 text-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="text-left text-gray-600">Name</th>
                                                <th className="text-left text-gray-600">Side</th>
                                                <th className="text-left text-gray-600">Role</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Obi Wan Kenobi</td>
                                                <td>Light</td>
                                                <td>Jedi</td>
                                            </tr>
                                            <tr>
                                                <td>Greedo</td>
                                                <td>South</td>
                                                <td>Scumbag</td>
                                            </tr>
                                            <tr>
                                                <td>Darth Vader</td>
                                                <td>Dark</td>
                                                <td>Sith</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p className="py-2">
                                        <a href="#" className="text-white">
                                            See More issues...
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-gray-900 border-t border-gray-400 shadow">
                <div className="container max-w-md mx-auto flex py-8">
                    <div className="w-full mx-auto flex flex-wrap">
                        <div className="flex w-full md:w-1/2 ">
                            <div className="px-8">
                                <h3 className="font-bold font-bold text-gray-100">About</h3>
                                <p className="py-4 text-gray-600 text-sm">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis
                                    tempus commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia.
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full md:w-1/2">
                            <div className="px-8">
                                <h3 className="font-bold font-bold text-gray-100">Social</h3>
                                <ul className="list-reset items-center text-sm pt-3">
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="inline-block text-gray-600 no-underline hover:text-gray-100 hover:text-underline py-1"
                                            href="#"
                                        >
                                            Add social link
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default App;
