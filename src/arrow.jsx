import { useThree } from '@react-three/fiber'
import { useGLTF } from "@react-three/drei";
import { forwardRef, useMemo, useRef, useState } from 'react';
import { Plane, Raycaster, Vector3 } from 'three';

useGLTF.preload("resizingArrow.glb");

export const Arrow = forwardRef((props, ref) => {
  const { scene } = useGLTF("resizingArrow.glb");
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragPlane = useRef(new Plane());
  const dragPoint = useRef(new Vector3());
  const previousPoint = useRef(new Vector3());
  const { camera, gl } = useThree();
  const { onDragChange, direction, onDrag } = props;

  const clonedSeta = useMemo(() => scene.clone(), [scene]);

  const onPointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    onDragChange?.(true);
    
    const worldDirection = direction.clone().normalize();
    const viewDir = camera.position.clone().sub(ref.current.getWorldPosition(new Vector3())).normalize();
    
    const planeNormal = viewDir.clone().sub(worldDirection.clone().multiplyScalar(viewDir.dot(worldDirection))).normalize();
    
    if (planeNormal.lengthSq() < 0.001) {
      const up = new Vector3(0, 1, 0);
      if (Math.abs(worldDirection.dot(up)) > 0.99) {
        planeNormal.set(1, 0, 0);
      } else {
        planeNormal.copy(up).cross(worldDirection).normalize();
      }
    }

    dragPlane.current.setFromNormalAndCoplanarPoint(planeNormal, e.point);
    previousPoint.current.copy(e.point);
    
    gl.domElement.style.cursor = 'grabbing';
  };

  const onPointerUp = (e) => {
    e?.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    onDragChange?.(false);
    gl.domElement.style.cursor = hovered ? 'pointer' : 'auto';
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation();
      const raycaster = new Raycaster();
      raycaster.setFromCamera(
        {
          x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
          y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1
        },
        camera
      );
      
      if (raycaster.ray.intersectPlane(dragPlane.current, dragPoint.current)) {
        const deltaVec = dragPoint.current.clone().sub(previousPoint.current);
        const projectedDelta = deltaVec.dot(direction);
        
        if (onDrag) {
          onDrag(projectedDelta);
        }
        
        previousPoint.current.copy(dragPoint.current);
      }
    }
  };

  const onPointerEnter = (e) => {
    e.stopPropagation();
    setHovered(true);
    gl.domElement.style.cursor = 'pointer';
  };

  const onPointerLeave = (e) => {
    e.stopPropagation();
    setHovered(false);
    if (!isDragging) {
      gl.domElement.style.cursor = 'auto';
    }
  };

  return (
    <primitive
      object={clonedSeta}
      ref={ref}
      position={props.position}
      rotation={props.rotation}
      scale={hovered ? props.scale.map(v => v * 1.2) : props.scale}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={(e) => e.stopPropagation()}
    />
  );
})