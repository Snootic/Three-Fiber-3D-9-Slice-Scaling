import { forwardRef, useRef, useState, useMemo, useEffect } from "react";
import { Arrow } from "./arrow";
import { Vector3, Box3, MeshStandardMaterial } from "three";
import { TSSliceScaling } from "./scaling";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import { useStore } from "./store";
import { BufferAttribute } from "three"
import { useHotkeys } from 'react-hotkeys-hook'

export const ResizableObject = forwardRef(({ url, onDragChange, ...props }, ref) => {
  const [active, setActive] = useState(false);
  const obj = useLoader(OBJLoader, url);
  const scale = useStore((state) => state.scale);

  const inactiveMaterial = useMemo(() => new MeshStandardMaterial({ color: 'white', vertexColors: true }), []);
  const activeMaterial = useMemo(() => new MeshStandardMaterial({ color: 'white', vertexColors: true }), []);

  useEffect(() => {
    const material = active ? activeMaterial : inactiveMaterial;
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [obj, active, activeMaterial, inactiveMaterial]);

  const initialCenter = useMemo(() => {
    const box = new Box3().setFromObject(obj);
    const initialCenter = new Vector3();
    box.getCenter(initialCenter);
    return initialCenter;
  }, [obj]);

  const arrowRefs = useRef(null);
  if (!arrowRefs.current) {
    arrowRefs.current = Array.from({ length: 5 }, () => ({ current: null }));
  }

  const arrowNames = ['x-positive', 'x-negative', 'z-positive', 'z-negative', 'y-positive'];
  
  const arrowY = useMemo(() => {return initialCenter.y / 4},[initialCenter.y]);
  
  const arrowPositions = [
    [ initialCenter.x / 2, arrowY,  0],
    [-initialCenter.x / 2, arrowY,  0],
    [0, arrowY, -initialCenter.z / 2],
    [0, arrowY, initialCenter.z / 2],
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

  useEffect(() => {
    obj.scale.set(scale, scale, scale)
    obj.position.set(0,0,0)
    
    let meshCount = 0
    obj.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (!child.geometry.boundingBox) child.geometry.computeBoundingBox()
        const box = child.geometry.boundingBox
        const originalSize = new Vector3()
        box.getSize(originalSize)
        
        child.userData.originalSize = originalSize
        if (!child.userData.currentSize) {
          child.userData.currentSize = new Vector3(
            originalSize.x,
            originalSize.y,
            originalSize.z
          )
        }

        if (!child.userData.originalPositions) {
          const attributesPosition = child.geometry.attributes.position
          child.userData.originalPositions = new Float32Array(attributesPosition.array)
        }

        if (!child.geometry.attributes.color) {
          const colors = new Float32Array(child.geometry.attributes.position.count * 3)
          child.geometry.setAttribute('color', new BufferAttribute(colors, 3))
        }

        const colorAttribute = child.geometry.attributes.color
        for (let i = 0; i < colorAttribute.count; i++) {
          colorAttribute.setXYZ(i, 1, 1, 1)
        }
        colorAttribute.needsUpdate = true

        meshCount++;
      }
    });
  }, [obj, scale])

  useHotkeys('left', () => {
    if (active && ref.current) {
      ref.current.position.x -= 0.1
    }
  }, [active])

  useHotkeys('right', () => {
    if (active && ref.current) {
      ref.current.position.x += 0.1
    }
  }, [active])


  useHotkeys('up', () => {
    if (active && ref.current) {
      ref.current.position.z += 0.1
    }
  }, [active])
  
  useHotkeys('down', () => {
    if (active && ref.current) {
      ref.current.position.z -= 0.1
    }
  }, [active])

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
