import React, { useState, useRef, useEffect, Suspense, useMemo, useCallback, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress, Html, useGLTF, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';

// 导入图片
import placeholderImg from '../images/beers/Ritual De Lo Habitual-NOW.jpg';
import freedomImg from '../images/beers/Freedom.jpg';
import yoseRoseImg from '../images/beers/Yose Rose.jpg';
import amongstTheHerdImg from '../images/beers/Amongst The Herd.jpg';
import belliniSourImg from '../images/beers/Bellini Sour.jpg';
import megsyGingerImg from '../images/beers/Megsy Ginger.jpg';
import secretCircleImg from '../images/beers/Secret Circle.jpg';
import springPandanImg from '../images/beers/Spring Pandan.jpg';
import wintermelonOolongImg from '../images/beers/Wintermelon Oolong.jpg';
import cacaoStoutImg from '../images/beers/Cacao Stout.jpg';
import earthImg from '../images/beers/Earth.jpg';
import raspberryCreamImg from '../images/beers/Raspberry & Cream.jpg';
import theMangoManImg from '../images/beers/The Mango Man.jpg';
import windImg from '../images/beers/Wind.jpg';
import yellowVanImg from '../images/beers/Yellow Van.jpg';

// 导入啤酒数据
import menuData from '../data/menu.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Beer {
  Name: string;
  "Price (SGD)": string | number;
  Type: string;
  ABV: string;
  Origin: string;
  Volume: string;
  Description: string;
  Taste: string;
  Ingredient: string;
  "Suitable mood": string;
  "Suitable Scene": string;
  "Health Level": string;
  "": string;
}

// 图片映射对象
const beerImages: Record<string, string> = {
  'Freedom': freedomImg,
  'Vose Rose': yoseRoseImg,
  'Amongst The Herd': amongstTheHerdImg,
  'Bellini Sour': belliniSourImg,
  'Megsy Ginger': megsyGingerImg,
  'Secret Circle': secretCircleImg,
  'Spring Pandan': springPandanImg,
  'Wintermelon Oolong': wintermelonOolongImg,
  'Cacao Stout': cacaoStoutImg,
  'Earth': earthImg,
  'Raspberry & Cream': raspberryCreamImg,
  'The Mango Man': theMangoManImg,
  'Wind': windImg,
  'Yellow Van': yellowVanImg,
  'Ritual De Lo Habitual-NOW': placeholderImg
};

// 获取啤酒图片
const getBeerImage = (beerName: string): string => {
  return beerImages[beerName] || placeholderImg;
};

// 啤酒卡片组件
const BeerCard: React.FC<{ beer: Beer }> = ({ beer }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 my-4">
      {/* 啤酒图片 */}
      <div className="w-full bg-gray-100">
        <img
          src={imageError ? placeholderImg : getBeerImage(beer.Name)}
          alt={beer.Name}
          className="w-full h-auto aspect-[4/3] object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{beer.Name}</h3>
          <div className="text-red-500 text-lg font-medium">
            ${beer["Price (SGD)"]}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {beer.Type}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {beer.ABV}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {beer.Volume}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Origin:</span> {beer.Origin}
        </div>
        
        <p className="text-gray-700 text-sm mb-4">{beer.Description}</p>
      </div>
    </div>
  );
};

// Dify API 配置
const DIFY_API_KEY = 'app-lrAlpUg3loqDNxgQlE1c6woM';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

// 加载进度组件
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % Loading</Html>;
}

// 模型文件路径配置
const MODEL_PATHS = [
  '/tiaohai-web/models/glass.glb',
  '/tiaohai-web/models/1.glb',
  '/tiaohai-web/models/2.glb'
];

// 地板组件
function Floor(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#222222" transparent opacity={0} />
    </mesh>
  );
}

