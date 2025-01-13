'use client'
import InputSection from "@/components/InputSection";
import Card from "@/components/Card";
import { ValuesContext } from "@/context/ValuesProvider";
import { useContext, useState } from "react";

export default function Home() {

  const { otherCards, setOtherCards } = useContext(ValuesContext);


  const [heading, setHeading] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

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
    <div className="h-screen bg-zinc-300 pl-12 overflow-x-auto min-w-full w-max overflow-hidden">
      <InputSection />

      <div className="flex gap-5 mt-16 w-full">
        {
          otherCards.map((card, index) => {
            return <Card key={index} id={index} heading={card.heading} />
          })
        }

        <div className="h-fit flex flex-col mr-5">
          {
            showForm &&
            <input type="text" placeholder="Heading" className="py-3 rounded-t outline-none px-5 w-52" onChange={(e) => setHeading(e.target.value)} />
          }
          <button onClick={() => {
            handleNewCard();
            setShowForm(!showForm);
          }} className={`bg-green-600 text-white py-3 shadow shadow-white outline-none cursor-pointer hover:bg-green-700 rounded-b px-8 w-52 ${showForm ? 'rounded-b' : 'rounded'}`}>{
              showForm ? heading ? 'Add Card +' : 'Back' : 'New Card'
            }
          </button>
        </div>
      </div>

    </div>
  )
}
