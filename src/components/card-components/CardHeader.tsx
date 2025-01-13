import { ValuesContext } from '@/context/ValuesProvider';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { MdDeleteForever, MdDeleteSweep } from 'react-icons/md';
import { TbDots } from 'react-icons/tb';

const CardHeader = ({ heading, id }: { heading: string, id: number }) => {
    const context = useContext(ValuesContext);

    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const deleteAllItems = () => {
        const { setOtherCards } = context;
        const notify = () => toast.success('All Deleted!');
        notify();

        setOtherCards((prevCards) =>
            prevCards.map((card) => {
                if (card.heading === heading) {
                    return { ...card, items: [] };
                }

                return card;
            }));
    }

    const deleteCard = () => {
        const { setOtherCards } = context;

        const notify = () => toast.success('Card Deleted!');
        notify();

        setOtherCards((prevCards) => prevCards.filter((card) => card.heading !== heading));
    }

    return (
        <div className="flex justify-between px-4 items-center py-3 border-b mb-5 bg-slate-100 w-72 absolute rounded-t-xl">
            <h3 className="text-gray-700 font-bold">{heading}</h3>
            <div className={`w-6 h-6 rounded-sm flex justify-center items-center cursor-pointer ${openMenu ? 'bg-gray-300' : ''}`} onClick={() => setOpenMenu(!openMenu)}>
                {
                    openMenu ? (
                        <>
                            <IoClose className="text-lg" />
                            <div className="relative">
                                <ul className="absolute !w-36 top-4 text-sm right-0 font-semibold bg-white shadow-2xl rounded-lg p-2">
                                    <li
                                        className="cursor-pointer hover:bg-gray-200 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1 border-b"
                                        onClick={() => deleteAllItems()}
                                    >
                                        Delete All <MdDeleteSweep className="text-xl text-red-600" />
                                    </li>
                                    {
                                        id > 2 && (
                                            <li
                                                className="cursor-pointer hover:bg-gray-200 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1"
                                                onClick={deleteCard}
                                            >
                                                Delete Card <MdDeleteForever className="text-xl text-red-800" />
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </>
                    ) : (
                        <TbDots className="text-lg" />
                    )
                }
            </div>
        </div>
    )
}

export default CardHeader;