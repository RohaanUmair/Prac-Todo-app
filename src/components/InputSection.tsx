'use client'
import { ValuesContext } from "@/context/ValuesProvider";
import { useContext, useState } from "react";

const InputSection = () => {
    const context = useContext(ValuesContext);

    const { setToDo, setDoing, setDone, otherCards, setOtherCards } = context;

    const [input, setInput] = useState<string>('');
    const [selected, setSelected] = useState<string>('toDo');

    const handleSubmit = (input: string) => {
        if (!input) return;

        if (selected === 'toDo') {
            setToDo((prev: string[]) => [...prev, input]);
        } else if (selected === 'doing') {
            setDoing((prev: string[]) => [...prev, input]);
        } else if (selected === 'done') {
            setDone((prev: string[]) => [...prev, input]);
        } else {
            setOtherCards((prevCards) => {
                const updatedCards = prevCards.map((card) => {
                    if (card.type === selected) {
                        return {
                            ...card,
                            items: [...card.items, input]
                        };
                    }
                    return card;
                });
                return updatedCards;
            });
        }

        setInput('');
    }

    return (
        <div className="flex justify-center items-center gap-5 w-screen mt-12">
            <input className="outline-none py-4 w-96 rounded px-5" placeholder="Type Something..." type="text" value={input} onChange={(e) => setInput(e.target.value)} />

            <select onChange={(e) => setSelected(e.target.value)} className="w-24 outline-none h-14 rounded px-2" >
                <option value="toDo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>

                {
                    otherCards.map((card, index) => {
                        return <option key={index} value={card.type}>{card.heading}</option>
                    })
                }
            </select>

            <button className="py-4 px-8 bg-green-500 rounded text-white font-bold" onClick={() => handleSubmit(input)}>Add</button>
        </div>
    )
}

export default InputSection;