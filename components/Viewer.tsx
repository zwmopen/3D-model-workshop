
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ModelConfig } from '../types';

// --- 核心动画外壳 ---
const LifeWrapper = ({ children, speed = 1 }: { children?: React.ReactNode; speed?: number }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime() * speed;
      group.current.position.y += Math.sin(t) * 0.005; // 呼吸浮动
      group.current.rotation.z = Math.sin(t * 0.5) * 0.01; // 极轻微晃动
    }
  });
  return <group ref={group}>{children}</group>;
};

// --- 几何类 (Primitives) ---
const PrimitiveShape = ({ model }: { model: ModelConfig }) => {
  const mat = <meshStandardMaterial color={model.color} metalness={model.metalness} roughness={model.roughness} />;
  switch (model.type) {
    case 'box': return <mesh castShadow receiveShadow><boxGeometry args={[1, 1, 1]} />{mat}</mesh>;
    case 'sphere': return <mesh castShadow receiveShadow><sphereGeometry args={[0.7, 64, 64]} />{mat}</mesh>;
    case 'torus': return <mesh castShadow receiveShadow><torusGeometry args={[0.6, 0.2, 32, 100]} />{mat}</mesh>;
    case 'knot': return <mesh castShadow receiveShadow><torusKnotGeometry args={[0.5, 0.18, 256, 32]} />{mat}</mesh>;
    case 'octahedron': return <mesh castShadow receiveShadow><octahedronGeometry args={[0.8]} />{mat}</mesh>;
    case 'tetrahedron': return <mesh castShadow receiveShadow><tetrahedronGeometry args={[0.8]} />{mat}</mesh>;
    case 'icosahedron': return <mesh castShadow receiveShadow><icosahedronGeometry args={[0.8]} />{mat}</mesh>;
    case 'dodecahedron': return <mesh castShadow receiveShadow><dodecahedronGeometry args={[0.8]} />{mat}</mesh>;
    case 'cylinder': return <mesh castShadow receiveShadow><cylinderGeometry args={[0.5, 0.5, 1, 32]} />{mat}</mesh>;
    case 'cone': return <mesh castShadow receiveShadow><coneGeometry args={[0.6, 1.2, 32]} />{mat}</mesh>;
    case 'capsule': return <mesh castShadow receiveShadow><capsuleGeometry args={[0.4, 0.8, 16, 32]} />{mat}</mesh>;
    case 'ring': return <mesh castShadow receiveShadow><ringGeometry args={[0.4, 0.7, 32]} />{mat}</mesh>;
    case 'tube': return <mesh castShadow receiveShadow><torusGeometry args={[0.6, 0.1, 16, 100]} />{mat}</mesh>;
    case 'torusKnotAlt': return <mesh castShadow receiveShadow><torusKnotGeometry args={[0.5, 0.08, 300, 20, 2, 5]} />{mat}</mesh>;
    case 'plane': return <mesh castShadow receiveShadow><planeGeometry args={[1.5, 1.5]} />{mat}</mesh>;
    case 'circle': return <mesh castShadow receiveShadow><circleGeometry args={[0.8, 64]} />{mat}</mesh>;
    case 'lathe': {
      const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < 10; i++) {
          p.push(new THREE.Vector2(Math.sin(i * 0.4) * 0.4 + 0.3, (i - 5) * 0.2));
        }
        return p;
      }, []);
      return <mesh castShadow receiveShadow><latheGeometry args={[points, 32]} />{mat}</mesh>;
    }
    case 'extrude': return <mesh castShadow receiveShadow><boxGeometry args={[1, 0.5, 1.5]} />{mat}</mesh>; // 简化替代
    case 'polyhedron': return <mesh castShadow receiveShadow><octahedronGeometry args={[0.8, 1]} />{mat}</mesh>;
    case 'dipyramid': return <mesh castShadow receiveShadow rotation={[0,0,Math.PI/4]}><octahedronGeometry args={[0.8]} />{mat}</mesh>;
    default: return <mesh><boxGeometry />{mat}</mesh>;
  }
};

