import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MicroserviceNode from './Nodes/MicroserviceNode';
import ApiGatewayNode from './Nodes/ApiGatewayNode';
import DatabaseNode from './Nodes/DataBaseNode';
import CacheServerNode from './Nodes/CacheServerNode';
import axios from 'axios';
import AIGeneratedCodeView from './AIGeneratedCodeView';
import { jsPDF } from 'jspdf';
import Loader from './CSS/Loader';
import PopupModal from './CSS/PopupModal';
//import JSZip from 'jszip';
const nodeTypes = {
  microservice: MicroserviceNode,
  apiGateway: ApiGatewayNode,
  database: DatabaseNode,
  cacheServer: CacheServerNode,
};

// 📦 Full AI-to-Initializr dependency mapping
// const depMap = {
//   // Core Spring Boot
//   'spring-boot-starter-web': 'web',
//   'spring-boot-starter-data-jpa': 'data-jpa',
//   'spring-boot-starter-validation': 'validation',
//   'spring-boot-starter': 'core',
//   'spring-boot-starter-aop': 'aop',
//   'spring-boot-devtools': 'devtools',

//   // Databases
//   'mysql-connector-j': 'mysql',
//   'postgresql': 'postgresql',
//   'spring-boot-starter-data-mongodb': 'data-mongodb',
//   'mongodb-driver-sync': 'mongodb',
//   'h2': 'h2', // added H2

//   // Caching
//   'spring-boot-starter-cache': 'cache',
//   'spring-boot-starter-data-redis': 'data-redis',
//   'io.github.ben-manes.caffeine:caffeine': 'caffeine',
//   'org.ehcache:ehcache': 'ehcache',
//   'com.hazelcast:hazelcast': 'hazelcast',

//   // Messaging & Streaming
//   'spring-kafka': 'kafka',
//   'spring-boot-starter-amqp': 'amqp',

//   // Cloud & Discovery
//   'spring-cloud-starter-openfeign': 'openfeign',
//   'spring-cloud-starter-netflix-eureka-client': 'cloud-eureka',
//   'spring-cloud-starter-consul-discovery': 'consul-discovery',
//   'spring-cloud-starter-gateway': 'cloud-gateway',

//   // Security
//   'spring-boot-starter-security': 'security',
//   'spring-security-oauth2': 'oauth2',
//   'spring-security-oauth2-client': 'oauth2-client',
//   'spring-security-oauth2-resource-server': 'oauth2-resource-server',

//   // Monitoring & API Docs
//   'spring-boot-starter-actuator': 'actuator',
//   'micrometer-registry-prometheus': 'prometheus',
//   'springdoc-openapi-ui': 'openapi',

//   // UI
//   'spring-boot-starter-thymeleaf': 'thymeleaf',
//   'spring-boot-starter-mustache': 'mustache',

//   // Helpers
//   'lombok': 'lombok',
//   'mapstruct': 'mapstruct',
//   'modelmapper': 'modelmapper',

//   // Utilities
//   'spring-boot-starter-mail': 'mail',
//   'spring-boot-starter-batch': 'batch',
//   'spring-boot-starter-quartz': 'quartz',
//   'spring-retry': 'retry',
//   'spring-session-core': 'session',
//   'spring-websocket': 'websocket',
// };



// 🔍 Extracts mapped dependencies from AI's response (e.g. pom.xml)
// const extractDependenciesFromAIResponse = (code) => {
//   const matchedDeps = new Set();
//   const matches = code.match(/<artifactId>(.*?)<\/artifactId>/g) || [];
//   matches.forEach(tag => {
//     const raw = tag.replace(/<\/?artifactId>/g, '').trim();
//     if (depMap[raw]) {
//       matchedDeps.add(depMap[raw]);
//     } else {
//       console.warn('🟡 Unmapped dependency from AI:', raw);
//     }
//   });
//   return Array.from(matchedDeps);
// };

const normalizeNode = (node) => ({
  id: node.id,
  type: node.type,
  data: {
    label: node.data.label,
    fields: node.data.fields || [],
    option: node.data.option || null,
    discoveryType: node.data.discoveryType || null,
  },
});

const normalizeEdge = (edge) => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  sourceHandle: edge.sourceHandle || null,
  targetHandle: edge.targetHandle || null,
});

const isSameCanvasState = (nodes, edges, prevNodes, prevEdges) => {
  const normalizedCurrentNodes = nodes.map(normalizeNode);
  const normalizedPrevNodes = prevNodes.map(normalizeNode);

  const normalizedCurrentEdges = edges.map(normalizeEdge);
  const normalizedPrevEdges = prevEdges.map(normalizeEdge);

  return (
    JSON.stringify(normalizedCurrentNodes) === JSON.stringify(normalizedPrevNodes) &&
    JSON.stringify(normalizedCurrentEdges) === JSON.stringify(normalizedPrevEdges)
  );
};



const CanvasBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [microserviceCount, setMicroserviceCount] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const API_URL = process.env.REACT_APP_GEMINI_API_URL;


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const typeData = event.dataTransfer.getData('application/reactflow');
      if (!typeData) return;

      const parsed = JSON.parse(typeData);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      let newNode;
      if (parsed.type === 'Microservice') {
        const newCount = microserviceCount + 1;
        setMicroserviceCount(newCount);
        newNode = {
          id: `${+new Date()}`,
          type: 'microservice',
          position,
          data: {
            label: `Microservice ${newCount}`,
            fields: [],
          },
        };
      } else if (parsed.type === 'API Gateway') {
        newNode = {
          id: `${+new Date()}`,
          type: 'apiGateway',
          position,
          data: {
            label: 'API Gateway',
            discoveryType: parsed.option || 'None', // 🆕 store selected option
          },
        };
      }else if (parsed.type === 'Database') {
        newNode = {
          id: `${+new Date()}`,
          type: 'database',
          position,
          data: {
            label: `Database - ${parsed.option || 'MySQL'}`,
            option: parsed.option || 'MySQL',
          },
        };
      } else if (parsed.type === 'Cache Server') {
        newNode = {
          id: `${+new Date()}`,
          type: 'cacheServer',
          position,
          data: {
            label: `Cache Server - ${parsed.option || 'Redis'}`,
            option: parsed.option || 'Redis',
          },
        };
      }else {
        newNode = {
          id: `${+new Date()}`,
          type: 'default',
          position,
          data: {
            label: parsed.option ? `${parsed.type} - ${parsed.option}` : parsed.type,
            option: parsed.option || null,
          },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [microserviceCount, setMicroserviceCount, setNodes]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleSaveAndGenerate = async () => {
    if (nodes.filter(n => n.type === 'microservice').length === 0) {
      setPopupMessage('⚠️ No Microservices Found! Please add at least one microservice before saving.');
      setShowPopup(true);
      return;
    }
    const prevState = JSON.parse(localStorage.getItem('lastCanvasState'));
    const prevCode = localStorage.getItem('lastGeneratedCode');

    if (prevState && isSameCanvasState(nodes, edges, prevState.nodes, prevState.edges)) {
    if (prevCode) {
      setGeneratedCode(prevCode);
      setShowGeneratedCode(true);
      return;
    }
    }
    setIsLoading(true);
    const promptParts = [];
  
    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = {
        type: node.type,
        label: node.data.label || node.type,
        fields: node.data.fields || [],
        db: node.data.option || null,
      };
    });
  
    const microservices = nodes.filter((n) => n.type === 'microservice');
    microservices.forEach((node) => {
      const fieldLines =
        node.data.fields?.length > 0
          ? node.data.fields.map((f) => `  - ${f.name}: ${f.type}`).join('\n')
          : '  (no fields)';
      promptParts.push(`Microservice: ${node.data.label}\nFields:\n${fieldLines}`);
    });
  
    const databases = nodes.filter((n) => n.type === 'database');
    databases.forEach((db) => {
      promptParts.push(`Database: ${db.data.label}`);
    });
  
    const gateways = nodes.filter((n) => n.type === 'apiGateway');
    gateways.forEach((gw) => {
      const discovery = gw.data.discoveryType || 'None';
      promptParts.push(`API Gateway: ${gw.data.label}\nService Discovery: ${discovery}`);
    });
    const caches = nodes.filter((n) => n.type === 'cacheServer');
      caches.forEach((c) => {
      promptParts.push(`Cache Server: ${c.data.label}`);
    });

    
  
    // 🌐 Generate field-level data flow info
    const fieldFlows = edges
      .filter((e) => e.sourceHandle && e.targetHandle)
      .map((e) => {
        const fromLabel = nodeMap[e.source]?.label || e.source;
        const toLabel = nodeMap[e.target]?.label || e.target;
        const fromField = e.sourceHandle.replace(`${e.source}-`, '');
        const toField = e.targetHandle.replace(`${e.target}-`, '');
        return `- ${fromLabel}.${fromField} ➝ ${toLabel}.${toField}`;
      });
  
    promptParts.push('\nComponent-Level Connections:');
    edges.forEach((e) => {
      const from = nodeMap[e.source]?.label || e.source;
      const to = nodeMap[e.target]?.label || e.target;
      promptParts.push(`- ${from} --> ${to}`);
    });
  
    if (fieldFlows.length > 0) {
      promptParts.push('\nField-Level Data Flow:');
      promptParts.push(...fieldFlows);
    }
  
    const fullPrompt = `
  You are an expert Spring Boot backend generator.
  
  Please generate a complete Spring Boot backend project using the following architecture:
  
  ${promptParts.join('\n\n')}
  
  Requirements:
  - Each microservice should have Controller, Service, Repository, and Entity/Model classes
  - Setup DB configuration (MySQL, PostgreSQL, etc.)
  - Use the listed fields as entity attributes
  - Generate REST APIs for each microservice
  - If there are field-to-field connections between microservices (see "Field-Level Data Flow"), add logic to send/receive data between them using RestTemplate or Feign clients.
  - Use appropriate annotations and clean architecture
  - Return all code in a well-formatted, readable structure
  `;
  
    try {
      const res = await axios.post(API_URL, {
        question: fullPrompt,
      });
  
      const code = res.data;
      setGeneratedCode(code);
      setShowGeneratedCode(true);

      localStorage.setItem('lastCanvasState', JSON.stringify({ nodes, edges }));
      localStorage.setItem('lastGeneratedCode', code);
    } catch (err) {
      console.error('❌ Failed to generate code:', err);
      alert('Error generating code. Check console.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // for PDF download
  const handleDownloadPDF = () => {
    if (!generatedCode || generatedCode.trim() === '') {
      alert('No code to download.');
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 5;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const cleanCode = generatedCode.replace(/%/g, '%%');
    const lines = doc.splitTextToSize(cleanCode, maxLineWidth);

    let y = margin + 10;
    let pageNumber = 1;

    const addHeader = () => {
      doc.setFontSize(12);
      doc.text('Spring Boot Code - Generated by BackendPlug', margin, margin);
      doc.setFontSize(10);
    };

    const addFooter = () => {
      doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 5);
    };

    addHeader();

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin - 10) {
        addFooter();
        doc.addPage();
        pageNumber++;
        y = margin + 10;
        addHeader();
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    addFooter();
    doc.save('springboot-backend-code.pdf');
  };

  // for Project download
  const handleDownloadProject = async () => {
  setPopupMessage(
    '🚀 Project download is coming soon!\nWe’re working on multi-service ZIP export in a future update.'
  );
  setShowPopup(true);
};

//   const handleDownloadProject = async () => {
//   if (!generatedCode || generatedCode.trim() === '') {
//     alert('No code to analyze.');
//     return;
//   }

//   const microserviceNodes = nodes.filter(n => n.type === 'microservice');
//   if (microserviceNodes.length === 0) {
//     alert('No microservices found.');
//     return;
//   }

//   const zip = new JSZip();

//   if (microserviceNodes.length === 1) {
//     // Single microservice
//     const artifactId = microserviceNodes[0].data.label || 'microservice1';
//     const deps = extractDependenciesFromAIResponse(generatedCode);
//     const depParam = deps.join(',');

//     try {
//       const res = await axios.get('http://localhost:9501/project/download', {
//         params: { artifactId, dependencies: depParam },
//         responseType: 'blob',
//       });

//       const blob = new Blob([res.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${artifactId}.zip`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('❌ Download failed:', err);
//       alert('Download failed. Check console.');
//     }
//   } else {
//     // Multiple microservices - all zipping done in frontend
//     const deps = extractDependenciesFromAIResponse(generatedCode); // or custom per MS if needed
//     const depParam = deps.join(',');

//     for (const node of microserviceNodes) {
//       const artifactId = node.data.label || 'microservice';
//       try {
//         const res = await axios.get('http://localhost:9501/project/download', {
//           params: { artifactId, dependencies: depParam },
//           responseType: 'blob',
//         });

//         const zipFile = await JSZip.loadAsync(res.data);
//         zip.folder(artifactId);
//         zipFile.forEach((relativePath, file) => {
//           zip.folder(artifactId).file(relativePath, file.async('blob'));
//         });
//       } catch (err) {
//         console.error(`❌ Failed to fetch ZIP for ${artifactId}:`, err);
//         alert(`Failed to fetch project for ${artifactId}`);
//         return;
//       }
//     }

//     // Generate combined ZIP
//     const finalZipBlob = await zip.generateAsync({ type: 'blob' });
//     const url = window.URL.createObjectURL(finalZipBlob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'multi-microservice.zip';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   }
// };

  return (
    <ReactFlowProvider>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-50">
          <Loader />
        </div>
      )}
      {showPopup && (
      <PopupModal
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />
    )}
      {showGeneratedCode ? (
        <AIGeneratedCodeView
          code={generatedCode}
          onBack={() => setShowGeneratedCode(false)}
          onDownload={handleDownloadPDF}
          onDownloadProject={handleDownloadProject}
        />
      ) : (
        <div className="w-full h-[90vh] bg-gray-100 rounded-xl overflow-hidden flex flex-col">
          <div className="flex justify-end px-4 py-2 bg-white border-b">
            <button
              onClick={handleSaveAndGenerate}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            >
              💾 Save & Generate Code
            </button>
          </div>

          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              nodeTypes={nodeTypes}
              connectOnClick
              zoomOnScroll
              //preventScrolling
              panOnScroll
              zoomOnPinch
              panOnDrag
              minZoom={0.5}
              maxZoom={2}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      )}
    </ReactFlowProvider>
  );
};

export default CanvasBoard;
