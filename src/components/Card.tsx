'use client';
import { ValuesContext } from "@/context/ValuesProvider";
import React, { useContext, useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import CardData from "./card-components/CardData";
import CardHeader from "./card-components/CardHeader";


interface CardProps {
    heading: string;
    id: number;
}

const Card = ({ heading, id }: CardProps) => {
    const context = useContext(ValuesContext);

    const [data, setData] = useState<string[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const { otherCards } = context;
        setData(otherCards[id].items);
    }, [context]);


    const handleDragLeave = () => {
        setHoveredIndex(null);
    };

    const [cardScroll, setCardScroll] = useState<boolean>(false);

    useEffect(() => {
        if (data.length > 6) {
            setCardScroll(true);
        } else {
            setCardScroll(false);
        }
    }, [data]);


    return (
        <div
            className={`w-72 h-fit bg-slate-100 rounded-xl pb-5 max-h-[450px] relative`}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
        >

            <CardHeader heading={heading} id={id} />


            <div className={`mt-[50px] pt-3 max-h-[400px]  ${cardScroll ? 'overflow-y-auto' : ''}`}>

                <CardData heading={heading} id={id} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />

            </div>


            <Toaster />
        </div>

    );
};

export default Card;