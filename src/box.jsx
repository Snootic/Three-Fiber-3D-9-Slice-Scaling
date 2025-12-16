import { forwardRef, useRef, useState } from "react";
import { Arrow } from "./arrow";
import { Vector3 } from "three";
import { RoundedBox } from "@react-three/drei"
import { TSSliceScaling } from "./scaling";


export const Box = forwardRef((props, ref) => {
  const [active, setActive] = useState(false)
  const scale = [1,1,1]
  const size = new Vector3().fromArray([2,1,3])

  const arrowRefs = useRef(null);
  
  if (!arrowRefs.current) {
    arrowRefs.current = Array.from({ length: 5 }, () => ({ current: null }));
  }

  const arrowNames = ['x-positive', 'x-negative', 'z-positive', 'z-negative', 'y-positive'];
  
  const arrowY = scale[1] / 2 + 0.15;
  
  const arrowPositions = [
    [ scale[0] / 2, arrowY,  0],
    [-scale[0] / 2, arrowY,  0],
    [0, arrowY, -scale[2] / 2],
    [0, arrowY, scale[2] / 2],
    [0, arrowY, 0],
  ];
  
  const arrowDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 0, -1),
    new Vector3(0, 0, 1),
    new Vector3(0, 1, 0)
  ];

  const arrowRotations = [
    [0, 0, 0],
    [0, 0,  Math.PI],
    [0,  Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [0, 0, Math.PI / 2],
  ];

  const handleDrag = (index, delta) => {
    if (!ref.current) return;
    let axis = 0;
    if (index === 0 || index === 1) axis = 'x';
    else if (index === 4) axis = 'y';
    else axis = 'z';

    ref.current.children[0].traverse((child) => {
      if (child.isMesh) {
        TSSliceScaling(axis, delta, child)
      }
    })
  };

  return (
    <group ref={ref} {...props}>
      <RoundedBox
        args={size}
        radius={0.1}
        smoothness={4}
        onClick={(e) => {e.stopPropagation(); setActive((prev) => !prev)}}
        receiveShadow={true}
        castShadow={true}
        userData={{originalSize: size}}
      >
        <meshStandardMaterial color={active ? 'orange' : 'blue'} />
      </RoundedBox>
      
      <group visible={active}>
        {arrowPositions.map((pos, i) => (
        <Arrow
          key={arrowNames[i]}
          name={arrowNames[i]}
          ref={arrowRefs.current[i]}
          position={pos}
          scale={[0.2, 0.2, 0.2]}
          rotation={arrowRotations[i]}
          direction={arrowDirections[i]}
          onDrag={(delta) => handleDrag(i, delta)}
          onDragChange={props.onDragChange}
        />
        ))}
      </group>
    </group>
  )
})