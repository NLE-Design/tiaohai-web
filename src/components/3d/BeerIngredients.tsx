import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BeerIngredients(props: any) {
  const group = useRef<THREE.Group>(null!);
  
  // 让原料轻微旋转
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 麦芽 */}
      <group position={[-2, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i / 8 * Math.PI * 2) * 0.3,
              0.5 + Math.random() * 0.2,
              Math.cos(i / 8 * Math.PI * 2) * 0.3
            ]} 
            rotation={[Math.random(), Math.random(), Math.random()]} 
            scale={0.2}
            castShadow
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#D4AC0D" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1, 12]} />
          <meshStandardMaterial color="#7D6608" roughness={0.8} />
        </mesh>
      </group>
      
      {/* 啤酒花 */}
      <group position={[0, 0, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i / 12 * Math.PI * 2) * 0.5,
              Math.cos(i / 12 * Math.PI * 2) * 0.2 + 0.5,
              Math.cos(i / 12 * Math.PI * 2) * 0.5
            ]} 
            scale={0.15}
            castShadow
          >
            <coneGeometry args={[1, 2, 6]} />
            <meshStandardMaterial color="#7DCEA0" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1, 12]} />
          <meshStandardMaterial color="#196F3D" roughness={0.8} />
        </mesh>
      </group>
      
      {/* 酵母 */}
      <group position={[2, 0, 0]}>
        {[...Array(15)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i / 15 * Math.PI * 2) * 0.4,
              0.5 + Math.random() * 0.3,
              Math.cos(i / 15 * Math.PI * 2) * 0.4
            ]} 
            scale={[0.1, 0.1, 0.1]}
            castShadow
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#FDEBD0" roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1, 12]} />
          <meshStandardMaterial color="#B9770E" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
} 