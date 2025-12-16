import { useRef } from 'react'
import { OrbitControls, Stats} from '@react-three/drei'
import { Box } from './box';
import { useStore } from './store';

const refs = new Map();

export function MainScene() {
  const boxRef1 = useRef();
  const boxRef2 = useRef();
  const orbitControlsRef = useRef();
  const isDraggingArrow = useStore((state) => state.isDraggingArrow);
  const setIsDraggingArrow = useStore((state) => state.setIsDraggingArrow);

  refs.set(boxRef1, boxRef1);
  refs.set(boxRef2, boxRef2);

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
        {/* <Box ref={boxRef1} position={[-5, 0, 0]} onDragChange={setIsDraggingArrow} /> */}
        <Box ref={boxRef2} position={[5, 0, 0]} onDragChange={setIsDraggingArrow} />
        <OrbitControls ref={orbitControlsRef} enabled={!isDraggingArrow} />
        <Stats />
    </>
  )
}