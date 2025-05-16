import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface ModelViewerProps {
  model?: {
    id: string;
    type: string;
    dimensions: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
  };
}

export function ModelViewer({ model }: ModelViewerProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  if (!model) {
    return null
  }

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[model.dimensions.width, model.dimensions.height, model.dimensions.depth]} />
      <meshPhysicalMaterial
        color="#3b82f6"
        metalness={0.5}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </mesh>
  )
} 