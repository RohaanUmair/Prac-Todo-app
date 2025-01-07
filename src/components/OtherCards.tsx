// 'use client';
// import { ValuesContext } from "@/context/ValuesProvider";
// import React, { useContext, useEffect, useState } from "react";
// import { TbDots } from "react-icons/tb";

// interface CardProps {
//     type: string;
//     heading: string;
//     id: number;
// }

// const OtherCards = ({ heading, id }: CardProps) => {
//     const context = useContext(ValuesContext);

//     const [data, setData] = useState<string[]>([]);
//     const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//     useEffect(() => {
//         const { otherCards } = context;
//         setData(otherCards[id].items);
//     }, [context]);

//     const handleDrop = (e: React.DragEvent, dropIndex: number) => {
//         e.preventDefault();
//         setHoveredIndex(null);

//         const { otherCards, setOtherCards } = context;

//         const draggedItem = e.dataTransfer.getData('item');
//         const sourceCard = e.dataTransfer.getData('sourceCard');


//         if (sourceCard === heading) {
//             const updatedItems = [...data];
//             const draggedIndex = updatedItems.indexOf(draggedItem);

//             if (draggedIndex !== -1) {
//                 updatedItems.splice(draggedIndex, 1);
//             }

//             updatedItems.splice(dropIndex, 0, draggedItem);

//             setData(updatedItems);

//             setOtherCards((prevCards) =>
//                 prevCards.map((card) => {
//                     if (card.heading == heading) {
//                         return { ...card, items: updatedItems };
//                     } else {
//                         return card;
//                     }
//                 }
//                 )
//             );
//             return;
//         }

//         const updatedSourceCard = otherCards.find((card) => card.heading === sourceCard);
//         const updatedTargetCard = otherCards.find((card) => card.heading === heading);

//         if (updatedSourceCard && updatedTargetCard) {
//             const sourceItems = updatedSourceCard.items.filter((item) => item !== draggedItem);
//             const targetItems = [...updatedTargetCard.items];

//             targetItems.splice(dropIndex, 0, draggedItem);

//             setOtherCards((prevCards) =>
//                 prevCards.map((card) => {
//                     if (card.heading === sourceCard) {
//                         return { ...card, items: sourceItems };
//                     }
//                     if (card.heading === heading) {
//                         return { ...card, items: targetItems };
//                     }
//                     return card;
//                 })
//             );
//         }
//     };

//     const handleDragStart = (e: React.DragEvent, item: string) => {
//         e.dataTransfer.setData('item', item);
//         e.dataTransfer.setData('sourceCard', heading);
//     };

//     const handleDragOver = (e: React.DragEvent, index: number | null) => {
//         e.preventDefault();
//         setHoveredIndex(index);
//     };

//     const handleDragLeave = () => {
//         setHoveredIndex(null);
//     };

//     return (
//         <div
//             className="w-80 h-fit bg-slate-100 rounded-xl pb-5"
//             onDragOver={(e) => e.preventDefault()}
//             onDragLeave={handleDragLeave}
//         >
//             <div className="flex justify-between px-4 items-center py-3 border-b mb-5">
//                 <h3 className="text-gray-700 font-bold">{heading}</h3>
//                 <TbDots className="text-lg" />
//             </div>

//             {data.map((item: string, index: number) => (
//                 <div key={index} className="w-[80%] mx-auto">
//                     {hoveredIndex === index && (
//                         <div className="h-2 bg-blue-500 my-2 rounded"></div>
//                     )}
//                     <div
//                         className="bg-white border shadow rounded-lg py-2 px-4 my-2 cursor-grab"
//                         draggable={true}
//                         onDragStart={(e) => handleDragStart(e, item)}
//                         onDragOver={(e) => handleDragOver(e, index)}
//                         onDrop={(e) => handleDrop(e, index)}
//                     >
//                         <p className="text-gray-700">{item}</p>
//                     </div>
//                 </div>
//             ))}

//             {hoveredIndex === data.length && (
//                 <div className="w-[80%] mx-auto h-1 bg-blue-500 my-2 rounded"></div>
//             )}
//             <div
//                 className="w-[80%] mx-auto h-10 border-dashed border-2 border-gray-300 my-2 rounded"
//                 onDragOver={(e) => handleDragOver(e, data.length)}
//                 onDrop={(e) => handleDrop(e, data.length)}
//             ></div>
//         </div>
//     );
// };

// export default OtherCards;

'use client';

import { ValuesContext } from "@/context/ValuesProvider";
import React, { useContext, useEffect, useState } from "react";
import { TbDots } from "react-icons/tb";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  type: string;
  heading: string;
  id: number;
}

const DraggableItem = ({ id, text }: { id: string; text: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white border shadow rounded-lg py-2 px-4 my-2 cursor-grab"
    >
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

const DroppableArea = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-[80%] mx-auto ${isOver ? "bg-blue-100" : ""}`}
    >
      {children}
    </div>
  );
};

const OtherCards = ({ heading, id }: CardProps) => {
  const context = useContext(ValuesContext);

  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const { otherCards } = context;
    setData(otherCards[id].items);
  }, [context, id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedItem = active.id as string;
    const { otherCards, setOtherCards } = context;

    const updatedItems = [...data];
    const draggedIndex = updatedItems.indexOf(draggedItem);

    if (draggedIndex !== -1) {
      updatedItems.splice(draggedIndex, 1);
    }

    const overId = over.id as string;
    const dropIndex = Number(overId.split('-')[1]);
    updatedItems.splice(dropIndex, 0, draggedItem);

    setData(updatedItems);

    setOtherCards((prevCards) =>
      prevCards.map((card) => {
        if (card.heading === heading) {
          return { ...card, items: updatedItems };
        }
        return card;
      })
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-80 h-fit bg-slate-100 rounded-xl pb-5">
        <div className="flex justify-between px-4 items-center py-3 border-b mb-5">
          <h3 className="text-gray-700 font-bold">{heading}</h3>
          <TbDots className="text-lg" />
        </div>

        {data.map((item: string, index: number) => (
          <DroppableArea key={`${heading}-${index}`} id={`${heading}-${index}`}>
            <DraggableItem id={item} text={item} />
          </DroppableArea>
        ))}

        <DroppableArea id={`${heading}-${data.length}`}>
          <div className="w-[80%] mx-auto h-10 border-dashed border-2 border-gray-300 my-2 rounded"></div>
        </DroppableArea>
      </div>
    </DndContext>
  );
};

export default OtherCards;
