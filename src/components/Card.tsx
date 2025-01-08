'use client';
import { ValuesContext } from "@/context/ValuesProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdAddCircleOutline, MdDeleteForever, MdDeleteSweep, MdEdit } from "react-icons/md";
import { RiDragDropLine } from "react-icons/ri";
import { TbDots } from "react-icons/tb";
import { TiTick } from "react-icons/ti";

interface CardProps {
  type: string;
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

  const handleItemEdit = (index: number) => {
    const updatedItems = [...data];
    updatedItems.splice(index, 1, <input className="outline outline-1 w-full" ref={inp} /> as unknown as string);

    if (inp.current) {
      inp.current.focus();
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
  }

  const handleEditSave = (index: number) => {
    const updatedItems = [...data];
    updatedItems.splice(index, 1, inp.current?.value as string);

    const { setOtherCards } = context;

    setOtherCards((prevCards) =>
      prevCards.map((card) => {
        if (card.heading === heading) {
          return { ...card, items: updatedItems };
        }

        return card;
      })
    );
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

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const deleteAllItems = () => {
    const { setOtherCards } = context;

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

    setOtherCards((prevCards) => prevCards.filter((card) => card.heading !== heading));
  }

  return (
    <div
      className="w-72 h-fit bg-slate-100 rounded-xl pb-5"
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
    >
      <div className="flex justify-between px-4 items-center py-3 border-b mb-5">
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

      {data.map((item: string, index: number) => (
        <div key={index} className="w-[80%] mx-auto">
          {hoveredIndex === index ? (
            <div
              className={`bg-gray-300 my-2 border flex flex-col justify-between shadow rounded-lg  cursor-grab items-center`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="h-10 rounded bg-black"></div>

              <div className="h-1/2 w-full bg-white py-2 px-4 rounded">
                <p className="text-gray-700">{item}</p>
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
              <p className="text-gray-700 font-semibold">{item}</p>
              <div className="flex gap-1 cursor-default">
                <div
                  onClick={() =>
                    typeof item === 'string' ? handleItemEdit(index) : handleEditSave(index)
                  }
                  className="h-6 w-6 shadow bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer">
                  {
                    typeof item === 'string' ?
                      <MdEdit /> : <TiTick />
                  }
                </div>

                <div
                  onClick={() => handleItemDelete(index)}
                  className="h-6 w-6 shadow bg-red-500 text-white rounded-full flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95">
                  <MdDeleteForever />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {hoveredIndex === data.length ? (
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
            <span className="flex items-center gap-2">or Drag <RiDragDropLine /></span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Card;