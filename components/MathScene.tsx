import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows } from '@react-three/drei';
import FloatingShape from './FloatingShape';
import { SHAPES, ShapeType } from '../types';

interface MathSceneProps {
  selectedShape: ShapeType | null;
  onSelectShape: (shape: ShapeType) => void;
}

const MathScene: React.FC<MathSceneProps> = ({ selectedShape, onSelectShape }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        {/* Shapes */}
        <group>
          {SHAPES.map((shape) => (
            <FloatingShape
              key={shape.name}
              type={shape.name}
              color={shape.color}
              position={shape.position}
              isSelected={selectedShape === shape.name}
              onClick={() => onSelectShape(shape.name)}
            />
          ))}
        </group>

        {/* Floor Shadow */}
        <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2.5} far={5.5} />
        
        {/* Controls */}
        <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={5} 
            maxDistance={20}
            maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default MathScene;
