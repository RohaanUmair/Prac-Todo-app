'use client'
import InputSection from "@/components/InputSection";
import Card from "@/components/Card";
import { ValuesContext } from "@/context/ValuesProvider";
import React, { useContext, useState } from "react";


import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Droppable from "@/components/prac/Droppable";

import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

const removeAtIndex = (array, index) => {
    return [...array.slice(0, index), ...array.slice(index + 1)];
};

const insertAtIndex = (array, index, item) => {
    return [...array.slice(0, index), item, ...array.slice(index)];
};

const arrayMove = (array, oldIndex, newIndex) => {
    return dndKitArrayMove(array, oldIndex, newIndex);
};



export default function Prac() {
    const [items, setItems] = useState({
        group1: ["1", "2", "3"],
        group2: ["4", "5", "6"],
        group3: ["7", "8", "9"]
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragOver = ({ over, active }) => {
        const overId = over?.id;

        if (!overId) {
            return;
        }

        const activeContainer = active.data.current.sortable.containerId;
        const overContainer = over.data.current?.sortable.containerId;

        if (!overContainer) {
            return;
        }

        if (activeContainer !== overContainer) {
            // setItems((items) => {
            //     const activeIndex = active.data.current.sortable.index;
            //     const overIndex = over.data.current?.sortable.index || 0;

            setOtherCards((itemss) => {
                const activeIndex = active.data.current.sortable.index;
                const overIndex = over.data.current?.sortable.index || 0;

                const activeContainer = active.data.current.sortable.containerId;
                const overContainer = over.data.current?.sortable.containerId || over.id;

                const items = moveBetweenContainers(itemss, activeContainer, activeIndex, overContainer, overIndex, active.id);

                // return arrayMove(
                //     items,
                //     activeIndex,
                //     overIndex
                // );

                // return moveBetweenContainers(
                //     items,
                //     activeContainer,
                //     activeIndex,
                //     overContainer,
                //     overIndex,
                //     active.id
                // );

                return moveBetweenContainers(
                    items,
                    activeContainer,
                    activeIndex,
                    overContainer,
                    overIndex,
                    active.id
                );
            })
            // });
        }
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            const activeContainer = active.data.current.sortable.containerId;
            const overContainer = over.data.current?.sortable.containerId || over.id;
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current?.sortable.index || 0;

            setItems((items) => {
                let newItems;
                if (activeContainer === overContainer) {
                    newItems = {
                        ...items,
                        [overContainer]: arrayMove(
                            items[overContainer],
                            activeIndex,
                            overIndex
                        )
                    };
                } else {
                    newItems = moveBetweenContainers(
                        items,
                        activeContainer,
                        activeIndex,
                        overContainer,
                        overIndex,
                        active.id
                    );
                }

                return newItems;
            });
        }
    };

    const moveBetweenContainers = (
        items,
        activeContainer,
        activeIndex,
        overContainer,
        overIndex,
        item
    ) => {
        return {
            ...items,
            [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
            [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
        };
    };

    const containerStyle = { display: "flex" };



    const { otherCards, setOtherCards } = useContext(ValuesContext);


    const [heading, setHeading] = useState('');
    const [showForm, setShowForm] = useState(false);


    const handleNewCard = () => {
        if (!heading) return;

        const newCard = {
            heading: heading,
            type: heading,
            items: []
        }

        for (let i = 0; i < otherCards.length; i++) {
            if (otherCards[i].heading == heading) {
                alert('Card already exists');
                return;
            }
        }
        setOtherCards((prevCards) => [...prevCards, newCard]);
        setHeading('');
    }

    return (
        // <div className="h-screen bg-zinc-300 pl-12 overflow-x-auto min-w-full w-max overflow-hidden">
        //     <InputSection />

        //     <div className="flex gap-5 mt-16 w-full">
        //         {
        //             otherCards.map((card, index) => {
        //                 return <Card key={index} id={index} heading={card.heading} type={card.type} />
        //             })
        //         }

        //         <div className="h-fit flex flex-col mr-5">
        //             {
        //                 showForm &&
        //                 <input type="text" placeholder="Heading" className="py-3 rounded-t outline-none px-5 w-52" onChange={(e) => setHeading(e.target.value)} />
        //             }
        //             <button onClick={() => {
        //                 handleNewCard();
        //                 setShowForm(!showForm);
        //             }} className={`bg-green-600 text-white py-3 shadow shadow-white outline-none cursor-pointer hover:bg-green-700 rounded-b px-8 w-52 ${showForm ? 'rounded-b' : 'rounded'}`}>{
        //                     showForm ? heading ? 'Add Card +' : 'Back' : 'New Card'
        //                 }
        //             </button>
        //         </div>
        //     </div>

        // </div>

        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div style={containerStyle}>
                {
                    otherCards.map((obj) => {
                        return <Droppable id={obj.heading} items={obj.items} key={obj.heading} />
                    })
                }
            </div>
        </DndContext>
    )
}
