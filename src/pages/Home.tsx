// @ts-ignore
import React, { useState, useRef, useEffect, Suspense } from 'react';
// @ts-ignore
// 删除重复导入
// @ts-ignore
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
// @ts-ignore
import { OrbitControls, Environment, useProgress, Html, useGLTF } from '@react-three/drei';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { useNavigate } from 'react-router-dom';
import OrderContext from '../contexts/OrderContext';

// 图片映射对象
const beerImages = {
  'Freedom': '/images/beers/water.jpg',
  'Yose Rose': '/images/beers/Yose Rose.jpg',
  'Spring Pandan': '/images/beers/Spring Pandan.jpg',
  'Wintermelon Oolong': '/images/beers/Wintermelon Oolong.jpg',
  'Megsy Ginger': '/images/beers/Megsy Ginger.jpg',
  'Secret Circle': '/images/beers/Secret Circle.jpg',
  'Amongst The Herd': '/images/beers/Amongst The Herd.jpg',
  'Bellini Sour': '/images/beers/Bellini Sour.jpg'
};

// 默认图片
const placeholderImg = '/images/beers/water.jpg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Beer {
  Name: string;
  Price: string;
  Type: string;
  ABV: string;
  Description: string;
  image?: string;
}

interface Order {
  beers: Beer[];
  total: number;
}

// Azure 语音服务配置
const AZURE_SPEECH_KEY = 'Dwt3Edb8pH8WjH8W5R31wDFueE1e4RCgckhIuW7hT0xvfrStpRUmJQQJ99BCACqBBLyXJ3w3AAAYACOGmN2O';
const AZURE_SPEECH_REGION = 'southeastasia';
const AZURE_SPEECH_ENDPOINT = 'https://southeastasia.api.cognitive.microsoft.com/';

// 解码Azure密钥（密钥可能被编码或加密）
const decodeSpeechKey = (encodedKey) => {
  try {
    // 简单的解码示例，实际情况可能需要更复杂的解码
    // 这里假设密钥是Base64编码的
    const decoded = atob(encodedKey.split('.').join(''));
    return decoded;
  } catch (error) {
    console.error('Failed to decode speech key:', error);
    return encodedKey; // 如果解码失败，返回原始密钥
  }
};

// 尝试解码密钥
const DECODED_SPEECH_KEY = decodeSpeechKey(AZURE_SPEECH_KEY);

// Dify API 配置
const DIFY_API_KEY = 'app-lrAlpUg3loqDNxgQlE1c6woM';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

// GLB模型组件
function BeerModel(props: any) {
  const group = useRef<THREE.Group>(null!);
  
  // 使用useFrame实现旋转效果
  useFrame((state: any) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
        <Html position={[0, 1.5, 0]}>
          <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px' }}>
            这里应当显示GLB模型
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// 预加载进度组件
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % 加载中</Html>;
}

// 简单3D模型（备用)
function SimpleBeerModel(props: any) {
  const group = useRef<THREE.Group>(null!);
  
  // 使用useFrame实现旋转效果
  useFrame((state: any) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
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

// 调试信息组件
function DebugInfo({info}: {info: string}) {
  return (
    <Html position={[0, 2, 0]}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        width: '300px',
        textAlign: 'center'
      }}>
        {info}
      </div>
    </Html>
  );
}

// GLB模型加载组件
function LoadGLB({ url, scale = 1, position = [0, 0, 0] }) {
  const modelRef = useRef();
  const [error, setError] = useState(null);
  
  try {
    const { scene } = useGLTF(url);
    
    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 0.5;
      }
    });
    
    return (
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={scale} 
        position={position} 
      />
    );
  } catch (err) {
    console.error('GLB模型加载失败:', err);
    setError(err);
    
    return (
      <group>
        <SimpleBeerModel position={[0, 0, 0]} scale={0.8} />
        <Html position={[0, 2, 0]}>
          <div style={{ color: 'red', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px' }}>
            GLB模型加载失败
          </div>
        </Html>
      </group>
    );
  }
}

// 3D场景组件
function BeerScene() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#222']} />
        <ambientLight intensity={1.0} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <Suspense fallback={<Loader />}>
          <Model />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI} 
        />
      </Canvas>
    </div>
  );
}

// 模型组件
function Model() {
  const modelRef = useRef();
  const [error, setError] = useState(null);
  
  // 尝试多个路径加载模型
  try {
    // 这里改成使用短文件名
    const gltf = useLoader(GLTFLoader, 'model.glb');
    
    useEffect(() => {
      console.log('模型加载成功:', gltf);
    }, [gltf]);
    
    // 旋转模型
    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += delta * 0.5;
      }
    });
    
    // 渲染加载的模型
    return (
      <primitive 
        ref={modelRef}
        object={gltf.scene} 
        scale={1.8} 
        position={[0, -1, 0]} 
      />
    );
  } catch (error) {
    useEffect(() => {
      console.error('模型加载失败:', error);
      setError(error);
    }, [error]);
    
    // 出错时显示备用模型
    return <SimpleBeerModel position={[0, 0, 0]} scale={0.8} />;
  }
}

