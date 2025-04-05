import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei';
import { BeerGlass } from './BeerGlass';
import { BeerIngredients } from './BeerIngredients';

// 加载进度组件
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % 加载中</Html>;
}

export function BeerScene() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={['#222']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Suspense fallback={<Loader />}>
          <BeerGlass position={[-1.5, 0, 0]} scale={0.8} />
          <BeerIngredients position={[1.5, 0, 0]} scale={0.8} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
} 