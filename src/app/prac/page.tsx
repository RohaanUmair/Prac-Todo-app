'use client';
import React, { useState } from 'react';

const DragDropExample = () => {
  const [list1, setList1] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [list2, setList2] = useState<string[]>(['Item A', 'Item B', 'Item C']);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('item', item); // Set the dragged item's data
  };

  const handleDrop = (e: React.DragEvent, targetList: string[]) => {
    e.preventDefault();

    const draggedItem = e.dataTransfer.getData('item');
    const mouseY = e.clientY; // Mouse position when dropped

    // Calculate where to insert the item in the target list
    const targetIndex = getDropIndex(mouseY, targetList.length);

    // Insert the item in the target list
    const updatedList = [
      ...targetList.slice(0, targetIndex),
      draggedItem,
      ...targetList.slice(targetIndex),
    ];

    // Update the state with the new list
    if (targetList === list1) {
      setList1(updatedList);
    } else {
      setList2(updatedList);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow the drop
  };

  // Function to calculate the drop index based on mouse position
  const getDropIndex = (mouseY: number, listLength: number) => {
    const itemHeight = 50; // Assume each item is 50px tall
    return Math.min(Math.floor(mouseY / itemHeight), listLength);
  };

  return (
    <div className="flex gap-10">
      {/* List 1 */}
      <div
        className="list-container"
        onDrop={(e) => handleDrop(e, list1)}
        onDragOver={handleDragOver}
      >
        <h3>List 1</h3>
        {list1.map((item, index) => (
          <div
            key={index}
            className="item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{ padding: '10px', margin: '5px', background: 'lightgray' }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* List 2 */}
      <div
        className="list-container"
        onDrop={(e) => handleDrop(e, list2)}
        onDragOver={handleDragOver}
      >
        <h3>List 2</h3>
        {list2.map((item, index) => (
          <div
            key={index}
            className="item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{ padding: '10px', margin: '5px', background: 'lightblue' }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDropExample;
