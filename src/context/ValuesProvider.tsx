'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

    
interface ContextValuesTypes {
    otherCards: { heading: string, type: string, items: any[] }[];
    setOtherCards: Dispatch<SetStateAction<{ heading: string, type: string, items: any[] }[]>>;
}



export const ValuesContext = createContext<ContextValuesTypes>({
    otherCards: [],
    setOtherCards: () => { }
});


export const ValuesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [otherCards, setOtherCards] = useState<{ heading: string, type: string, items: any[] }[]>([
        { heading: 'To Do', type: 'toDo', items: ['a', 's'] },
        { heading: 'Doing', type: 'doing', items: [] },
        { heading: 'Done', type: 'done', items: [] }
    ]);

    return (
        <ValuesContext.Provider value={{ otherCards, setOtherCards }}>
            {children}
        </ValuesContext.Provider>
    )
}
