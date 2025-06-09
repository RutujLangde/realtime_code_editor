import React, { useState } from 'react';
// import { logo } from '../assets/image.png';
import logomain from "../assets/image.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900 shadow-lg border-b border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center">
                {/* Logo + Title */}
                <div className="flex items-center space-x-3">
                    <img src={logomain} alt="CodeSync Logo" className="h-10 w-auto" />

                    {/* <span className="text-2xl font-extrabold tracking-wide text-indigo-400">CodeSync</span> */}
                </div>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center space-x-8 text-gray-300 font-medium">
                    <li className="hover:text-indigo-400 transition duration-200 cursor-pointer text-1.5xl">About</li>
                    <li className="hover:text-indigo-400 transition duration-200 cursor-pointer text-1.5xl">Contact</li>
                </ul>

                {/* Hamburger */}
                <button
                    className="text-gray-300 md:hidden focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-3 text-gray-300 font-medium">
                    <div className="hover:text-indigo-400 cursor-pointer">About</div>
                    <div className="hover:text-indigo-400 cursor-pointer">Contact</div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
