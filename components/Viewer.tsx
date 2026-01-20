
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ModelConfig } from '../types';

// --- 生物级建模模块 4.0 (写实低多边形) ---

// 1. 华南虎 (Panthera tigris amoyensis)
const DetailedTiger = ({ params }: { params: any }) => (
  <group>
    <mesh castShadow position={[0, 0.1, 0.4]} scale={[1, 1.1, 1.2]}><sphereGeometry args={[0.38, 32, 32]} /><meshStandardMaterial {...params} /></mesh>
    <mesh castShadow position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.33, 1.3, 16, 32]} /><meshStandardMaterial {...params} /></mesh>
    <mesh position={[0, -0.18, 0]} scale={[1.1, 0.35, 1.4]}><sphereGeometry args={[0.32]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>
    {Array.from({ length: 18 }).map((_, i) => (
      <mesh key={i} position={[0, 0.02, -0.7 + i * 0.09]} rotation={[Math.PI / 2, 0, (Math.random() - 0.5) * 0.1]}>
        <torusGeometry args={[0.36 + Math.sin(i) * 0.02, 0.006, 8, 32, Math.PI * 1.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
    <group position={[0, 0.35, 1.1]}>
      <mesh castShadow><sphereGeometry args={[0.38, 32, 32]} /><meshStandardMaterial {...params} /></mesh>
      <mesh position={[0, -0.15, 0.25]} scale={[1.4, 1.1, 1]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, -0.05, 0.44]} scale={[1.5, 0.8, 1]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#221111" roughness={0.2} metalness={0.4} /></mesh>
      <mesh position={[0.2, 0.15, 0.32]}><sphereGeometry args={[0.035]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} /></mesh>
      <mesh position={[-0.2, 0.15, 0.32]}><sphereGeometry args={[0.035]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} /></mesh>
    </group>
    {[[-0.32, -0.4, 0.6], [0.32, -0.4, 0.6], [-0.32, -0.4, -0.5], [0.32, -0.4, -0.5]].map((p, i) => (
      <group key={i} position={p as any}>
        <mesh castShadow><cylinderGeometry args={[0.13, 0.17, 0.7]} /><meshStandardMaterial {...params} /></mesh>
        <mesh position={[0, -0.36, 0.1]}><boxGeometry args={[0.26, 0.14, 0.32]} /><meshStandardMaterial color={params.color} /></mesh>
      </group>
    ))}
    <group position={[0, 0.25, -0.9]} rotation={[0.5, 0, 0]}>
       <mesh><capsuleGeometry args={[0.07, 1.2]} /><meshStandardMaterial {...params} /></mesh>
    </group>
  </group>
);

// 2. 金雕 (Aquila chrysaetos)
const DetailedEagle = ({ params }: { params: any }) => (
  <group>
    {/* 躯干 */}
    <mesh castShadow position={[0, 0, 0]} scale={[0.8, 1.2, 1.5]}><sphereGeometry args={[0.4]} /><meshStandardMaterial {...params} /></mesh>
    {/* 分层羽翼 */}
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 0.3, 0.2, 0]} rotation={[0, 0, side * -0.5]}>
        <mesh castShadow position={[side * 0.8, 0, 0]} scale={[1.8, 0.05, 1]} rotation={[0, side * 0.2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial {...params} side={THREE.DoubleSide} />
        </mesh>
      </group>
    ))}
    {/* 头部 */}
    <group position={[0, 0.5, 0.6]}>
      <mesh castShadow><sphereGeometry args={[0.22]} /><meshStandardMaterial {...params} /></mesh>
      {/* 鹰钩喙 */}
      <group position={[0, -0.05, 0.15]} rotation={[0.4, 0, 0]}>
        <mesh castShadow><coneGeometry args={[0.08, 0.3]} rotation={[Math.PI, 0, 0]} /><meshStandardMaterial color="#fbbf24" metalness={0.5} /></mesh>
      </group>
      <mesh position={[0.1, 0.08, 0.1]}><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.1, 0.08, 0.1]}><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
  </group>
);

