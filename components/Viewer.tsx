
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ModelConfig } from '../types';

// --- 华南虎专项高精建模组件 ---

const TigerStripes = ({ count = 12 }: { count?: number }) => {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[(i - (count / 2 - 0.5)) * 0.22, 0.05, 0]}>
          <mesh rotation={[0, 0, Math.random() * 0.1 - 0.05]}>
            <boxGeometry args={[0.08, 1.25, 1.55]} />
            <meshStandardMaterial color="#111111" transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const TigerLimb = ({ position, params }: { position: [number, number, number], params: any }) => {
  return (
    <group position={position}>
      {/* 上段 */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.6]} />
        <meshStandardMaterial {...params} />
      </mesh>
      {/* 中段 */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.5]} />
        <meshStandardMaterial {...params} />
      </mesh>
      {/* 下段与爪部 */}
      <group position={[0, -1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.18, 0.4]} />
          <meshStandardMaterial {...params} />
        </mesh>
        {/* 爪部简化圆锥 */}
        <mesh position={[0, -0.2, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
      </group>
    </group>
  );
};

const TigerTail = ({ params }: { params: any }) => {
  return (
    <group position={[-1.25, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-i * 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2 - i * 0.03, 0.2 - (i + 1) * 0.03, 0.25]} />
          <meshStandardMaterial color={i === 4 ? "#000000" : params.color} />
        </mesh>
      ))}
    </group>
  );
};

