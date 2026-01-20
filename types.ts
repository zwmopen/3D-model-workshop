
export type ModelType = 
  // 几何类 (20种)
  | 'box' | 'sphere' | 'torus' | 'knot' | 'octahedron' | 'tetrahedron' | 'icosahedron' | 'dodecahedron' 
  | 'cylinder' | 'cone' | 'capsule' | 'ring' | 'tube' | 'torusKnotAlt' | 'plane' | 'circle' | 'lathe' | 'extrude' | 'polyhedron' | 'dipyramid'
  // 植物类 (20种)
  | 'bamboo' | 'cherry' | 'ginkgo' | 'pine' | 'willow' | 'palm' | 'maple' | 'cactus' | 'shrub' | 'baobab'
  | 'oak' | 'cypress' | 'poplar' | 'birch' | 'bonsai' | 'mangrove' | 'redwood' | 'apple' | 'banana' | 'fern'
  // 动物类 (20种)
  | 'panda' | 'tiger' | 'penguin' | 'whale' | 'rabbit' | 'giraffe' | 'dog' | 'eagle' | 'snake' | 'spider'
  | 'elephant' | 'lion' | 'shark' | 'butterfly' | 'horse' | 'fox' | 'owl' | 'crocodile' | 'kangaroo' | 'crab';

export type Category = 'primitive' | 'tree' | 'animal';

export interface ModelConfig {
  id: string;
  name: string;
  type: ModelType;
  category: Category;
  color: string;
  metalness: number;
  roughness: number;
  description: string;
  emoji: string; // 必须有图标
}

export type ViewMode = 'preview' | 'code';