// 3. 狼蛛 (Lycosidae)
const DetailedSpider = ({ params }: { params: any }) => (
  <group>
    {/* 头胸部与腹部 */}
    <mesh castShadow position={[0, 0, 0.2]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.3]} /><meshStandardMaterial {...params} /></mesh>
    <mesh castShadow position={[0, 0.1, -0.4]} scale={[1.2, 1.1, 1.4]}><sphereGeometry args={[0.45]} /><meshStandardMaterial {...params} /></mesh>
    {/* 复眼 */}
    {Array.from({ length: 8 }).map((_, i) => (
      <mesh key={i} position={[Math.sin(i) * 0.1, 0.15 + Math.cos(i) * 0.05, 0.45]}><sphereGeometry args={[0.02]} /><meshStandardMaterial color="#111" roughness={0} /></mesh>
    ))}
    {/* 八足 - 三段式 */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return (
        <group key={i} rotation={[0, angle, 0]} position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}>
          <group rotation={[0.6, 0, 0]}>
             <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5]} /><meshStandardMaterial color="#111" /></mesh>
             <group position={[0, 0.4, 0]} rotation={[-1.2, 0, 0]}>
                <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.02, 0.03, 0.5]} /><meshStandardMaterial color="#111" /></mesh>
                <group position={[0, 0.4, 0]} rotation={[-0.5, 0, 0]}>
                  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.01, 0.02, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
                </group>
             </group>
          </group>
        </group>
      );
    })}
  </group>
);

// 4. 江南垂柳 (Salix babylonica)
const DetailedWillow = ({ params }: { params: any }) => (
  <group>
    <mesh castShadow><cylinderGeometry args={[0.12, 0.2, 1.8]} /><meshStandardMaterial color="#3f2b1d" /></mesh>
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return (
        <group key={i} position={[Math.cos(angle) * 0.3, 0.8, Math.sin(angle) * 0.3]} rotation={[0, angle, 0]}>
           {/* 链式下垂枝条 */}
           {Array.from({ length: 8 }).map((_, j) => (
             <mesh key={j} position={[0.2, -j * 0.25, 0]} rotation={[0.2, 0, 0.1]} scale={[1, 1.5, 1]}>
               <capsuleGeometry args={[0.01, 0.2]} />
               <meshStandardMaterial color={params.color} transparent opacity={0.8} />
             </mesh>
           ))}
        </group>
      );
    })}
  </group>
);

const ModelShape: React.FC<{ model: ModelConfig; params: any }> = ({ model, params }) => {
  if (model.type === 'tiger') return <DetailedTiger params={params} />;
  if (model.type === 'eagle') return <DetailedEagle params={params} />;
  if (model.type === 'spider') return <DetailedSpider params={params} />;
  if (model.type === 'willow') return <DetailedWillow params={params} />;
  if (model.type === 'rabbit') return (
    <group>
      <mesh castShadow position={[0, 0.1, 0]} scale={[1, 1.3, 1.4]}><sphereGeometry args={[0.46, 32, 32]} /><meshStandardMaterial {...params} /></mesh>
      <group position={[0, 0.55, 0.7]}>
        <mesh castShadow><sphereGeometry args={[0.34, 32, 32]} /><meshStandardMaterial {...params} /></mesh>
        <group position={[0.2, 0.3, 0]} rotation={[-0.2, 0, -0.1]}>
          <mesh position={[0, 0.4, 0]}><capsuleGeometry args={[0.08, 0.85]} /><meshStandardMaterial {...params} /></mesh>
        </group>
        <group position={[-0.2, 0.3, 0]} rotation={[-0.2, 0, 0.1]}>
          <mesh position={[0, 0.4, 0]}><capsuleGeometry args={[0.08, 0.85]} /><meshStandardMaterial {...params} /></mesh>
        </group>
      </group>
    </group>
  );

  const isTree = model.category === 'tree';
  if (isTree) {
     return (
       <group>
          <mesh castShadow><cylinderGeometry args={[0.1, 0.18, 1.8]} /><meshStandardMaterial {...params} color="#451a03" /></mesh>
          <mesh position={[0, 1, 0]} castShadow>
             <sphereGeometry args={[0.7, 12, 12]} />
             <meshStandardMaterial {...params} color={model.color} />
          </mesh>
       </group>
     );
  }

  return (
    <mesh castShadow>
      {model.type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.7, 64, 64]} />}
      <meshStandardMaterial {...params} />
    </mesh>
  );
};

const Viewer: React.FC<{ model: ModelConfig; params: any }> = ({ model, params }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} key={model.id}>
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={22} />
      <Suspense fallback={null}>
        <Stage intensity={1.5} environment="city" adjustCamera={false}>
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
            <ModelShape model={model} params={params} />
          </Float>
        </Stage>
        <OrbitControls enablePan={false} makeDefault autoRotate autoRotateSpeed={0.8} />
        <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={20} blur={2.5} far={12} />
        <Environment preset="studio" />
      </Suspense>
      <color attach="background" args={[params.bgColor]} />
    </Canvas>
  );
};

export default Viewer;
