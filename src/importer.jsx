import { useRef, Suspense, useState } from 'react';
import { ResizableObject } from './ResizableObject';
import { useStore } from './store';


export function LoadedObjects({ urls }) {
  const setIsDraggingArrow = useStore((state) => state.setIsDraggingArrow);
  const loadedObjectRef = useRef();
  return (
    <>
      {urls.map((url, index) => (
        <Suspense key={index} fallback={null}>
          <ResizableObject url={url} ref={loadedObjectRef} position={[-5, 0, 0]} onDragChange={setIsDraggingArrow}/>;
        </Suspense>
      ))}
    </>
  );
}

export function Importer({ onFileLoaded }) {
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFileLoaded(url);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ position: 'absolute', top: '50px', left: '20px', zIndex: 1 }}>
      <button onClick={handleButtonClick}>Import OBJ</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".obj"
        onChange={handleFileChange}
      />
    </div>
  );
}

