import { Canvas, useFrame } from '@react-three/fiber'

import './App.css'
import { MainScene } from './scene';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <MainScene/>
      </Canvas>
    </div>
  )
}

export default App
