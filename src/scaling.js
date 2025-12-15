import { Vector3 } from "three"

export function TSSliceScaling(newScale, objectRef) {
  const mesh = objectRef.current.children[0]
  
  //TODO: if mesh has children, also resize children geometries
  // If mesh has no geometry, search the next children that has
  // if (!mesh.geometry) {
    
  // }

  const geometry = mesh.geometry
  const attributesPosition = geometry.attributes.position
  const totalVertexCount = attributesPosition.count
  const baseSize = 1

  // the corner radius (0.1) + 0.5
  const margins = { 
    x: 0.15,
    y: 0.15,
    z: 0.15
  }

  const originalPositions = new Float32Array(attributesPosition.array)

  for (let i = 0; i < totalVertexCount; i++) {
    const idx = i * 3;
    const originalVertexPos = [
      originalPositions[idx],
      originalPositions[idx + 1],
      originalPositions[idx + 2],
    ];
    const vertexRegion = classifyVertexRegion(originalVertexPos, margins);

    let [newX, newY, newZ] = originalVertexPos

    if (vertexRegion.x === -1) {
      newX = originalVertexPos[0] * (baseSize / baseSize) - (newScale[0] - baseSize) / 2;
    } else if (vertexRegion.x === 1) {
      newX = originalVertexPos[0] * (baseSize / baseSize) + (newScale[0] - baseSize) / 2;
    } else {
      const centerScaleX = (newScale[0] - 2 * margins.x) / (baseSize - 2 * margins.x);
      newX = originalVertexPos[0] * centerScaleX;
    }
    
    if (vertexRegion.y === -1) {
      newY = originalVertexPos[1] - (newScale[1] - baseSize) / 2;
    } else if (vertexRegion.y === 1) {
      newY = originalVertexPos[1] + (newScale[1] - baseSize) / 2;
    } else {
      const centerScaleY = (newScale[1] - 2 * margins.y) / (baseSize - 2 * margins.y);
      newY = originalVertexPos[1] * centerScaleY;
    }
    
    if (vertexRegion.z === -1) {
      newZ = originalVertexPos[2] - (newScale[2] - baseSize) / 2;
    } else if (vertexRegion.z === 1) {
      newZ = originalVertexPos[2] + (newScale[2] - baseSize) / 2;
    } else {
      const centerScaleZ = (newScale[2] - 2 * margins.z) / (baseSize - 2 * margins.z);
      newZ = originalVertexPos[2] * centerScaleZ;
    }
    
    attributesPosition.array[idx] = newX
    attributesPosition.array[idx + 1] = newY
    attributesPosition.array[idx + 2] = newZ 
  }

  attributesPosition.needsUpdate = true
  geometry.computeVertexNormals()

  console.log(geometry)
}

function classifyVertexRegion(vertexPositions, margins) {
  let x = 0, y = 0, z = 0
  
  if (vertexPositions[0] < -margins.x) x = -1
  else if (vertexPositions[0] > margins.x) x = 1

  if (vertexPositions[1] < -margins.y) y = -1
  else if (vertexPositions[1] > margins.y) y = 1

  if (vertexPositions[2] < -margins.z) z = -1
  else if (vertexPositions[2] > margins.z) z = 1

  let region = new Vector3(x,y,z)

  return region
}