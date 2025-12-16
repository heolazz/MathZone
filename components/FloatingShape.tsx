import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShapeType } from '../types';

interface FloatingShapeProps {
  type: ShapeType;
  color: string;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ type, color, position, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;

      // 1. ROTASI: Berputar lebih cepat jika dipilih
      const rotationSpeedY = isSelected ? 1.5 : 0.3;
      const rotationSpeedX = isSelected ? 0.5 : 0.2;

      meshRef.current.rotation.x += delta * rotationSpeedX;
      meshRef.current.rotation.y += delta * rotationSpeedY;

      // 2. POSISI: Efek Mengapung
      // Jika dipilih, gerakan mengapung sedikit lebih energik
      const floatSpeed = isSelected ? 2 : 1;
      const floatHeight = isSelected ? 0.25 : 0.2;
      meshRef.current.position.y = position[1] + Math.sin(time * floatSpeed + position[0]) * floatHeight;
      
      // 3. SKALA: Efek "Bernapas/Pulse"
      // Base scale: 1.5 (Selected), 1.2 (Hover), 1 (Normal)
      const baseScale = isSelected ? 1.5 : (hovered ? 1.2 : 1);
      
      // Tambahkan pulse sinus jika dipilih
      const pulse = isSelected ? Math.sin(time * 5) * 0.05 : 0;
      const targetScale = baseScale + pulse;

      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

      // 4. MATERIAL: Animasi Emissive (Cahaya)
      // Mengakses material untuk mengubah intensitas cahaya secara real-time
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        if (isSelected) {
            // Pulse intensitas cahaya antara 0.4 dan 0.8
            material.emissiveIntensity = 0.6 + Math.sin(time * 5) * 0.2;
        } else {
            // Fade out emissive jika tidak dipilih
            material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0, delta * 10);
        }
      }
    }
  });

  const renderGeometry = () => {
    switch (type) {
      // 3D Shapes
      case 'Cube': return <boxGeometry args={[1, 1, 1]} />;
      case 'Sphere': return <sphereGeometry args={[0.7, 32, 32]} />;
      case 'Cone': return <coneGeometry args={[0.7, 1.5, 32]} />;
      case 'Torus': return <torusGeometry args={[0.6, 0.25, 16, 32]} />;
      case 'Icosahedron': return <icosahedronGeometry args={[0.8, 0]} />;
      case 'Cylinder': return <cylinderGeometry args={[0.6, 0.6, 1.2, 32]} />;
      case 'Pyramid': return <coneGeometry args={[0.8, 1.2, 4]} />; // 4 radial segments = square base
      case 'Prism': return <cylinderGeometry args={[0.7, 0.7, 1.2, 3]} />; // 3 radial segments = triangular prism

      // 2D Shapes (Visualized as thin 3D objects)
      case 'Square': return <boxGeometry args={[1.2, 1.2, 0.1]} />;
      case 'Circle': return <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />;
      case 'Triangle': return <cylinderGeometry args={[0.8, 0.8, 0.1, 3]} />;
      
      default: return <boxGeometry />;
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => { 
            document.body.style.cursor = 'pointer';
            setHovered(true); 
        }}
        onPointerOut={() => { 
            document.body.style.cursor = 'auto';
            setHovered(false); 
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial 
            color={isSelected ? '#facc15' : color} 
            roughness={0.3} 
            metalness={0.6}
            emissive={isSelected ? '#facc15' : '#000000'}
            // Initial intensity handled here, updates handled in useFrame
            emissiveIntensity={isSelected ? 0.5 : 0} 
            side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Label above the shape */}
      {(hovered || isSelected) && (
        <Html position={[0, 1.8, 0]} center distanceFactor={10}>
          <div className={`
            px-2 py-1 rounded text-sm font-bold backdrop-blur-sm whitespace-nowrap border 
            transition-all duration-300
            ${isSelected 
                ? 'bg-indigo-600/90 text-white border-indigo-400 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                : 'bg-black/70 text-white border-white/20'}
          `}>
            {type}
          </div>
        </Html>
      )}
    </group>
  );
};

export default FloatingShape;