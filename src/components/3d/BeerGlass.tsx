import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 由于没有实际的模型文件，我们使用简单的几何体创建一个酒杯
export function BeerGlass(props: any) {
  const group = useRef<THREE.Group>(null!);
  
  // 让酒杯轻微旋转
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        (1 + Math.sin(state.clock.getElapsedTime() / 2)) * 0.3,
        0.1
      );
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 杯底 */}
      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* 杯柄 */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* 杯身 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 0.7, 2, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#f5f5f5"
          transmission={0.9} 
          roughness={0}
          thickness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* 啤酒 */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.65, 1.6, 32]} />
        <meshPhysicalMaterial
          color="#F39C12"
          roughness={0.1}
          metalness={0}
          transmission={0.5}
          thickness={1}
          emissive="#F5B041"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* 泡沫 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.2, 32]} />
        <meshStandardMaterial color="white" roughness={0.7} />
      </mesh>
    </group>
  );
} 