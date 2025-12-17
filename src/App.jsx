import { Canvas } from '@react-three/fiber'
import { useState } from 'react';

import './App.css'
import { MainScene } from './scene';
import { Importer, LoadedObjects } from './importer';
import { Slider } from './Slider';

function App() {
  const [objectUrls, setObjectUrls] = useState([
    '/box.obj',
    '/larger_box.obj'
  ]);

  const handleFileLoaded = (url) => {
    setObjectUrls(prev => [...prev, url]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Importer onFileLoaded={handleFileLoaded} />
      <Slider />
      <Canvas shadows>
        <MainScene />
        <LoadedObjects urls={objectUrls} />
      </Canvas>
    </div>
  )
}


export default App