// 修改原有的LiquidParticles组件使其支持多批次和自然消失
function LiquidParticles({ position, color, active, velocity, params }: { 
  position: [number, number, number], 
  color: string,
  active: boolean,
  velocity?: [number, number, number],
  params?: {
    count: number,
    scale: number,
    lifespan: number,
    velocityMult: number,
    spread: number,
    gravity: number
  }
}) {
  // 默认参数
  const defaultParams = {
    count: 200,
    scale: 0.05,
    lifespan: 1.0,
    velocityMult: 1.0,
    spread: 0.3,
    gravity: 0.05
  };
  
  // 使用提供的参数或默认值
  const finalParams = params || defaultParams;
  const count = finalParams.count;
  
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  // 粒子状态，初始化为空数组
  const particles = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    scale: number;
    life: number;
    maxLife: number;
    opacity: number;
  }>>([]);
  
  // 粒子材质
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  
  // 控制粒子生成的标志
  const [initialized, setInitialized] = useState(false);
  
  // 初始化粒子数组
  const initializeParticles = useCallback(() => {
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      // 随机角度分布在球面上
      const angle = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const planarRadius = Math.sqrt(1 - z * z);
      const x = planarRadius * Math.cos(angle);
      const y = planarRadius * Math.sin(angle);
      
      // 基础速度，大部分粒子向上和向外，增大速度和范围
      const baseVelocity = new THREE.Vector3(
        x * (0.3 + Math.random() * 0.6) * finalParams.velocityMult,
        (0.5 + Math.random() * 0.8) * finalParams.velocityMult, // 更大的向上速度
        z * (0.3 + Math.random() * 0.6) * finalParams.velocityMult
      );
      
      // 如果有外部速度，添加影响
      if (velocity) {
        baseVelocity.x += velocity[0] * 0.3 * Math.random();
        baseVelocity.y += Math.abs(velocity[1]) * 0.2 * Math.random(); // 更大的垂直速度影响
        baseVelocity.z += velocity[2] * 0.3 * Math.random();
      }
      
      // 随机化生命周期和大小，增加变化性
      const lifeVariation = 0.7 + Math.random() * 0.8;
      const sizeVariation = 0.7 + Math.random() * 0.8; // 增大尺寸随机范围
      
      newParticles.push({
        position: new THREE.Vector3(
          position[0] + (Math.random() - 0.5) * finalParams.spread * 1.2, // 增大水平扩散
          position[1] + (Math.random() - 0.5) * finalParams.spread * 0.4, // 减少垂直方向的初始扩散
          position[2] + (Math.random() - 0.5) * finalParams.spread * 1.2  // 增大深度扩散
        ),
        velocity: baseVelocity,
        scale: finalParams.scale * sizeVariation,
        life: 0,
        maxLife: finalParams.lifespan * lifeVariation,
        opacity: 0.8 + Math.random() * 0.2
      });
    }
    
    particles.current = newParticles;
    setInitialized(true);
  }, [count, finalParams, position, velocity]);
  
  // 当组件挂载和active变化时初始化粒子
  useEffect(() => {
    if (active && !initialized) {
      initializeParticles();
    }
  }, [active, initialized, initializeParticles]);
  
  // 更新粒子
  useFrame((_, delta) => {
    if (!initialized || !mesh.current || particles.current.length === 0) {
      return;
    }
    
    let allDead = true;
    
    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      
      // 更新生命周期
      p.life += delta;
      
      if (p.life <= p.maxLife) {
        allDead = false;
        
        // 应用重力和移动 - 增加重力影响和移动速度
        p.velocity.y -= finalParams.gravity * delta * 2; // 加倍重力效果
        // 增加水平阻力，模拟空气阻力
        p.velocity.x *= 0.98;
        p.velocity.z *= 0.98;
        // 更快的移动速度
        p.position.x += p.velocity.x * delta * 2.5;
        p.position.y += p.velocity.y * delta * 2.5;
        p.position.z += p.velocity.z * delta * 2.5;
        
        // 随时间缩小
        const lifeRatio = p.life / p.maxLife;
        const currentScale = p.scale * (1 - lifeRatio * 0.8); // 更快缩小
        
        // 更新透明度 - 淡入淡出效果
        let opacity = p.opacity;
        
        // 前10%淡入
        if (lifeRatio < 0.1) {
          opacity = p.opacity * (lifeRatio / 0.1);
        } 
        // 后40%淡出 - 提前开始淡出
        else if (lifeRatio > 0.6) {
          opacity = p.opacity * (1.0 - ((lifeRatio - 0.6) / 0.4));
        }
        
        // 应用到实例
        const dummy = new THREE.Object3D();
        dummy.position.copy(p.position);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        
        // 更新材质透明度
        if (materialRef.current) {
          materialRef.current.opacity = opacity;
        }
      } else {
        // 隐藏死亡粒子
        const dummy = new THREE.Object3D();
        dummy.position.set(1000, 1000, 1000); // 移到很远处
        dummy.scale.set(0.001, 0.001, 0.001); // 缩小到看不见
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
    
    // 所有粒子都死亡后，重置组件
    if (allDead) {
      setInitialized(false);
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={color} 
        transparent 
        opacity={0.7} 
          roughness={0.1}
        metalness={0.2}
        emissive={color}
          emissiveIntensity={0.2}
        />
    </instancedMesh>
  );
}

// 物理模型组件
function PhysicalModel({ modelPath, position, impulse, delay = 0, modelId }: { 
  modelPath: string, 
  position: [number, number, number], 
  impulse: [number, number, number],
  delay?: number,
  modelId: number
}) {
  // 使用圆形碰撞体以获得更好的碰撞效果
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position,
    args: [0.8], // 球形碰撞体半径
    material: { restitution: 0.8 }, // 增加弹性
    collisionFilterGroup: 1, // 设置碰撞组
    collisionFilterMask: 1, // 设置可与哪些组碰撞
  }));
  
  const gltf = useGLTF(modelPath) as { scene: THREE.Group };
  const { scene } = gltf;
  
  // 克隆模型场景以避免多实例问题
  const clonedScene = React.useMemo(() => {
    return scene?.clone();
  }, [scene]);
  
  // 添加随机自旋转
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });
  
  // 粒子系统状态
  const [particlePosition, setParticlePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [particleVelocity, setParticleVelocity] = useState<[number, number, number]>([0, 0, 0]);
  // 在组件顶层声明引用，而不是在useEffect内部
  const prevVelocityRef = useRef<THREE.Vector3 | null>(null);
  const lastSplashTimeRef = useRef<number>(0);
  const lastPositionRef = useRef<[number, number, number]>([0, 0, 0]);
  const movingDirectionRef = useRef<'up' | 'down' | 'none'>('none');
  
  // 使用React状态管理粒子批次
  const [particleBatches, setParticleBatches] = useState<Array<{
    id: number;
    position: [number, number, number];
    velocity: [number, number, number];
    type: 'splash' | 'flow';
    color: string;
    active: boolean;
  }>>([]);
  
  // 为不同模型选择不同的液体颜色
  const liquidColor = useMemo(() => {
    const colors = ['#f9a825', '#e57373', '#81c784']; // 黄色啤酒, 红色, 绿色
    return colors[modelId % colors.length];
  }, [modelId]);
  
  // 添加新的粒子批次
  const addParticleBatch = useCallback((position: [number, number, number], velocity: [number, number, number], type: 'splash' | 'flow') => {
    const newBatch = {
      id: Date.now() + Math.random(), // 使用时间戳+随机数作为唯一ID
      position,
      velocity,
      type,
      color: liquidColor,
      active: true
    };
    
    setParticleBatches(prev => [...prev, newBatch]);
    
    // 5秒后从状态中移除这个批次
    setTimeout(() => {
      setParticleBatches(prev => 
        prev.filter(batch => batch.id !== newBatch.id)
      );
    }, 5000);
    
    return newBatch;
  }, [liquidColor]);
  
  // 跟踪位置和速度
  useEffect(() => {
    // 更新位置并检测方向变化
    const positionUnsub = api.position.subscribe((newPos) => {
      // 记录之前的位置
      const prevY = lastPositionRef.current[1];
      lastPositionRef.current = [newPos[0], newPos[1], newPos[2]];
      
      // 设置粒子位置（在杯子上方）
      setParticlePosition([
        newPos[0], 
        newPos[1] + 0.5, // 稍微在模型上方
        newPos[2]
      ]);
    });
    
    // 监听速度变化以检测上抛和下落
    const velocityUnsub = api.velocity.subscribe((vel) => {
      setParticleVelocity([vel[0], vel[1], vel[2]]);
      
      const verticalSpeed = vel[1];
      const now = Date.now();
      
      // 确定运动方向（上升、下降或静止）
      const prevDirection = movingDirectionRef.current;
      const currentDirection = verticalSpeed > 0.5 ? 'up' : verticalSpeed < -0.5 ? 'down' : 'none';
      movingDirectionRef.current = currentDirection as 'up' | 'down' | 'none';
      
      // 检测方向变化（上升到下降或下降到上升）
      const directionChanged = (prevDirection === 'up' && currentDirection === 'down') || 
                               (prevDirection === 'down' && currentDirection === 'up');
      
      // 时间间隔控制，防止过度触发
      const timeSinceLastSplash = now - lastSplashTimeRef.current;
      
      // 正在快速移动（上升或下降）
      const isMovingFast = Math.abs(verticalSpeed) > 4;
      
      // 触发条件：1. 方向改变 2. 速度足够快 3. 与上次触发有足够间隔
      if ((directionChanged || isMovingFast) && timeSinceLastSplash > 300) {
        lastSplashTimeRef.current = now;
        
        // 如果是碰撞导致的方向变化，使用飞溅效果
        if (directionChanged) {
          addParticleBatch(
            particlePosition,
            particleVelocity,
            'splash'
          );
        } 
        // 如果只是快速移动，使用流动效果
        else if (isMovingFast) {
          addParticleBatch(
            particlePosition,
            particleVelocity,
            'flow'
          );
        }
      }
    });
    
    return () => {
      positionUnsub();
      velocityUnsub();
    };
  }, [api, addParticleBatch, particlePosition, particleVelocity]);
  
  // 检测速度变化触发飞溅
  useEffect(() => {
    const velocityUnsub = api.velocity.subscribe((vel) => {
      const currentVel = new THREE.Vector3(vel[0], vel[1], vel[2]);
      
      if (prevVelocityRef.current) {
        // 计算速度变化
        const deltaV = new THREE.Vector3().subVectors(currentVel, prevVelocityRef.current);
        const changeAmount = deltaV.length();
        
        // 如果速度变化足够大，触发飞溅
        if (changeAmount > 2.5) {
          const now = Date.now();
          // 时间间隔控制
          if (now - lastSplashTimeRef.current > 300) {
            lastSplashTimeRef.current = now;
            addParticleBatch(
              particlePosition,
              particleVelocity,
              'splash'
            );
          }
        }
      }
      
      prevVelocityRef.current = currentVel;
    });
    
    return velocityUnsub;
  }, [api, addParticleBatch, particlePosition, particleVelocity]);
  
  // 确保只在组件挂载时应用一次冲量
  useEffect(() => {
    console.log(`应用冲量: ${impulse} 到模型 ${modelId}, 延迟: ${delay}ms`);
    const timer = setTimeout(() => {
      api.position.set(position[0], position[1], position[2]);
      api.velocity.set(0, 0, 0);
      api.applyImpulse([impulse[0], impulse[1], impulse[2]], [0, 0, 0]);
      console.log(`冲量已应用到模型 ${modelId}`);
    }, delay);
    return () => clearTimeout(timer);
  }, [api, position, impulse, delay, modelId]);
  
  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        {clonedScene && <primitive object={clonedScene} scale={2.5} />}
          </mesh>
      {particleBatches.map(batch => (
        <LiquidParticles
          key={batch.id}
          position={batch.position}
          color={batch.color}
          active={batch.active}
          velocity={batch.velocity}
          params={batch.type === 'splash' ? {
            count: 400,
            scale: 0.08,
            lifespan: 1.2,
            velocityMult: 1.6,
            spread: 0.8,
            gravity: 0.15
          } : {
            count: 200,
            scale: 0.05,
            lifespan: 0.8,
            velocityMult: 0.7,
            spread: 0.4,
            gravity: 0.12
          }}
        />
      ))}
    </>
  );
}

