
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ModelConfig } from '../types';

// 赋予模型呼吸感的包装器
const LifeWrapper = ({ children, speed = 1 }: { children?: React.ReactNode; speed?: number }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime() * speed;
      group.current.position.y += Math.sin(t) * 0.005; 
      group.current.rotation.y += Math.cos(t * 0.4) * 0.001;
    }
  });
  return <group ref={group}>{children}</group>;
};

// --- 精细写实模型库：第一阶段 5 款 ---

// 1. 大熊猫 (Panda)
const DetailedPanda = () => (
  <LifeWrapper speed={0.7}>
    <mesh castShadow>
      <capsuleGeometry args={[0.46, 0.68, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
      <meshStandardMaterial color="#ffffff" roughness={0.8} />
    </mesh>
    <group position={[0, 0.48, 0.48]}>
      <mesh><sphereGeometry args={[0.39, 32, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
      {/* 优化的黑眼圈 */}
      <mesh position={[0.16, 0.06, 0.31]} rotation={[0, 0.2, 0]}><sphereGeometry args={[0.09, 16, 16]} scale={[1, 1.4, 0.45]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.16, 0.06, 0.31]} rotation={[0, -0.2, 0]}><sphereGeometry args={[0.09, 16, 16]} scale={[1, 1.4, 0.45]} /><meshStandardMaterial color="#111" /></mesh>
      {/* 眼睛亮点 */}
      <mesh position={[0.16, 0.08, 0.38]}><sphereGeometry args={[0.02]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} /></mesh>
      <mesh position={[-0.16, 0.08, 0.38]}><sphereGeometry args={[0.02]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} /></mesh>
      {/* 鼻子 */}
      <mesh position={[0, -0.04, 0.38]}><sphereGeometry args={[0.045, 12, 12]} scale={[1.4, 0.8, 0.8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.27, 0.36, -0.05]}><sphereGeometry args={[0.14]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.27, 0.36, -0.05]}><sphereGeometry args={[0.14]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
    {/* 四肢 */}
    {[[-0.32, -0.42, 0.32], [0.32, -0.42, 0.32], [-0.32, -0.42, -0.32], [0.32, -0.42, -0.32]].map((p, i) => (
      <mesh key={i} position={p as any}><capsuleGeometry args={[0.18, 0.32, 8, 16]} /><meshStandardMaterial color="#111" /></mesh>
    ))}
  </LifeWrapper>
);

// 2. 非洲大象 (Elephant)
const DetailedElephant = ({ color }: { color: string }) => (
  <LifeWrapper speed={0.9}>
    <mesh castShadow><capsuleGeometry args={[0.49, 1.05, 12, 24]} rotation={[Math.PI / 2, 0, 0]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
    <group position={[0, 0.36, 0.75]}>
      <mesh><sphereGeometry args={[0.43, 32, 32]} /><meshStandardMaterial color={color} /></mesh>
      {/* 象鼻分段细节 */}
      <group position={[0, -0.12, 0.35]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, -i * 0.14, i * 0.08]} rotation={[0.4 + i * 0.12, 0, 0]}>
            <cylinderGeometry args={[0.13 - i * 0.015, 0.11 - i * 0.015, 0.2]} /><meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
      {/* 巨大扇耳 */}
      <mesh position={[0.48, 0.18, 0]} rotation={[0, -0.5, 0.1]} scale={[1, 1, 0.06]}><sphereGeometry args={[0.44]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.48, 0.18, 0]} rotation={[0, 0.5, -0.1]} scale={[1, 1, 0.06]}><sphereGeometry args={[0.44]} /><meshStandardMaterial color={color} /></mesh>
      {/* 象牙细节 */}
      <mesh position={[0.2, -0.2, 0.35]} rotation={[0.7, 0.2, 0]}><coneGeometry args={[0.045, 0.7, 8]} /><meshStandardMaterial color="#fffdf0" roughness={0.3} metalness={0.1} /></mesh>
      <mesh position={[-0.2, -0.2, 0.35]} rotation={[0.7, -0.2, 0]}><coneGeometry args={[0.045, 0.7, 8]} /><meshStandardMaterial color="#fffdf0" roughness={0.3} metalness={0.1} /></mesh>
    </group>
    {/* 象足 */}
    {[[-0.32, -0.65, 0.35], [0.32, -0.65, 0.35], [-0.32, -0.65, -0.35], [0.32, -0.65, -0.35]].map((p, i) => (
      <mesh key={i} position={p as any}><cylinderGeometry args={[0.18, 0.18, 0.75, 16]} /><meshStandardMaterial color={color} /></mesh>
    ))}
  </LifeWrapper>
);

// 3. 帝企鹅 (Penguin)
const DetailedPenguin = () => (
  <LifeWrapper speed={1.4}>
    <group>
      <mesh castShadow scale={[0.82, 1, 0.78]}><capsuleGeometry args={[0.4, 0.8, 12, 24]} /><meshStandardMaterial color="#1e293b" roughness={0.4} /></mesh>
      <mesh position={[0, -0.05, 0.24]} scale={[0.82, 0.88, 0.1]}><sphereGeometry args={[0.34, 32, 32]} /><meshStandardMaterial color="#ffffff" /></mesh>
    </group>
    <group position={[0, 0.52, 0.22]}>
      <mesh><sphereGeometry args={[0.26]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[0, -0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.07, 0.22, 8]} /><meshStandardMaterial color="#f59e0b" /></mesh>
      <mesh position={[0, -0.15, 0.18]} scale={[0.55, 0.25, 0.12]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} /></mesh>
    </group>
    {/* 侧翼 */}
    <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.5]} scale={[1, 1.4, 0.08]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#1e293b" /></mesh>
    <mesh position={[-0.35, 0, 0]} rotation={[0, 0, 0.5]} scale={[1, 1.4, 0.08]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#1e293b" /></mesh>
    {/* 蹼足 */}
    <mesh position={[0.16, -0.55, 0.25]} scale={[1.2, 0.2, 1.8]}><sphereGeometry args={[0.09]} /><meshStandardMaterial color="#111" /></mesh>
    <mesh position={[-0.16, -0.55, 0.25]} scale={[1.2, 0.2, 1.8]}><sphereGeometry args={[0.09]} /><meshStandardMaterial color="#111" /></mesh>
  </LifeWrapper>
);

// 4. 翠竹 (Bamboo)
const DetailedBamboo = ({ color }: { color: string }) => (
  <group>
    {Array.from({ length: 12 }).map((_, i) => (
      <group key={i} position={[0, i * 0.48, 0]}>
        <mesh><cylinderGeometry args={[0.042, 0.048, 0.46, 16]} /><meshStandardMaterial color={color} roughness={0.3} /></mesh>
        <mesh position={[0, 0.23, 0]}><torusGeometry args={[0.05, 0.01, 8, 24]} /><meshStandardMaterial color="#065f46" /></mesh>
        {/* 写实叶片簇 */}
        {i > 3 && i % 2 === 0 && (
          [0.8, 2.2, 4.5].map((rot, idx) => (
            <group key={idx} rotation={[0, i * 2.5 + rot, 0.8 + idx * 0.1]} position={[0, 0.1, 0]}>
               <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                 <coneGeometry args={[0.05, 0.5, 4]} scale={[1, 1, 0.01]} />
                 <meshStandardMaterial color="#166534" side={2} />
               </mesh>
            </group>
          ))
        )}
      </group>
    ))}
  </group>
);

// 5. 仙人掌 (Cactus)
const DetailedCactus = ({ color }: { color: string }) => (
  <group>
    <group position={[0, 0.6, 0]}>
      <mesh><capsuleGeometry args={[0.23, 1.1, 16, 32]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
      {/* 拟真刺座纵向纹理 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
          <boxGeometry args={[0.008, 1.3, 0.48]} /><meshStandardMaterial color="#052e16" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
    {/* 侧分支 A */}
    <group position={[-0.4, 0.65, 0]} rotation={[0, 0, 1.2]}><mesh><capsuleGeometry args={[0.1, 0.35]} /><meshStandardMaterial color={color} /></mesh></group>
    {/* 侧分支 B */}
    <group position={[0.4, 0.95, 0.1]} rotation={[0.2, 0, -1.2]}><mesh><capsuleGeometry args={[0.11, 0.48]} /><meshStandardMaterial color={color} /></mesh></group>
    {/* 顶端绽放小花 */}
    <group position={[0, 1.25, 0]}>
       {Array.from({ length: 5 }).map((_, i) => (
         <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0.5]} position={[0.04, 0, 0]}>
           <sphereGeometry args={[0.04]} scale={[1.5, 0.2, 0.8]} /><meshStandardMaterial color="#f43f5e" />
         </mesh>
       ))}
       <mesh><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#fbbf24" /></mesh>
    </group>
  </group>
);

// --- 基础处理 ---
const PrimitiveShape = ({ model }: { model: ModelConfig }) => {
  const mat = <meshStandardMaterial color={model.color} metalness={model.metalness} roughness={model.roughness} />;
  switch (model.type) {
    case 'box': return <mesh castShadow><boxGeometry args={[1, 1, 1]} />{mat}</mesh>;
    case 'sphere': return <mesh castShadow><sphereGeometry args={[0.7, 64, 64]} />{mat}</mesh>;
    case 'torus': return <mesh castShadow><torusGeometry args={[0.6, 0.2, 32, 100]} />{mat}</mesh>;
    case 'knot': return <mesh castShadow><torusKnotGeometry args={[0.5, 0.18, 256, 32]} />{mat}</mesh>;
    case 'octahedron': return <mesh castShadow><octahedronGeometry args={[0.8]} />{mat}</mesh>;
    case 'cylinder': return <mesh castShadow><cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />{mat}</mesh>;
    default: return <mesh><sphereGeometry args={[0.6, 64, 64]} />{mat}</mesh>;
  }
};

const ModelShape: React.FC<{ model: ModelConfig }> = ({ model }) => {
  if (model.type === 'panda') return <DetailedPanda />;
  if (model.type === 'elephant') return <DetailedElephant color={model.color} />;
  if (model.type === 'penguin') return <DetailedPenguin />;
  if (model.type === 'bamboo') return <DetailedBamboo color={model.color} />;
  if (model.type === 'cactus') return <DetailedCactus color={model.color} />;

  if (model.category === 'primitive') return <PrimitiveShape model={model} />;
  return (
    <LifeWrapper>
      <mesh castShadow>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial color={model.color} roughness={0.8} />
      </mesh>
    </LifeWrapper>
  );
};

interface ViewerProps {
  model: ModelConfig;
}

const Viewer: React.FC<ViewerProps> = ({ model }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={22} />
      <Suspense fallback={null}>
        <Stage intensity={1.6} environment="studio" adjustCamera={false}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <ModelShape model={model} />
          </Float>
        </Stage>
        <OrbitControls enablePan={false} minDistance={6} maxDistance={18} makeDefault autoRotate autoRotateSpeed={0.5} />
        <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={35} blur={3} far={12} />
      </Suspense>
      <color attach="background" args={['#e0e5ec']} />
      <ambientLight intensity={0.7} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2.8} castShadow />
      <pointLight position={[-15, -10, -15]} intensity={1.2} color={model.color} />
    </Canvas>
  );
};

export default Viewer;
