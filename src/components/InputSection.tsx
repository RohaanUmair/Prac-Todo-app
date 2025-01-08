'use client'
import { ValuesContext } from "@/context/ValuesProvider";
import { FormEvent, useContext, useEffect, useState } from "react";


const InputSection = () => {
    const context = useContext(ValuesContext);

    const { otherCards, setOtherCards } = context;

    const [input, setInput] = useState<string>('');

    const [selected, setSelected] = useState<string>('To Do');
    useEffect(() => {
        setSelected(otherCards[0].heading);
    }, [context]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>, input: string) => {
        e.preventDefault();

        if (!input) return;

        setOtherCards((prevCards) => {
            const updatedCards = prevCards.map((card) => {
                if (card.heading === selected) {
                    return {
                        ...card,
                        items: [...card.items, input]
                    };
                }
                return card;
            });
            return updatedCards;
        });

        setInput('');
    }

    return (
        <form className="flex justify-center items-center gap-5 w-screen mt-12" onSubmit={(e) => handleSubmit(e, input)}>
            <input className="outline-none py-4 w-96 rounded px-5" placeholder="Type Something..." type="text" value={input} onChange={(e) => setInput(e.target.value)} />

            <select onChange={(e) => setSelected(e.target.value)} className="w-24 outline-none h-14 rounded px-2" >
                {
                    otherCards.map((card, index) => {
                        return <option key={index} value={card.heading}>{card.heading}</option>
                    })
                }
            </select>

            <button type="submit" className="py-4 px-8 bg-green-500 rounded text-white font-bold">Add</button>
        </form>
    )
}

export default InputSection;