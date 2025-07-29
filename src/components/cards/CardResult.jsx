import { MoreHorizontal, Share2 } from "lucide-react";
import PropTypes from "prop-types";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function CardResult({ src, onClick, onClickMore, onShare }) {
    const handleShareClick = () => {
        if (onShare) {
            onShare();
        }
    };

    return (
        <div 
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group aspect-square"
            onClick={onClick}
        >
            {/* Image */}
            <img
                src={src}
                alt="Result"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay saat hover */}
            <div className="absolute inset-0 transition-opacity duration-300 bg-black opacity-0 bg-opacity-30 group-hover:opacity-100" />

            {/* Dropdown Menu dengan Headless UI */}
            <div className="absolute top-2 right-2">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClickMore) {
                                onClickMore();
                            }
                        }}
                        className="p-1 transition-opacity duration-300 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <MoreHorizontal className="w-5 h-5 text-gray-800" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-1 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg w-36 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShareClick();
                                            }}
                                            className={`${
                                                active ? 'bg-gray-50' : ''
                                            } flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg`}
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Bagikan
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}

CardResult.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onClickMore: PropTypes.func,
    onShare: PropTypes.func,
};