// 预加载所有模型
MODEL_PATHS.forEach(path => {
  useGLTF.preload(path);
});

// 3D场景组件
function BeerScene() {
  const [models, setModels] = useState<Array<{
    id: number;
    path: string;
    position: [number, number, number];
    impulse: [number, number, number];
  }>>([]);
  
  // 生成随机冲量
  const generateRandomImpulse = (index: number): [number, number, number] => {
    const randomX = (Math.random() - 0.5) * 3;
    const baseY = 10 + Math.random() * 3; // 更大的向上力度
    return [randomX, baseY, 0];
  };

  // 获取模型初始位置
  const getInitialPosition = (index: number): [number, number, number] => {
    return [(index - 1) * 2.5, -4, 0]; // 水平分散位置，在底部
  };

  // 创建新一组模型
  const createNewModels = () => {
    const timestamp = Date.now();
    return MODEL_PATHS.map((path, index) => ({
      id: timestamp + index,
      path,
      position: getInitialPosition(index),
      impulse: generateRandomImpulse(index)
    }));
  };

  // 初始化和间隔发射模型
  useEffect(() => {
    // 初始设置
    setModels(createNewModels());
    
    // 每5秒重新发射一次
    const interval = setInterval(() => {
      console.log("创建新一组模型");
      setModels(createNewModels());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['#222']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Physics gravity={[0, -9.8, 0]}> {/* 使用标准重力 */}
        <Suspense fallback={<Loader />}>
            {models.map((model, index) => (
              <PhysicalModel 
                key={`${model.id}`}
                modelPath={model.path}
                position={model.position}
                impulse={model.impulse}
                delay={index * 100} // 稍微错开发射时间
                modelId={index}
              />
            ))}
            <Floor position={[0, -6, 0]} />
          <Environment preset="city" />
        </Suspense>
        </Physics>
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedBeers, setDetectedBeers] = useState<Beer[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 过滤有效的啤酒数据
  const validBeers: Beer[] = menuData.filter((item: any): item is Beer => 
    'Type' in item && item.Name && item.Name.trim() !== ''
  );

  // 检测消息中的啤酒名称
  const detectBeersInMessage = (message: string) => {
    const foundBeers: Beer[] = [];
    
    validBeers.forEach(beer => {
      if (message.includes(beer.Name)) {
        foundBeers.push(beer);
      }
    });
    
    return foundBeers;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setDetectedBeers([]); // 清空之前检测的啤酒

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: input.trim(),
          response_mode: "blocking",
          conversation_id: null,
          user: "web-user"
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.answer,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // 检测AI回复中的啤酒名称
      const beersInResponse = detectBeersInMessage(data.answer);
      if (beersInResponse.length > 0) {
        setDetectedBeers(beersInResponse);
      }
    } catch (error) {
      console.error('Request failed:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I cannot respond at the moment. Please try again later.',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 欢迎标语 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">Tiaohai Craft Beer</h1>
            <p className="text-xl text-gray-200">Explore the infinite possibilities of craft beer</p>
          </div>

          {/* 3D 场景 */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-xl">
            <Suspense fallback={<div className="h-[400px] bg-gray-900 flex items-center justify-center text-white">Loading 3D model...</div>}>
              <BeerScene />
            </Suspense>
          </div>

          {/* AI 聊天窗口 */}
          <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl backdrop-blur-md mb-8">
            {/* 聊天记录 */}
            <div className="h-[40vh] overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-center">
                    👋 Hello! I'm the Tiaohai AI Bartender<br />
                    Tell me your taste preferences, and I'll recommend suitable craft beers for you
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 显示检测到的啤酒卡片 */}
            {detectedBeers.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Recommended Beers:</h3>
                <div className="space-y-4">
                  {detectedBeers.map((beer, index) => (
                    <BeerCard key={index} beer={beer} />
                  ))}
                </div>
              </div>
            )}

            {/* 输入框 */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me your flavor preferences, and I'll recommend..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className={`px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* 提示卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🍺 You can ask like this</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• I like refreshing beers, any recommendations?</li>
                <li>• I want to try some fruity craft beers</li>
                <li>• I'm a beginner, what should I drink?</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🌟 Today's Recommendations</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Freedom Lager - Refreshing & Crisp</li>
                <li>• YUZU - Yuzu Flavored Craft Beer</li>
                <li>• Fruit Beer Series - Various Flavors Available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;