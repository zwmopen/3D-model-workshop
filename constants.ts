
import { ModelConfig } from './types';

const generatePrimitiveModels = (): ModelConfig[] => {
  const types: any[] = [
    ['工业倒角方体', 'box', '📦'], ['高精校准球', 'sphere', '🔮'], ['莫比乌斯环', 'knot', '🥨'], ['几何圆环', 'torus', '🍩'],
    ['正八面体', 'octahedron', '💎'], ['正四面体', 'tetrahedron', '🔺'], ['二十面体', 'icosahedron', '🔷'], ['十二面体', 'dodecahedron', '⬢'],
    ['工程圆柱', 'cylinder', '🧪'], ['精控圆锥', 'cone', '🍦'], ['参数化胶囊', 'capsule', '💊'], ['薄层圆环', 'ring', '⭕'],
    ['工业管道', 'tube', '➰'], ['异形结节', 'torusKnotAlt', '🌀'], ['标准平面', 'plane', '📄'], ['工程圆片', 'circle', '⚪'],
    ['回转几何', 'lathe', '🏺'], ['挤压异形', 'extrude', '🧱'], ['复杂多面体', 'polyhedron', '💠'], ['双角锥体', 'dipyramid', '💎']
  ];
  return types.map((t, i) => ({
    id: `p-${i}`,
    category: 'primitive',
    name: t[0],
    type: t[1],
    color: '#6366f1',
    metalness: 0.6,
    roughness: 0.2,
    emoji: t[2],
    description: `# ${t[0]} 3D 设计说明卡片
**核心设计目标**：构建标准化的硬表面建模单元，展示极高的拓扑精度与材质反射表现。

**特征还原要点**：
- 几何精度：基于 SubDivision 算法优化的表面细分，确保在微距下依然平滑。
- 材质对冲：金属感边框与高分子涂层，展现工业设计中的材质对比美学。
- 光影表现：侧重反射贴图在曲面上的平滑过渡，消除任何锯齿感。

**技术参数**：
- 基础几何体：${t[1]}
- 细分等级：Level 3 (高精度渲染模式)
- 适配优化：支持实时布尔运算预览与物理材质测试。`
  }));
};

const generateTreeModels = (): ModelConfig[] => {
  const types: any[] = [
    ['江南垂柳', 'willow', '🌿'], ['沙漠仙人掌', 'cactus', '🌵'], ['高山云松', 'pine', '🌲'], ['千年古柏', 'cypress', '🌳'],
    ['清幽翠竹', 'bamboo', '🎋'], ['烂漫樱花', 'cherry', '🌸'], ['金秋银杏', 'ginkgo', '🍂'], ['热带棕榈', 'palm', '🌴'],
    ['火红枫树', 'maple', '🍁'], ['庭院灌木', 'shrub', '🌳'], ['非洲猴面包树', 'baobab', '🪵'], ['百年橡树', 'oak', '🌳'],
    ['挺拔白杨', 'poplar', '🎋'], ['优雅白桦', 'birch', '⚪'], ['精致盆景', 'bonsai', '🪴'], ['红树林', 'mangrove', '🛶'],
    ['巨型红杉', 'redwood', '🌲'], ['丰收苹果树', 'apple', '🍎'], ['香蕉树', 'banana', '🍌'], ['远古蕨类', 'fern', '🌿']
  ];
  return types.map((t, i) => ({
    id: `t-${i}`,
    category: 'tree',
    name: t[0],
    type: t[1],
    color: '#16a34a',
    metalness: 0.05,
    roughness: 0.9,
    emoji: t[2],
    description: `# ${t[0]} Low-Poly 3D 设计说明卡片
**核心设计目标**：通过极致精简的低多边形面片组合，还原自然界植物的生长韵律与色彩层次。

**特征还原要点**：
- 结构拓扑：分段式主干与随机偏移的冠部几何，模拟自然生长的随机性。
- 视觉风格：江南园林或荒漠风格，侧重阴影在几何面上的硬核表现。
- 材质质感：利用高粗糙度材质模拟植物表皮，增加细节真实度。

**技术参数**：
- 基础几何体：CylinderGeometry (主干), Sphere/Plane (冠部)
- 动画特性：支持 WindSway (风动) 着色器偏移量。
- 适配优化：在移动端保持极低的面数占用，确保秒开预览。`
  }));
};

