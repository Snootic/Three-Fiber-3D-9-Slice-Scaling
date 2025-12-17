import { useRef, Suspense, useMemo } from 'react';
import { ResizableObject } from './ResizableObject';
import { useStore } from './store';
import { generateUUID } from 'three/src/math/MathUtils.js';

export function LoadedObjects({ urls }) {
  const setIsDraggingArrow = useStore((state) => state.setIsDraggingArrow);
  const refs = useMemo(() => urls.map(() => ({ current: null })), [urls]);
  
  return (
    <>
      {urls.map((url, index) => (
        <Suspense key={index} fallback={null}>
          <ResizableObject 
            url={url} 
            objectId={generateUUID()} 
            ref={refs[index]} 
            position={[0 + index * 4, 0, 0]} 
            onDragChange={setIsDraggingArrow}
          />
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