'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";


interface ContextValuesTypes {
    toDo: string[];
    setToDo: Dispatch<SetStateAction<string[]>>;
    doing: string[];
    setDoing: Dispatch<SetStateAction<string[]>>;
    done: string[];
    setDone: Dispatch<SetStateAction<string[]>>;

    cards: { heading: string, type: string }[];
    otherCards: { heading: string, type: string, items: any[] }[];
    setOtherCards: Dispatch<SetStateAction<{ heading: string, type: string, items: any[] }[]>>;
}



export const ValuesContext = createContext<ContextValuesTypes>({
    toDo: [],
    setToDo: () => {},
    doing: [],
    setDoing: () => {},
    done: [],
    setDone: () => {},
    cards: [],
    otherCards: [],
    setOtherCards: () => {}
});


export const ValuesProvider: React.FC<{children: ReactNode}> = ({ children }) => {

    const [toDo, setToDo] = useState<string[]>([]);
    const [doing, setDoing] = useState<string[]>([]);
    const [done, setDone] = useState<string[]>([]);

    const [otherCards ,setOtherCards] = useState([])

    const cards = [
        { heading: 'To Do', type: 'toDo' },
        { heading: 'Doing', type: 'doing' },
        { heading: 'Done', type: 'done' }
    ]

    return (
        <ValuesContext.Provider value={{ toDo, setToDo, doing, setDoing, done, setDone, cards, otherCards, setOtherCards }}>
            {children}
        </ValuesContext.Provider>
    )
}

ValuesProvider;