const TigerModel = ({ params }: { params: any }) => {
  const bellyParams = { ...params, color: "#ffffff", roughness: 0.8 };
  
  return (
    <group>
      {/* 躯干主体 */}
      <group>
        <mesh castShadow>
          <boxGeometry args={[2.5, 1.2, 1.5]} />
          <meshStandardMaterial {...params} />
        </mesh>
        {/* 腹部内层 (纯白) */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[2.52, 0.4, 1.3]} />
          <meshStandardMaterial {...bellyParams} />
        </mesh>
        {/* 黑色横纹 */}
        <TigerStripes count={10} />
      </group>

      {/* 头部特征 */}
      <group position={[1.4, 0.5, 0]}>
        {/* 主头球体 */}
        <mesh castShadow>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial {...params} />
        </mesh>
        {/* 耳朵 (方体拼接 + 内层白贴片) */}
        {[0.4, -0.4].map((z, i) => (
          <group key={i} position={[-0.2, 0.5, z]} rotation={[0, 0, -0.2]}>
            <mesh>
              <boxGeometry args={[0.15, 0.3, 0.3]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <planeGeometry args={[0.25, 0.25]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
        {/* 吻部与粉色鼻端 */}
        <group position={[0.5, -0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh>
            <coneGeometry args={[0.25, 0.5, 8]} />
            <meshStandardMaterial {...params} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>
        </group>
        {/* 琥珀色锐利眼神 */}
        {[0.25, -0.25].map((z, i) => (
          <mesh key={i} position={[0.45, 0.15, z]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#d97706" emissive="#78350f" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* 四肢结构 (三段式) */}
      <TigerLimb position={[0.8, -0.5, 0.5]} params={params} />
      <TigerLimb position={[0.8, -0.5, -0.5]} params={params} />
      <TigerLimb position={[-0.8, -0.5, 0.5]} params={params} />
      <TigerLimb position={[-0.8, -0.5, -0.5]} params={params} />

      {/* 尾部特征 */}
      <TigerTail params={params} />
    </group>
  );
};

// --- 通用动物/植物/几何渲染分发 ---

const AnimalModelDispatcher = ({ type, params }: { type: string, params: any }) => {
  if (type === 'tiger') return <TigerModel params={params} />;
  
  // 大熊猫
  if (type === 'panda') {
    return (
      <group>
        <mesh castShadow><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
        <group position={[0.8, 0.5, 0]}>
          <mesh castShadow><sphereGeometry args={[0.65, 24, 24]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.3, 0.15, 0.25]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color="#000000" /></mesh>
          <mesh position={[0.3, 0.15, -0.25]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color="#000000" /></mesh>
        </group>
        {[[0.5, -0.6, 0.6], [0.5, -0.6, -0.6], [-0.5, -0.6, 0.6], [-0.5, -0.6, -0.6]].map((p, i) => (
          <mesh key={i} position={p as any}><capsuleGeometry args={[0.25, 0.6]} /><meshStandardMaterial color="#000000" /></mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow><boxGeometry args={[1.5, 0.8, 0.8]} /><meshStandardMaterial {...params} /></mesh>
      <mesh position={[0.8, 0.4, 0]}><boxGeometry args={[0.6, 0.6, 0.5]} /><meshStandardMaterial {...params} /></mesh>
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[(i < 2 ? 0.5 : -0.5), -0.6, (i % 2 === 0 ? 0.3 : -0.3)]}><cylinderGeometry args={[0.1, 0.1, 0.5]} /><meshStandardMaterial {...params} /></mesh>
      ))}
    </group>
  );
};

const TreeModel = ({ type, params, model }: { type: string, params: any, model: ModelConfig }) => {
  if (type === 'willow') {
    return (
      <group>
        <mesh castShadow><cylinderGeometry args={[0.12, 0.2, 2.2]} /><meshStandardMaterial color="#451a03" /></mesh>
        {[...Array(14)].map((_, i) => (
          <group key={i} rotation={[0, (i / 14) * Math.PI * 2, 0]} position={[0, 1.3, 0]}>
            <mesh position={[0.55, -0.7, 0]} rotation={[0, 0, -0.4]}>
              <capsuleGeometry args={[0.02, 1.8]} />
              <meshStandardMaterial color={model.color} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === 'cactus') {
    return (
      <group>
        <mesh castShadow><cylinderGeometry args={[0.32, 0.32, 1.9, 8]} /><meshStandardMaterial {...params} /></mesh>
        <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 4.5]}><cylinderGeometry args={[0.16, 0.16, 0.8, 6]} /><meshStandardMaterial {...params} /></mesh>
        <mesh position={[-0.5, 0.8, 0]} rotation={[0, 0, -Math.PI / 4.5]}><cylinderGeometry args={[0.16, 0.16, 0.7, 6]} /><meshStandardMaterial {...params} /></mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow><cylinderGeometry args={[0.18, 0.28, 2.4]} /><meshStandardMaterial color="#3f2305" /></mesh>
      <mesh position={[0, 1.4, 0]} castShadow><sphereGeometry args={[0.9, 10, 10]} /><meshStandardMaterial color={model.color} /></mesh>
    </group>
  );
};

const ModelShape: React.FC<{ model: ModelConfig; params: any }> = ({ model, params }) => {
  if (model.category === 'animal') return <AnimalModelDispatcher type={model.type} params={params} />;
  if (model.category === 'tree') return <TreeModel type={model.type} params={params} model={model} />;
  
  switch (model.type) {
    case 'box': return <mesh castShadow><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial {...params} /></mesh>;
    case 'sphere': return <mesh castShadow><sphereGeometry args={[0.8, 64, 64]} /><meshStandardMaterial {...params} /></mesh>;
    case 'knot': return <mesh castShadow><torusKnotGeometry args={[0.5, 0.2, 128, 32]} /><meshStandardMaterial {...params} /></mesh>;
    case 'torus': return <mesh castShadow><torusGeometry args={[0.6, 0.2, 16, 100]} /><meshStandardMaterial {...params} /></mesh>;
    case 'octahedron': return <mesh castShadow><octahedronGeometry args={[0.9]} /><meshStandardMaterial {...params} /></mesh>;
    default: return <mesh castShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial {...params} /></mesh>;
  }
};

const Viewer: React.FC<{ model: ModelConfig; params: any }> = ({ model, params }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} key={model.id}>
      <PerspectiveCamera makeDefault position={[9, 6, 9]} fov={24} />
      <Suspense fallback={null}>
        <Stage intensity={0.5} adjustCamera={false} shadows="contact" environment="studio">
          <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.2}>
            <ModelShape model={model} params={params} />
          </Float>
        </Stage>
        <OrbitControls enablePan={false} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.7} />
        <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={25} blur={3} far={15} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
      </Suspense>
      <color attach="background" args={[params.bgColor]} />
    </Canvas>
  );
};

export default Viewer;
