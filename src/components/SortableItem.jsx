import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const GameItem = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props.children });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition
            }}
        >
            <div className="rounded border w-[80%] mx-auto px-4 bg-white h-12 text-xl items-center flex border-black">
                {props.children}
            </div>
        </div>
    );
};

export default GameItem;