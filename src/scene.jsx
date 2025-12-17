import { useRef } from 'react'
import { OrbitControls, Stats} from '@react-three/drei'
import { useStore } from './store';

export function MainScene() {
  const orbitControlsRef = useRef();
  const isDraggingArrow = useStore((state) => state.isDraggingArrow);

  return (
    <>
      <ambientLight intensity={1} />
        <directionalLight 
          position={[5, 5, 20]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <OrbitControls ref={orbitControlsRef} enabled={!isDraggingArrow} />
        <Stats />
    </>
  )
}