// --- 植物类 (Trees) ---
const TreeShape = ({ model }: { model: ModelConfig }) => {
  const color = model.color;
  switch (model.type) {
    case 'bamboo': return (
      <group>
        {Array.from({ length: 9 }).map((_, i) => (
          <group key={i} position={[0, i * 0.42, 0]}>
            <mesh><cylinderGeometry args={[0.03, 0.035, 0.4, 16]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.038, 0.005, 8, 16]} /><meshStandardMaterial color="#064e3b" /></mesh>
          </group>
        ))}
      </group>
    );
    case 'ginkgo': return (
      <group>
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.06, 0.1, 1.2]} /><meshStandardMaterial color="#5d4037" /></mesh>
        {Array.from({ length: 50 }).map((_, i) => (
          <mesh key={i} position={[Math.cos(i) * 0.5, 0.6 + Math.random() * 1.5, Math.sin(i) * 0.5]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <cylinderGeometry args={[0.15, 0.01, 0.001, 3, 1, false, 0, Math.PI / 2]} /><meshStandardMaterial color={color} side={2} />
          </mesh>
        ))}
      </group>
    );
    case 'willow': return (
      <group>
        <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.07, 0.12, 1.6]} /><meshStandardMaterial color="#4e342e" /></mesh>
        {Array.from({ length: 32 }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 32, 0]} position={[0, 1.6, 0]}>
            <mesh position={[0, -0.8, 0]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.005, 1.8]} /><meshStandardMaterial color={color} />
            </mesh>
          </group>
        ))}
      </group>
    );
    case 'oak': return (
      <group>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.35, 1]} /><meshStandardMaterial color="#3e2723" /></mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 0.6, 1.2 + Math.random()*0.5, Math.cos(i) * 0.6]} scale={1.2}>
            <sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    );
    case 'redwood': return (
      <group>
        <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.1, 0.4, 3, 16]} /><meshStandardMaterial color="#451a03" /></mesh>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={i} position={[0, 1 + i * 0.2, 0]} rotation={[0, i, 0]}>
            <coneGeometry args={[1 - i*0.05, 0.3, 12]} /><meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    );
    case 'banana': return (
      <group>
        <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.08, 0.15, 1.6]} /><meshStandardMaterial color="#86efac" /></mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 6, 0.5]} position={[0, 1.6, 0]}>
            <mesh position={[0.5, 0, 0]} rotation={[0, 0.5, 0]}>
              <boxGeometry args={[1, 0.01, 0.4]} /><meshStandardMaterial color={color} side={2} />
            </mesh>
          </group>
        ))}
      </group>
    );
    default: return (
      <group>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.1, 0.2, 1]} /><meshStandardMaterial color="#5d4037" /></mesh>
        <mesh position={[0, 1.2, 0]}><sphereGeometry args={[0.8]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    );
  }
};