// 语音服务组件
function VoiceControl({ onTranscript, isListening, setIsListening }) {
  const recognizer = useRef(null);
  const synthesizer = useRef(null);
  const isSpeaking = useRef(false);

  useEffect(() => {
    // 初始化语音服务
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(DECODED_SPEECH_KEY, AZURE_SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';
    speechConfig.speechSynthesisLanguage = 'en-US';
    speechConfig.endpointId = AZURE_SPEECH_ENDPOINT;
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer.current = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    synthesizer.current = new speechsdk.SpeechSynthesizer(speechConfig);

    return () => {
      stopSpeaking();
      if (recognizer.current) {
        recognizer.current.close();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (synthesizer.current) {
      synthesizer.current.close();
      synthesizer.current = null;
      isSpeaking.current = false;
      
      // 重新初始化语音合成器
      const speechConfig = speechsdk.SpeechConfig.fromSubscription(DECODED_SPEECH_KEY, AZURE_SPEECH_REGION);
      speechConfig.speechSynthesisLanguage = 'en-US';
      speechConfig.endpointId = AZURE_SPEECH_ENDPOINT;
      speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
      synthesizer.current = new speechsdk.SpeechSynthesizer(speechConfig);
    }
  };

  const startListening = () => {
    // 开始录音前先停止当前播放的语音
    stopSpeaking();

    if (recognizer.current) {
      setIsListening(true);
      recognizer.current.recognizeOnceAsync(
        result => {
          if (result.text) {
            onTranscript(result.text.trim());
          }
          setIsListening(false);
        },
        error => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
    }
  };

  const speakText = async (text) => {
    if (synthesizer.current) {
      try {
        isSpeaking.current = true;
        console.log('开始语音合成...');
        
        // 使用简单的文本而不是SSML，减少可能的错误
        try {
          const result = await synthesizer.current.speakTextAsync(text);
          console.log('语音合成结果:', result);
          
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            console.log('语音合成成功完成');
          } else {
            console.error('语音合成失败:', result.errorDetails);
            // 尝试使用Web Speech API作为备选
            tryWebSpeechAPI(text);
          }
        } catch (innerError) {
          console.error('语音合成内部错误:', innerError);
          // 尝试使用Web Speech API作为备选
          tryWebSpeechAPI(text);
        }
        
        isSpeaking.current = false;
      } catch (error) {
        console.error('语音合成外部错误:', error);
        isSpeaking.current = false;
        // 尝试使用Web Speech API作为备选
        tryWebSpeechAPI(text);
      }
    } else {
      console.warn('语音合成器未初始化，使用Web Speech API');
      tryWebSpeechAPI(text);
    }
  };
  
  // 使用Web Speech API作为备选的语音合成方法
  const tryWebSpeechAPI = (text) => {
    if ('speechSynthesis' in window) {
      console.log('使用Web Speech API进行语音合成');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // 设置为中文
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('浏览器不支持Web Speech API');
    }
  };
  
  return { startListening, speakText };
}

// 使用从contexts导入的OrderContext

// 推荐的酒品卡片组件
const BeerCard = ({ beer, onAddToOrder }: { beer: Beer; onAddToOrder: () => void }) => {
  const { addToOrder } = React.useContext(OrderContext);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-2 border-red-400 hover:shadow-2xl transition-all duration-300">
      {beer.image && (
        <img 
          src={beer.image} 
          alt={beer.Name} 
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImg;
          }}
        />
      )}
      <h3 className="text-xl font-bold mb-2">{beer.Name}</h3>
      <p className="text-gray-600 mb-2">{beer.Type} - {beer.ABV}</p>
      <p className="text-gray-700 mb-4">{beer.Description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-red-500">${beer.Price}</span>
        <button
          onClick={() => {
            // 确保使用正确的图片路径
            const imagePath = beerImages[beer.Name] || placeholderImg;
            console.log('使用的图片路径:', imagePath);
            
            const beerWithImage = {
              ...beer,
              image: imagePath
            };
            console.log('添加到购物车的啤酒信息:', beerWithImage);
            
            addToOrder(beerWithImage);
            alert(`已将 ${beer.Name} 添加到订单！`);
          }}
          className="bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition-colors font-bold flex items-center space-x-2 transform hover:scale-105 transition-transform shadow-xl border-2 border-white"
        >
          <span className="material-icons text-xl">add_shopping_cart</span>
          <span className="text-lg">加入订单</span>
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { order, addToOrder, removeFromOrder, checkout } = React.useContext(OrderContext);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentBeer, setCurrentBeer] = useState<Beer | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [synthesizer, setSynthesizer] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const { startListening, speakText } = VoiceControl({
    onTranscript: (text) => {
      setUserInput(text);
      handleSubmit(new Event('submit') as any);
    },
    isListening: isRecording,
    setIsListening: setIsRecording
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isRecording) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: userInput.trim(),
          response_mode: "blocking",
          conversation_id: null,
          user: "web-user"
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      try {
        const beerNames = [
          "Freedom", "Wintermelon Oolong", "Earth", "Spring Pandan", "Yellow Van",
          "Wind", "Ritual De Lo Habitual-NOW", "Secret Circle", "Amongst The Herd",
          "Cacao Stout", "Raspberry & Cream", "The Mango Man", "Bellini Sour", "Vose Rose", "Megsy Ginger"
        ];
        
        let recommendedBeerName = null;
        for (const name of beerNames) {
          if (data.answer.includes(name)) {
            recommendedBeerName = name;
            break;
          }
        }
        
        if (recommendedBeerName) {
          const imagePath = beerImages[recommendedBeerName] || placeholderImg;
          console.log('使用的图片路径:', imagePath);
          
          const recommendedBeer = {
            Name: recommendedBeerName,
            Price: recommendedBeerName === "Freedom" ? "15" : 
                   recommendedBeerName === "Wintermelon Oolong" ? "22" : "20",
            Type: recommendedBeerName === "Freedom" ? "Lager" : 
                  recommendedBeerName === "Wintermelon Oolong" ? "Wheat" : "Craft Beer",
            ABV: "5%",
            Description: data.answer.split(recommendedBeerName)[1]?.substring(0, 100) + "...",
            image: imagePath
          };
          
          console.log('推荐的啤酒信息:', recommendedBeer);
          setCurrentBeer(recommendedBeer);
        } else {
          const defaultBeer = {
            Name: "Freedom",
            Price: "15",
            Type: "Lager",
            ABV: "5%",
            Description: "This unfiltered craft beer celebrates finesse and elegance.",
            image: beerImages["Freedom"]
          };
          
          console.log('使用默认啤酒信息:', defaultBeer);
          setCurrentBeer(defaultBeer);
        }
      } catch (error) {
        console.error('Error parsing beer recommendation:', error);
        const defaultBeer = {
          Name: "Freedom",
          Price: "15",
          Type: "Lager",
          ABV: "5%",
          Description: "This unfiltered craft beer celebrates finesse and elegance.",
          image: beerImages["Freedom"]
        };
        
        console.log('错误后使用默认啤酒信息:', defaultBeer);
        setCurrentBeer(defaultBeer);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.answer,
      };

      setMessages(prev => [...prev, aiMessage]);
      await speakText(data.answer);
    } catch (error) {
      console.error('API error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，遇到了问题。请稍后再试。',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleSendMessage = () => {
    handleSubmit(new Event('submit') as any);
  };

  const startRecording = () => {
    startListening();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <div className="min-h-screen" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-sm py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* 固定在顶部的订单栏 */}
            <div className="fixed top-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="material-icons text-red-500 mr-2">shopping_cart</span>
                    <span className="font-bold">购物车: {order.beers.length}件商品</span>
                    {order.beers.length > 0 && (
                      <span className="ml-2 text-gray-600">总计: ¥{order.total.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/order')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-bold"
                  >
                    <span className="material-icons">shopping_cart</span>
                    <span>查看订单</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* 欢迎标语 - 增加上边距以避免被固定订单栏遮挡 */}
            <div className="text-center mb-12 mt-16">
              <h1 className="text-5xl font-bold text-white mb-4 font-serif">跳海精酿酒馆</h1>
              <p className="text-xl text-gray-200">探索精酿啤酒的无限可能</p>
            </div>

            {/* 3D 场景 */}
            <div className="mb-12 rounded-lg overflow-hidden shadow-xl">
              <Suspense fallback={<div className="h-[400px] bg-gray-900 flex items-center justify-center text-white">加载3D模型中...</div>}>
                <BeerScene />
              </Suspense>
            </div>

            {/* AI 聊天窗口 */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl backdrop-blur-md mb-8">
              <div className="h-[40vh] overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-center">
                      👋 Hello! I'm TiaoHai's AI Bartender<br />
                      Tell me your taste preferences, and I'll recommend the perfect craft beer for you
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
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
                    ))}
                    {currentBeer && (
                      <div className="mt-4 border-t pt-4 border-gray-200">
                        <div className="text-center mb-2">
                          <h3 className="text-lg font-bold text-gray-700">🍺 为您推荐 🍺</h3>
                        </div>
                        <BeerCard 
                          beer={currentBeer} 
                          onAddToOrder={() => {
                            console.log('添加到订单:', currentBeer);
                            const beerWithImage = {
                              ...currentBeer,
                              image: beerImages[currentBeer.Name] || placeholderImg
                            };
                            addToOrder(beerWithImage);
                            alert(`已将 ${currentBeer.Name} 添加到订单！`);
                          }} 
                        />
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* 聊天输入框 - 移除了订单按钮 */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="告诉我你喜欢的口味，我来推荐啤酒..."
                      className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      发送
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => startRecording()}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <span className="material-icons">mic</span>
                      <span>开始语音输入</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;