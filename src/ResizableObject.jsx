import { forwardRef, useRef, useState, useMemo, useEffect } from "react";
import { Arrow } from "./arrow";
import { Vector3, Box3, MeshStandardMaterial } from "three";
import { TSSliceScaling } from "./scaling";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";

export const ResizableObject = forwardRef(({ url, onDragChange, ...props }, ref) => {
  const [active, setActive] = useState(false);
  const obj = useLoader(OBJLoader, url);

  const inactiveMaterial = useMemo(() => new MeshStandardMaterial({ color: 'yellow' }), []);
  const activeMaterial = useMemo(() => new MeshStandardMaterial({ color: 'purple' }), []);

  useEffect(() => {
    const material = active ? activeMaterial : inactiveMaterial;
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [obj, active, activeMaterial, inactiveMaterial]);

  obj.scale.set(0.1,0.1,0.1)

  const { initialSize, initialCenter } = useMemo(() => {
    const box = new Box3().setFromObject(obj);
    const initialSize = new Vector3();
    box.getSize(initialSize);
    const initialCenter = new Vector3();
    box.getCenter(initialCenter);
    return { initialSize, initialCenter };
  }, [obj]);

  const arrowRefs = useRef(null);
  if (!arrowRefs.current) {
    arrowRefs.current = Array.from({ length: 5 }, () => ({ current: null }));
  }

  const arrowNames = ['x-positive', 'x-negative', 'z-positive', 'z-negative', 'y-positive'];
  
  const arrowY = initialSize.y / 2 + 0.15;
  
  const arrowPositions = [
    [ initialSize.x / 2, arrowY,  0],
    [-initialSize.x / 2, arrowY,  0],
    [0, arrowY, -initialSize.z / 2],
    [0, arrowY, initialSize.z / 2],
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
    const newScale = ref.current.scale.clone();
    let axis = 0;
    if (index === 0 || index === 1) axis = 'x';
    else if (index === 4) axis = 'y';
    else axis = 'z';

    newScale[axis] += delta;
    
    if (newScale[axis] < 0.1) newScale[axis] = 0.1;

    TSSliceScaling(newScale, ref)
  };

  return (
    <group ref={ref} {...props}>
      <primitive 
        object={obj} 
        onClick={(e) => {e.stopPropagation(); setActive((prev) => !prev)}}
        position={[-initialCenter.x, -initialCenter.y, -initialCenter.z]}
      />
      
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
          onDragChange={onDragChange}
        />
        ))}
      </group>
    </group>
  )
});
