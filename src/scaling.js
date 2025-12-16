import { Vector3 } from "three"

export function TSSliceScaling(direction, delta, mesh) {
  if (!mesh.geometry) return

  const geometry = mesh.geometry
  const attributesPosition = geometry.attributes.position
  const totalVertexCount = attributesPosition.count
  const baseSize = getGeometryBaseSize(geometry)
  const margins = calculateMargins(baseSize)

  const originalSize = mesh.userData.originalSize
  
  const newSize = new Vector3(
    originalSize.x,
    originalSize.y,
    originalSize.z
  )

  newSize[direction] += delta

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
      newX = originalVertexPos[0] * (baseSize.x / baseSize.x) - (newSize.x - baseSize.x) / 2;
    } else if (vertexRegion.x === 1) {
      newX = originalVertexPos[0] * (baseSize.x / baseSize.x) + (newSize.x - baseSize.x) / 2;
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

function getGeometryBaseSize(geometry) {
  if (!geometry.boundingBox) geometry.computeBoundingBox()
  
  const bbox = geometry.boundingBox
  
  return {
    x: bbox.max.x - bbox.min.x,
    y: bbox.max.y - bbox.min.y,
    z: bbox.max.z - bbox.min.z
  }
}

function calculateMargins(baseSize, percentage = 0.15) {
  return {
    x: baseSize.x * percentage,
    y: baseSize.y * percentage,
    z: baseSize.z * percentage
  }
}