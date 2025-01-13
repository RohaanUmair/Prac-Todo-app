import { ValuesContext } from '@/context/ValuesProvider';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MdAddCircleOutline, MdDeleteForever, MdEdit } from 'react-icons/md';
import { RiDragDropLine } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';
import SortableItem from '../SortableItem';

const CardData = ({ heading, id, hoveredIndex, setHoveredIndex }: { heading: string, id: number, hoveredIndex: number | null, setHoveredIndex: any }) => {
    const context = useContext(ValuesContext);

    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
        const { otherCards } = context;
        setData(otherCards[id].items);
    }, [context]);

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setHoveredIndex(null);

        const { otherCards, setOtherCards } = context;

        const draggedItem = e.dataTransfer.getData('item');
        const sourceCard = e.dataTransfer.getData('sourceCard');


        if (sourceCard === heading) {
            const updatedItems = [...data];
            const draggedIndex = updatedItems.indexOf(draggedItem);

            if (draggedIndex !== -1) {
                updatedItems.splice(draggedIndex, 1);
            }

            updatedItems.splice(dropIndex, 0, draggedItem);

            setData(updatedItems);

            setOtherCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.heading == heading) {
                        return { ...card, items: updatedItems };
                    } else {
                        return card;
                    }
                }
                )
            );
            return;
        }

        const updatedSourceCard = otherCards.find((card) => card.heading === sourceCard);
        const updatedTargetCard = otherCards.find((card) => card.heading === heading);

        if (updatedSourceCard && updatedTargetCard) {
            const sourceItems = updatedSourceCard.items.filter((item) => item !== draggedItem);
            const targetItems = [...updatedTargetCard.items];

            targetItems.splice(dropIndex, 0, draggedItem);

            setOtherCards((prevCards) =>
                prevCards.map((card) => {
                    if (card.heading === sourceCard) {
                        return { ...card, items: sourceItems };
                    }
                    if (card.heading === heading) {
                        return { ...card, items: targetItems };
                    }
                    return card;
                })
            );
        }
    };

    const handleDragStart = (e: React.DragEvent, item: string) => {
        e.dataTransfer.setData('item', item);
        e.dataTransfer.setData('sourceCard', heading);
    };

    const handleDragOver = (e: React.DragEvent, index: number | null) => {
        e.preventDefault();
        setHoveredIndex(index);
    };

    const handleDragLeave = () => {
        setHoveredIndex(null);
    };

    const handleItemDelete = (index: number) => {
        const { setOtherCards } = context;

        const notify = () => toast.success('Deleted!');
        notify();

        const updatedItems = [...data];
        updatedItems.splice(index, 1);

        setOtherCards((prevCards) =>
            prevCards.map((card) => {
                if (card.heading === heading) {
                    return { ...card, items: updatedItems };
                }

                return card;
            })
        );


    }

    const inp = useRef<HTMLInputElement | null>(null);

    const [inpVal, setInpVal] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleItemEdit = (index: number) => {
        setInpVal(data[index]);
        setEditingIndex(index);

        inp.current?.focus();
    }

    const handleEditSave = (index: number) => {
        const updatedItems = [...data];

        if (inp.current?.value == '') {
            updatedItems.splice(index, 1, `Task ${index + 1}`);
        } else {
            updatedItems.splice(index, 1, inp.current?.value as string);
        }

        const { setOtherCards } = context;

        setOtherCards((prevCards) =>
            prevCards.map((card) => {
                if (card.heading === heading) {
                    return { ...card, items: updatedItems };
                }

                return card;
            })
        );

        const notify = () => toast.success('Updated!');
        notify();

        setEditingIndex(null);
    }

    const handleAddItem = () => {
        const { setOtherCards } = context;

        const updatedItems = [...data, `Task ${data.length + 1}`];

        setOtherCards((prevCards) =>
            prevCards.map((card) => {
                if (card.heading === heading) {
                    return { ...card, items: updatedItems };
                }

                return card;
            })
        );
    };

    const [lastY, setLastY] = useState(0);
    const [mouseMove, setMouseMove] = useState<'up' | 'down'>('up');

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const currentY = event.clientY;

            if (currentY > lastY) {
                setMouseMove('down');
            } else if (currentY < lastY) {
                setMouseMove('up');
            }

            setLastY(currentY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [lastY]);

    const reorderList = (e) => {
        if (!e.over) return;
    
        if (e.active.id !== e.over.id) {
          setData((gamesList) => {
            const oldIdx = gamesList.indexOf(e.active.id.toString());
            const newIdx = gamesList.indexOf(e.over!.id.toString());
            return arrayMove(gamesList, oldIdx, newIdx);
          });
        }
      };

    return (
        <DndContext onDragEnd={reorderList}>
            <SortableContext items={data}>
                {
                    data.map((item: string, index: number) => (
                        <SortableItem key={item} >
                            {/* <div key={index} className="w-[80%] mx-auto">
                                {hoveredIndex === index ? (
                                    <div
                                        className={` my-2 flex bg-transparent justify-between rounded-lg  cursor-grab items-center ${mouseMove == 'up' ? "flex-col" : "flex-col-reverse"}`}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                    >


                                        <div className="h-10 rounded bg-black w-full -z-10"></div>

                                        <div className="h-1/2 w-full bg-white py-2 px-4 rounded">
                                            <p className="text-gray-700 font-semibold">{item}</p>
                                        </div>


                                    </div>
                                ) : (
                                    <div
                                        className="bg-white border my-2 shadow flex justify-between rounded-lg py-2 px-4 cursor-grab items-center"
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                    >
                                        {editingIndex === index ? (
                                            <input
                                                ref={inp}
                                                className="text-gray-700 font-semibold border-b-2 border-black px-3 bg-gray-200 w-full outline-none"
                                                value={inpVal}
                                                onChange={(e) => setInpVal(e.target.value)}
                                                onBlur={() => handleEditSave(index)}
                                            />
                                        ) : (
                                            <p className="text-gray-700 font-semibold">{item}</p>
                                        )}
                                        <div className="flex gap-1 cursor-default">
                                            <div
                                                onClick={() =>
                                                    editingIndex === null ? handleItemEdit(index) : handleEditSave(index)
                                                }
                                                className="h-6 w-6 shadow bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer"
                                            >
                                                {editingIndex === index ? <TiTick /> : <MdEdit />}
                                            </div>

                                            {
                                                editingIndex != index &&

                                                <div
                                                    onClick={() => handleItemDelete(index)}
                                                    className="h-6 w-6 shadow bg-red-500 text-white rounded-full flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95"
                                                >
                                                    <MdDeleteForever />
                                                </div>
                                            }

                                        </div>
                                    </div>
                                )}
                            </div> */}
                            {item}
                        </SortableItem>
                    ))

                }

                {
                    hoveredIndex === data.length ? (
                        <div
                            className="w-[80%] mx-auto h-10 bg-gray-300 border-dashed border-2 border-gray-300 my-2 rounded"
                            onDragOver={(e) => handleDragOver(e, data.length)}
                            onDrop={(e) => handleDrop(e, data.length)}
                        ></div>
                    ) : (

                        <div
                            onClick={handleAddItem}
                            className="w-[80%] mx-auto h-10 border-dashed border-2 border-gray-300 my-2 rounded flex items-center px-4 hover:bg-zinc-300 text-zinc-500 cursor-pointer hover:justify-center transition-all hover:text-[17px] hover:text-black "
                            onDragOver={(e) => handleDragOver(e, data.length)}
                            onDrop={(e) => handleDrop(e, data.length)}
                        >
                            <h1 className=" font-bold flex items-center justify-between w-full">
                                <span className="flex items-center gap-2">Add <MdAddCircleOutline /></span>
                                <span className="flex items-center gap-2 text-[15px]">or Drag Here<RiDragDropLine /></span>
                            </h1>
                        </div>
                    )
                }
            </SortableContext>
        </DndContext>
    )
}

export default CardData;