// --- 动物类 (Animals) ---
const AnimalShape = ({ model }: { model: ModelConfig }) => {
  const color = model.color;
  switch (model.type) {
    case 'elephant': return (
      <LifeWrapper speed={0.6}>
        {/* 躯干 */}
        <mesh castShadow><capsuleGeometry args={[0.45, 0.7]} rotation={[Math.PI/2,0,0]} /><meshStandardMaterial color={color} /></mesh>
        {/* 头部 */}
        <group position={[0, 0.3, 0.6]}>
          <mesh><sphereGeometry args={[0.4]} /><meshStandardMaterial color={color} /></mesh>
          {/* 象鼻 */}
          {Array.from({length: 6}).map((_, i) => (
             <mesh key={i} position={[0, -i*0.15, i*0.05]} rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.12 - i*0.015, 0.1 - i*0.015, 0.2]} /><meshStandardMaterial color={color} />
             </mesh>
          ))}
          {/* 耳朵 */}
          <mesh position={[0.4, 0.1, -0.1]} rotation={[0, -0.5, 0]}><boxGeometry args={[0.1, 0.5, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[-0.4, 0.1, -0.1]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.1, 0.5, 0.4]} /><meshStandardMaterial color={color} /></mesh>
        </group>
        {/* 腿 */}
        {[[-0.3,-0.5,0.3],[0.3,-0.5,0.3],[-0.3,-0.5,-0.3],[0.3,-0.5,-0.3]].map((p,i)=>(
          <mesh key={i} position={p as any}><cylinderGeometry args={[0.15,0.15,0.6]} /><meshStandardMaterial color={color} /></mesh>
        ))}
      </LifeWrapper>
    );
    case 'lion': return (
      <LifeWrapper speed={1.2}>
        <mesh><boxGeometry args={[0.8, 0.5, 0.4]} /><meshStandardMaterial color={color} /></mesh>
        <group position={[0.5, 0.3, 0]}>
          {/* 鬃毛 */}
          <mesh scale={1.2}><sphereGeometry args={[0.35, 12, 12]} /><meshStandardMaterial color="#78350f" /></mesh>
          <mesh><sphereGeometry args={[0.3]} /><meshStandardMaterial color={color} /></mesh>
        </group>
        {[[-0.3,-0.4,0.15],[0.3,-0.4,0.15],[-0.3,-0.4,-0.15],[0.3,-0.4,-0.15]].map((p,i)=>(
          <mesh key={i} position={p as any}><cylinderGeometry args={[0.08,0.08,0.5]} /><meshStandardMaterial color={color} /></mesh>
        ))}
      </LifeWrapper>
    );
    case 'crab': return (
      <LifeWrapper speed={2}>
        <mesh scale={[1.2, 0.5, 1]}><sphereGeometry args={[0.4]} /><meshStandardMaterial color={color} /></mesh>
        {/* 蟹足 */}
        {Array.from({length: 8}).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.02, 0.02, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        ))}
        {/* 螯 */}
        <mesh position={[0.4, 0, 0.4]} rotation={[0, 0.8, 0.4]}><capsuleGeometry args={[0.1, 0.2]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[-0.4, 0, 0.4]} rotation={[0, -0.8, 0.4]}><capsuleGeometry args={[0.1, 0.2]} /><meshStandardMaterial color={color} /></mesh>
      </LifeWrapper>
    );
    case 'butterfly': return (
      <LifeWrapper speed={3}>
        <mesh><capsuleGeometry args={[0.05, 0.4]} /><meshStandardMaterial color="#000" /></mesh>
        <group rotation={[0, 0, 0.5]} position={[0.3, 0, 0]}>
          <mesh rotation={[Math.PI/2, 0, 0]}><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial color={color} side={2} transparent opacity={0.8} /></mesh>
        </group>
        <group rotation={[0, 0, -0.5]} position={[-0.3, 0, 0]}>
          <mesh rotation={[Math.PI/2, 0, 0]}><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial color={color} side={2} transparent opacity={0.8} /></mesh>
        </group>
      </LifeWrapper>
    );
    default: return (
      <LifeWrapper>
        <mesh><sphereGeometry args={[0.5]} /><meshStandardMaterial color={color} /></mesh>
      </LifeWrapper>
    );
  }
};

const ModelShape: React.FC<{ model: ModelConfig }> = ({ model }) => {
  if (model.category === 'primitive') return <PrimitiveShape model={model} />;
  if (model.category === 'tree') return <TreeShape model={model} />;
  if (model.category === 'animal') return <AnimalShape model={model} />;
  return null;
};

interface ViewerProps {
  model: ModelConfig;
}

const Viewer: React.FC<ViewerProps> = ({ model }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={28} />
      <Suspense fallback={null}>
        <Stage intensity={1.2} environment="city" adjustCamera={false}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <ModelShape model={model} />
          </Float>
        </Stage>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={20} makeDefault autoRotate autoRotateSpeed={0.5} />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={25} blur={2.5} far={10} />
      </Suspense>
      <color attach="background" args={['#e0e5ec']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -5, -10]} intensity={1} color={model.color} />
    </Canvas>
  );
};

export default Viewer;
