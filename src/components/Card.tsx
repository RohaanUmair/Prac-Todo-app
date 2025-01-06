'use client'
import { ValuesContext } from "@/context/ValuesProvider";
import { useContext, useEffect, useState } from "react";
import { TbDots } from "react-icons/tb";


interface CardProps {
    type: string;
    heading: string;
}

const Card = ({ type, heading }: CardProps) => {

    const context = useContext(ValuesContext);

    const [data, setData] = useState<string[]>([]);


    useEffect(() => {
        if (type === 'toDo') {
            const { toDo } = context;
            setData(toDo);
        } else if (type === 'doing') {
            const { doing } = context;
            setData(doing);
        } else if (type === 'done') {
            const { done } = context;
            setData(done);
        }
    }, [context]);


    return (
        <div className="w-80 h-fit bg-slate-100 rounded-xl pb-5">
            <div className="flex justify-between px-4 items-center py-3 border-b mb-5">
                <h3 className="text-gray-700 font-bold">{heading}</h3>
                <TbDots className="text-lg" />
            </div>

            {
                data.map((item: string, index: number) => (
                    <div key={index} className="bg-white border shadow w-[80%] mx-auto rounded-lg py-2 my-2 px-4 overflow-hidden">
                        <p className="text-gray-700">{item}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Card;