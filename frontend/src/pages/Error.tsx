import React from "react";
import Button from "components/button/Button";

const Error = () => {
    return (
        <div
            className="
            flex
            items-center
            justify-center
          "
        >
            <div className="w-full lg:w-1/2 px-10 py-5 mb-10 mt-5 bg-zinc-700 rounded-md shadow-xl">
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-amber-300 text-9xl">404</h1>
                    <h6 className="mb-2 text-2xl font-bold text-center text-zinc-800 md:text-3xl">
                        <span className="text-amber-300">Oops!</span> Page not found
                    </h6>
                    <p className="mb-8 text-center text-zinc-500 md:text-lg">
                        The page you’re looking for doesn’t exist.
                    </p>

                    <Button href="/" useRouter={true}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Error;