const generateAnimalModels = (): ModelConfig[] => {
  const types: any[] = [
    ['华南虎', 'tiger', '🐯'], ['国宝大熊猫', 'panda', '🐼'], ['南极企鹅', 'penguin', '🐧'], ['深海座头鲸', 'whale', '🐋'],
    ['长颈鹿', 'giraffe', '🦒'], ['金雕', 'eagle', '🦅'], ['草原雄狮', 'lion', '🦁'], ['亚洲象', 'elephant', '🐘'],
    ['雪兔', 'rabbit', '🐰'], ['响尾蛇', 'snake', '🐍'], ['狼蛛', 'spider', '🕷️'], ['大白鲨', 'shark', '🦈'],
    ['幻紫蝴蝶', 'butterfly', '🦋'], ['汗血宝马', 'horse', '🐎'], ['赤狐', 'fox', '🦊'], ['雪鸮', 'owl', '🦉'],
    ['湾鳄', 'crocodile', '🐊'], ['红袋鼠', 'kangaroo', '🦘'], ['中华锦绣蟹', 'crab', '🦀'], ['灵长猕猴', 'monkey' as any, '🐒']
  ];
  return types.map((t, i) => {
    let description = `# ${t[0]} Low-Poly 3D 设计说明卡片
**核心设计目标**：解构生物解剖特征，以最少几何体还原物种辨识度，实现艺术化写实效果。

**特征还原要点**：
- 比例还原：严格遵循该物种躯干、四肢与头部的标准比例关系。
- 细节抽象：利用球体、方体、圆柱等基础形状，通过布尔嵌套实现标志性特征。
- 动态中心：优化质心位置，确保在 3D 旋转预览下体态稳定自然。

**技术参数**：
- 基础几何体：Box/Cylinder/Sphere 复合建模
- 骨骼绑定：预设 8-12 处活动关节点，支持基础待机动画。
- 验收标准：模型在 1:1.5 的极端比例缩放下不产生几何形变。`;

    if (t[1] === 'tiger') {
      description = `# 华南虎 3D 设计说明卡片

### 一、核心设计目标
基于华南虎物种特征，通过解剖结构拆解 + 基础几何体拼接，实现低模风格下的高辨识度写实效果；支持体型比例、毛色深浅等参数调节，适配多光照场景渲染。

### 二、物种特征还原要点
| 结构部位 | 特征描述 | 3D 建模实现方案 |
| :--- | :--- | :--- |
| **整体体型** | 体型健硕，肩高约 0.8m，体长约 2.5m，躯干与四肢比例 3:2 | 以缩放立方体作为躯干主体，通过 bodyRatio 参数控制躯干与四肢比例 |
| **毛色与斑纹** | 主体毛色为橙黄色，腹部、四肢内侧为纯白色；通体分布黑色横纹，横纹呈菱形且从背部向腹部延伸变细 | 1. 躯干分双层几何体：外层橙黄色主躯干，内层白色腹部<br>2. 黑色横纹采用扁平长方体嵌套，随机旋转角度模拟自然纹理<br>3. 通过 stripeDensity 参数控制横纹数量与粗细 |
| **头部特征** | 头圆耳短，耳背黑色带白斑；吻部较短，鼻端粉色；眼部呈琥珀色，眼神锐利 | 1. 球体作为头部基础，小型立方体拼接成耳朵，耳内添加白色贴片<br>2. 圆锥体简化吻部结构，粉色材质模拟鼻端<br>3. 半球体模拟眼球，琥珀色半透明材质 + 高光点提升写实感 |
| **四肢结构** | 四肢粗壮，前肢比后肢略长，每肢分 3 段关节，爪部尖锐 | 采用分段式圆柱体拼接，3 段关节依次缩小半径；爪部用小圆锥体附着末端 |
| **尾部特征** | 尾长约 1m，约占体长 40%，尾尖黑色，尾身布横纹 | 5 段圆柱体渐变拼接，从根部到尾尖半径递减；尾尖段采用黑色材质，尾身延续躯干横纹纹理 |

### 三、技术实现参数
#### 1. 基础几何体组合清单
- **躯干**: BoxGeometry (width:2.5, height:1.2, depth:1.5). 材质：橙黄色 MeshStandardMaterial, roughness:0.7, metalness:0.1; 腹部内层：纯白色.
- **头部**: SphereGeometry (radius:0.6). 橙黄色主体材质.
- **四肢**: CylinderGeometry (三段式：radius 0.3→0.2). 橙黄色主体，内侧拼接白色贴片.
- **尾部**: CylinderGeometry (5 段渐变：radius 0.2→0.08). 尾尖黑色材质.
- **斑纹**: BoxGeometry (width:0.3, height:0.05, depth:1.8). 黑色透明度 0.9.

#### 2. 可交互调节参数
- **modelScale** (0.5 - 2.0): 控制模型整体缩放比例.
- **bodyRatio** (1.0 - 1.5): 调节躯干与四肢的比例，数值越大躯干越粗壮.
- **stripeDensity** (5 - 15): 控制黑色横纹数量.
- **furColor**: 自定义躯干主体毛色 (默认 #FF9933).`;
    }

    return {
      id: `a-${i}`,
      category: 'animal',
      name: t[0],
      type: t[1],
      color: t[1] === 'tiger' ? '#FF9933' : '#f97316',
      metalness: 0.1,
      roughness: 0.8,
      emoji: t[2],
      description: description
    };
  });
};

export const MODELS: ModelConfig[] = [
  ...generateAnimalModels(),
  ...generateTreeModels(),
  ...generatePrimitiveModels()
];
