import { Vector3 } from "three"

export function TSSliceScaling(direction, axis, delta, mesh) {
  if (!mesh.geometry) return

  // TODO RESIZE ONLY THE DIRECTION IT WAS PULLED
  // IF THE X-POSITIVE ARROW IS PULLED, THEN RESIZE ONLY THE OBJECT HALF ON X POSITIVE

  const geometry = mesh.geometry
  const attributesPosition = geometry.attributes.position
  const totalVertexCount = attributesPosition.count
  const baseSize = getGeometryBaseSize(geometry)
  const margins = calculateMargins(baseSize)

  mesh.userData.currentSize[axis] += delta

  const newSize = mesh.userData.currentSize
  const originalPositions = mesh.userData.originalPositions
  const bbox = geometry.boundingBox

  for (let i = 0; i < totalVertexCount; i++) {
    const idx = i * 3;
    const originalVertexPos = [
      originalPositions[idx],
      originalPositions[idx + 1],
      originalPositions[idx + 2],
    ];
    const vertexRegion = classifyVertexRegion(originalVertexPos, margins, bbox);

    let [newX, newY, newZ] = originalVertexPos

    if (vertexRegion.x === -1) {
      newX = originalVertexPos[0] - (newSize.x - baseSize.x) / 2;
    } else if (vertexRegion.x === 1) {
      newX = originalVertexPos[0] + (newSize.x - baseSize.x) / 2;
    } else {
      const centerScaleX = (newSize.x - 2 * margins.x) / (baseSize.x - 2 * margins.x);
      newX = originalVertexPos[0] * centerScaleX;
    }
    
    if (vertexRegion.y === -1) {
      newY = originalVertexPos[1] - (newSize.y - baseSize.y) / 2;
    } else if (vertexRegion.y === 1) {
      newY = originalVertexPos[1] + (newSize.y - baseSize.y) / 2;
    } else {
      const centerScaleY = (newSize.y - 2 * margins.y) / (baseSize.y - 2 * margins.y);
      newY = originalVertexPos[1] * centerScaleY;
    }
    
    if (vertexRegion.z === -1) {
      newZ = originalVertexPos[2] - (newSize.z - baseSize.z) / 2;
    } else if (vertexRegion.z === 1) {
      newZ = originalVertexPos[2] + (newSize.z - baseSize.z) / 2;
    } else {
      const centerScaleZ = (newSize.z - 2 * margins.z) / (baseSize.z - 2 * margins.z);
      newZ = originalVertexPos[2] * centerScaleZ;
    }
    
    attributesPosition.array[idx] = newX
    attributesPosition.array[idx + 1] = newY
    attributesPosition.array[idx + 2] = newZ 
  }

  attributesPosition.needsUpdate = true
  geometry.computeVertexNormals()
}

  function classifyVertexRegion(vertexPositions, margins, bbox) {
    let x = 0, y = 0, z = 0
    
    const minX = bbox.min.x + margins.x
    const maxX = bbox.max.x - margins.x
    
    const minY = bbox.min.y + margins.y
    const maxY = bbox.max.y - margins.y
    
    const minZ = bbox.min.z + margins.z
    const maxZ = bbox.max.z - margins.z
    
    if (vertexPositions[0] < minX) x = -1
    else if (vertexPositions[0] > maxX) x = 1
    else x = 0

    if (vertexPositions[1] < minY) y = -1
    else if (vertexPositions[1] > maxY) y = 1
    else y = 0

    if (vertexPositions[2] < minZ) z = -1
    else if (vertexPositions[2] > maxZ) z = 1
    else z = 0

    return new Vector3(x, y, z)
  }


function getGeometryBaseSize(geometry) {
  if (!geometry.boundingBox) geometry.computeBoundingBox()
  
  const bbox = geometry.boundingBox
  
  return {
    x: bbox.max.x - bbox.min.x,
    y: bbox.max.y - bbox.min.y,
    z: bbox.max.z - bbox.min.z
  }
}

function calculateMargins(baseSize) {
  return {
    x: baseSize.x / 2,
    y: baseSize.y / 2,
    z: baseSize.z / 2,
  }
}