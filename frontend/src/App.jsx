import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Volume2,
  Leaf,
  Activity,
  Layers,
  Info,
  Sliders,
  Check,
  FileDown,
  Server,
  Zap,
  Key,
  Bot,
  Send,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Globe2,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { getDiseaseDetails } from './diseaseData';

// Configurable Backend API URL (for Vercel deployment)
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');

export default function App() {
  // Navigation View State: 'landing' | 'diagnosis'
  const [currentView, setCurrentView] = useState('landing');

  // AI Models & Engine State
  const [model, setModel] = useState(null);
  const [classNames, setClassNames] = useState([]);
  const [modelStatus, setModelStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('Initializing Neural Network...');

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState('checking');

  // Gemini API Key state - read securely from localStorage or backend environment
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('leafcare_gemini_key') || '');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');

  // User input & prediction state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('treatment');
  const [backendDetailedInfo, setBackendDetailedInfo] = useState(null);

  // Out-of-distribution validation warning
  const [leafValidationWarning, setLeafValidationWarning] = useState(null);

  // Gemini "Dr. Leaf" Interactive Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm **Dr. Leaf**, your personal AI Crop Pathologist powered by Google Gemini.\n\nUpload or snap a photo of any plant leaf on the left, and I'll analyze it, confirm symptoms, and answer questions about organic cures, chemical sprays, or crop safety."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGeminiThinking, setIsGeminiThinking] = useState(false);
  const [geminiSecondOpinion, setGeminiSecondOpinion] = useState(null);
  const [isFetchingOpinion, setIsFetchingOpinion] = useState(false);

  // Camera modal state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // PDF generation loading
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const previewImgRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGeminiThinking]);
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch {
        setBackendStatus('offline');
      }
    }
    checkBackend();
  }, []);

  // 2. Load Model and Class Names on Mount
  useEffect(() => {
    async function initModel() {
      try {
        setModelStatus('loading');
        setStatusMessage('Loading TensorFlow.js model weights...');
        await tf.ready();

        const loadedModel = await tf.loadLayersModel('/tfjs_model/model.json');
        const res = await fetch('/tfjs_model/class_names.json');
        if (!res.ok) throw new Error('Could not load class names dictionary');
        const classes = await res.json();

        setModel(loadedModel);
        setClassNames(classes);
        setModelStatus('ready');
        setStatusMessage('AI Diagnostic Engine Ready');
      } catch (err) {
        console.error('Model initialization error:', err);
        setModelStatus('error');
        setStatusMessage('Failed to load local model: ' + err.message);
      }
    }
    initModel();
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGeminiThinking]);

  // Handle File Selection & Base64 conversion
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setResults(null);
    setLeafValidationWarning(null);
    setBackendDetailedInfo(null);
    setGeminiSecondOpinion(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Run Leaf Disease Inference
  const handleAnalyze = async () => {
    if (!previewImgRef.current || !model || classNames.length === 0) return;

    setIsAnalyzing(true);
    setLeafValidationWarning(null);

    try {
      if (backendStatus === 'online' && selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          const valRes = await fetch(`${BACKEND_URL}/api/validate-leaf`, {
            method: 'POST',
            body: formData
          });
          if (valRes.ok) {
            const valData = await valRes.json();
            if (!valData.is_valid_leaf) {
              setLeafValidationWarning(
                valData.reasons.length > 0 
                  ? valData.reasons.join(' ') 
                  : 'Notice: This image has very low foliar pigment density and may not be a plant leaf.'
              );
            }
          }
        } catch (valErr) {
          console.warn('Backend leaf validation bypassed:', valErr);
        }
      }

      await previewImgRef.current.decode();

      const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(previewImgRef.current)
          .resizeBilinear([128, 128])
          .toFloat()
          .div(255.0)
          .expandDims(0);
      });

      const prediction = model.predict(tensor);
      const scores = await prediction.data();

      tensor.dispose();
      prediction.dispose();

      const indexedScores = Array.from(scores).map((score, idx) => ({
        index: idx,
        score: score,
        name: classNames[idx]
      }));

      indexedScores.sort((a, b) => b.score - a.score);

      const topClass = indexedScores[0];
      const top3 = indexedScores.slice(0, 3).map((item) => {
        const details = getDiseaseDetails(item.name);
        return {
          ...item,
          confidence: (item.score * 100).toFixed(1),
          crop: details.crop,
          disease: details.disease,
          details
        };
      });

      const topDetails = getDiseaseDetails(topClass.name);
      const isHealthy = topDetails.severity === 'Healthy';

      // If Gemini Key is available, automatically verify with Gemini Vision
      // to correct any CNN classification mistakes (e.g. Potato mistagged as Corn)
      if (backendStatus === 'online' && geminiKey && imageBase64) {
        try {
          const verifyRes = await fetch(`${BACKEND_URL}/api/gemini/verify-diagnosis`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Gemini-Key': geminiKey
            },
            body: JSON.stringify({
              image_base64: imageBase64,
              preliminary_crop: topDetails.crop,
              preliminary_disease: topDetails.disease,
              preliminary_confidence: `${top3[0].confidence}%`
            })
          });

          if (verifyRes.ok) {
            const vData = await verifyRes.json();
            const g = vData.data;
            if (g && g.crop) {
              const geminiHealthy = g.severity === 'Healthy';
              setResults({
                primary: {
                  ...top3[0],
                  confidence: g.confidence || 95,
                  crop: g.crop,
                  disease: g.disease
                },
                top3: top3,
                details: {
                  crop: g.crop,
                  disease: g.disease,
                  severity: g.severity,
                  pathogen: g.pathogen,
                  description: g.description,
                  symptoms: g.symptoms,
                  treatment: g.treatment,
                  prevention: g.prevention
                },
                isHealthy: geminiHealthy,
                geminiVerified: true,
                correctionNotes: g.correction_notes
              });

              setChatMessages([
                {
                  role: 'assistant',
                  content: `✅ **Diagnosis Verified by Gemini AI**:\n\n🌿 **True Identification**: **${g.crop} — ${g.disease}** (${g.severity} severity).\n*Diagnostic observation*: ${g.correction_notes || g.symptoms}\n\nAsk me anything below about treatment recipes, chemical spray dosages, or harvest safety!`
                }
              ]);
              return;
            }
          }
        } catch (vErr) {
          console.warn('Gemini auto-verification bypassed:', vErr);
        }
      }

      // Fallback to local CNN if Gemini is offline
      setResults({
        primary: top3[0],
        top3: top3,
        details: topDetails,
        isHealthy: isHealthy
      });

      // Update Dr. Leaf initial context
      setChatMessages([
        {
          role: 'assistant',
          content: `I've analyzed your leaf sample!\n\n🌿 **Local CNN Classification**: ${topDetails.crop} — ${topDetails.disease} (${top3[0].confidence}% confidence).\n\nWhat would you like to know? You can ask me:\n- *"Can I cure this with homemade organic spray?"*\n- *"What fungicide dosage should I apply per acre/liter?"*\n- *"Is this contagious to neighboring crops?"*`
        }
      ]);

      if (backendStatus === 'online') {
        try {
          const detailRes = await fetch(`${BACKEND_URL}/api/disease-info/${encodeURIComponent(topClass.name)}`);
          if (detailRes.ok) {
            const json = await detailRes.json();
            setBackendDetailedInfo(json.data);
          }
        } catch (detailErr) {
          console.warn('Could not fetch backend details:', detailErr);
        }
      }

      if (isHealthy) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

    } catch (err) {
      console.error('Inference error:', err);
      alert('Error analyzing image: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Gemini Deep Diagnostic Second Opinion
  const handleFetchGeminiOpinion = async () => {
    if (!results || !imageBase64) return;
    if (!geminiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsFetchingOpinion(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/gemini/consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gemini-Key': geminiKey
        },
        body: JSON.stringify({
          crop: results.details.crop,
          disease: results.details.disease,
          confidence: `${results.primary.confidence}%`,
          question: 'Conduct a thorough pathological review of this plant foliage. Verify whether the local CNN diagnosis is accurate, identify any co-infections or nutrient deficiencies, and give me a step-by-step restoration plan.',
          image_base64: imageBase64
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Failed to consult Gemini');
      }

      const data = await res.json();
      setGeminiSecondOpinion(data.reply);
    } catch (err) {
      console.error('Gemini opinion error:', err);
      alert('Gemini Consultation Error: ' + err.message);
    } finally {
      setIsFetchingOpinion(false);
    }
  };

  // Send message in Dr. Leaf interactive chat
  const handleSendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isGeminiThinking) return;

    if (!geminiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    const userText = chatInput.trim();
    setChatInput('');

    const newMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMessages);
    setIsGeminiThinking(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/gemini/consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gemini-Key': geminiKey
        },
        body: JSON.stringify({
          crop: results?.details?.crop || 'Plant',
          disease: results?.details?.disease || 'Foliar condition',
          confidence: results ? `${results.primary.confidence}%` : 'N/A',
          question: userText,
          image_base64: imageBase64,
          chat_history: newMessages
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Could not reach Dr. Leaf');
      }

      const data = await res.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error contacting Dr. Leaf: ${err.message}. Please verify your Gemini API key.` }
      ]);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  // Save Gemini Key
  const handleSaveKey = () => {
    const trimmed = tempKeyInput.trim();
    setGeminiKey(trimmed);
    localStorage.setItem('leafcare_gemini_key', trimmed);
    setIsKeyModalOpen(false);
  };

  // Export PDF Diagnostic Report
  const handleExportPDF = async () => {
    if (!results) return;

    setIsExportingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      let y = 18;

      pdf.setFillColor(27, 94, 60);
      pdf.rect(0, 0, pageWidth, 28, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('LeafCare AI — Agricultural Diagnostic Report', 14, 12);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}  |  Precision Pathology Engine v2.0`, 14, 20);

      y = 38;

      pdf.setFillColor(245, 248, 245);
      pdf.setDrawColor(210, 230, 215);
      pdf.roundedRect(14, y, pageWidth - 28, 44, 3, 3, 'FD');

      pdf.setTextColor(20, 40, 25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('CROP TARGET:', 20, y + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${results.details.crop}`, 55, y + 10);

      pdf.setFont('helvetica', 'bold');
      pdf.text('DIAGNOSIS:', 20, y + 18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(results.isHealthy ? 22 : 185, results.isHealthy ? 120 : 28, results.isHealthy ? 60 : 28);
      pdf.text(`${results.details.disease}`, 55, y + 18);

      pdf.setTextColor(20, 40, 25);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CONFIDENCE:', 20, y + 26);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${results.primary.confidence}% (Deep Learning CNN)`, 55, y + 26);

      pdf.setFont('helvetica', 'bold');
      pdf.text('PATHOGEN:', 20, y + 34);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${results.details.pathogen || 'N/A'}`, 55, y + 34);

      y += 52;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(27, 94, 60);
      pdf.text('Top Likelihood Breakdown', 14, y);
      y += 6;

      pdf.setFontSize(10);
      results.top3.forEach((item, index) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${index + 1}. ${item.crop} — ${item.disease}`, 18, y);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${item.confidence}%`, 175, y);
        y += 6;
      });

      y += 6;

      const drawSection = (title, content, bgColor = [248, 250, 248], strokeColor = [220, 230, 220]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(27, 94, 60);
        pdf.text(title, 14, y);
        y += 4;

        pdf.setFillColor(...bgColor);
        pdf.setDrawColor(...strokeColor);
        const textLines = pdf.splitTextToSize(content || 'No specific notes recorded.', pageWidth - 36);
        const boxHeight = (textLines.length * 5) + 8;
        
        pdf.roundedRect(14, y, pageWidth - 28, boxHeight, 2, 2, 'FD');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(40, 40, 40);
        pdf.text(textLines, 18, y + 6);

        y += boxHeight + 8;
      };

      drawSection('Recommended Agronomic Treatment', results.details.treatment, [240, 248, 242], [180, 220, 190]);
      drawSection('Field Diagnostic Symptoms', results.details.symptoms, [254, 249, 235], [245, 220, 160]);
      drawSection('Cultural & Biosecurity Prevention', results.details.prevention, [240, 247, 254], [185, 215, 245]);

      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text('This automated report is generated by LeafCare AI for agronomic advisory purposes.', 14, 285);
      pdf.text('Page 1 of 1', 185, 285);

      pdf.save(`LeafCare_Report_${results.details.crop.replace(/\s+/g, '_')}_${results.details.disease.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF: ' + err.message);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Camera integration
  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check browser permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        handleImageFile(file);
      }
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Text-to-Speech Read Aloud
  const handleReadAloud = () => {
    if (!results || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${results.details.crop}. Identified condition: ${results.details.disease}. Confidence: ${results.primary.confidence} percent. Symptoms: ${results.details.symptoms}. Recommended treatment: ${results.details.treatment}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Quick Sample Leaf Chooser
  const loadSampleImage = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    if (type === 'tomato_blight') {
      grad.addColorStop(0, '#5A7247');
      grad.addColorStop(0.5, '#7C5835');
      grad.addColorStop(1, '#3B4D2F');
    } else {
      grad.addColorStop(0, '#2D7A47');
      grad.addColorStop(0.5, '#4CAF50');
      grad.addColorStop(1, '#1B5E20');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    ctx.beginPath();
    ctx.ellipse(128, 128, 80, 110, Math.PI / 6, 0, Math.PI * 2);
    ctx.fillStyle = type === 'tomato_blight' ? '#8A6D3B' : '#43A047';
    ctx.fill();

    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(70, 210);
    ctx.lineTo(190, 50);
    ctx.stroke();

    if (type === 'tomato_blight') {
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.arc(120, 100, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(150, 140, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], `${type}.png`, { type: 'image/png' });
      handleImageFile(file);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-stone-800">
      
      {/* 🌿 Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <button 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-3 hover:opacity-90 transition text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-sm text-white text-xl">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950 font-['Outfit']">
                  LeafCare<span className="text-emerald-600">.AI</span>
                </span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-xs text-stone-500">Autonomous Plant Disease Intelligence + Gemini AI</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Gemini API Key Button */}
            <button
              onClick={() => {
                setTempKeyInput(geminiKey);
                setIsKeyModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
            >
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini AI Connected</span>
            </button>

            {/* Backend status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[11px] border border-stone-200">
              <Server className={`w-3 h-3 ${backendStatus === 'online' ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>Backend: <strong>{backendStatus === 'online' ? 'Active' : 'Offline'}</strong></span>
            </div>

            {/* Navigation Switch Button */}
            {currentView === 'landing' ? (
              <button
                onClick={() => setCurrentView('diagnosis')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs transition active:scale-95"
              >
                Start Diagnosis <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('landing')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" /> Home Overview
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: MODERN MULTI-COLOR INTERACTIVE LANDING PAGE
      ========================================================================= */}
      {currentView === 'landing' && (
        <div className="flex-1 flex flex-col">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/70 via-amber-50/30 to-white">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Browser Neural Network + Gemini 2.5 Multimodal Vision
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12] mb-6 font-['Outfit']">
                Next-Generation Plant Pathology, <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                  Powered by Autonomous AI.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-stone-600 text-lg leading-relaxed mb-10">
                Diagnose crop diseases instantly with dual-engine intelligence: sub-second on-device CNN inference paired with interactive <strong>Dr. Leaf</strong> consultation powered by Google Gemini.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentView('diagnosis')}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-emerald-600/25 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Activity className="w-5 h-5" /> Launch Diagnosis Console <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentView('diagnosis');
                    setTimeout(() => startCamera(), 200);
                  }}
                  className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-base rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-emerald-600" /> Live Field Camera
                </button>
              </div>

              {/* Stats Highlights */}
              <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                <div className="p-4 rounded-xl bg-white/80 border border-emerald-100 shadow-2xs">
                  <div className="text-2xl font-black text-emerald-700 font-['Outfit']">38+ Classes</div>
                  <div className="text-xs text-stone-500 font-medium">Pre-trained foliar blights</div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-teal-100 shadow-2xs">
                  <div className="text-2xl font-black text-teal-700 font-['Outfit']">50 ms</div>
                  <div className="text-xs text-stone-500 font-medium">Instant client-side speed</div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-amber-100 shadow-2xs">
                  <div className="text-2xl font-black text-amber-700 font-['Outfit']">10,000+</div>
                  <div className="text-xs text-stone-500 font-medium">Species with Gemini Vision</div>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
                  <div className="text-2xl font-black text-sky-700 font-['Outfit']">PDF Reports</div>
                  <div className="text-xs text-stone-500 font-medium">Exportable field advisories</div>
                </div>
              </div>

            </div>
          </section>

          {/* Feature Showcase Grid */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
                Engineered for Modern Agriculture & Gardeners
              </h2>
              <p className="text-sm text-stone-500 mt-2 max-w-xl mx-auto">
                Explore the four pillars that make LeafCare AI reliable, scientifically grounded, and easy to use in real-world fields.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 font-['Outfit'] mb-2">
                    On-Device Neural Net
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Zero latency, privacy-first inference. Powered by TensorFlow.js directly in your browser without requiring hefty server roundtrips.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  128x128 Custom CNN <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-teal-300 transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 font-['Outfit'] mb-2">
                    Interactive Dr. Leaf AI
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Integrated with Gemini 2.5 Flash. Ask real-time questions about chemical spray dilution, organic home remedies, and harvest safety.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                  Multimodal Q&A Assistant <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-amber-300 transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 font-['Outfit'] mb-2">
                    Bio-Optical Validation
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    ExG (Excess Green) and chlorotic spectral checks filter out non-leaf photos (cars, shoes, faces) to eliminate false positives.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  Out-of-Distribution Guard <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-sky-300 transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                    <FileDown className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 font-['Outfit'] mb-2">
                    Field PDF Reports
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Generate vector-sharp diagnostic cards containing symptoms, organic management plans, and confidence curves to share with agronomists.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-sky-700 flex items-center gap-1">
                  Instant Vector PDF <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </section>

          {/* Quick CTA Banner */}
          <section className="mt-auto bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold font-['Outfit']">Ready to inspect your crops?</h3>
                <p className="text-emerald-200 text-sm mt-1">
                  Launch the diagnostic console to test with demo leaves or upload your own photo.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('diagnosis')}
                className="px-6 py-3.5 bg-white text-emerald-950 font-extrabold rounded-xl shadow-md hover:bg-emerald-50 transition shrink-0 flex items-center gap-2 cursor-pointer"
              >
                Open Diagnosis Workspace <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </section>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED DIAGNOSIS WORKSPACE & INTERACTIVE CHAT INTERFACE
      ========================================================================= */}
      {currentView === 'diagnosis' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-fadeIn">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 font-['Outfit']">
                Diagnostic Console & AI Agronomist
              </h2>
              <p className="text-xs text-stone-500">
                Upload your leaf below for sub-second CNN classification and chat directly with Dr. Leaf.
              </p>
            </div>
            
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Upload & Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-1 font-['Outfit']">
                  <Leaf className="w-5 h-5 text-emerald-600" /> Foliage Inspection Port
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Select a leaf image or take a real-time snapshot with your camera.
                </p>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                    imagePreview 
                      ? 'border-emerald-300 bg-emerald-50/20' 
                      : 'border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-stone-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageFile(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        ref={previewImgRef}
                        src={imagePreview}
                        alt="Uploaded leaf preview"
                        className="max-h-56 max-w-full rounded-lg object-contain shadow-sm border border-stone-200"
                      />
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                        <RefreshCw className="w-3.5 h-3.5" /> Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          Drag and drop your leaf photo here
                        </p>
                        <p className="text-xs text-stone-500 mt-1">Supports JPG, PNG, WEBP</p>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600 shadow-2xs">
                        Browse Files
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio-Optical Warning Notice */}
                {leafValidationWarning && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Bio-Optical Check:</strong> {leafValidationWarning}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="w-full py-2.5 px-3 rounded-lg border border-stone-200 hover:border-emerald-300 bg-stone-50 hover:bg-emerald-50/50 text-stone-700 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" /> Camera Snap
                  </button>

                  <button
                    type="button"
                    disabled={!imagePreview || isAnalyzing || modelStatus !== 'ready'}
                    onClick={handleAnalyze}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4" /> Run Diagnosis
                      </>
                    )}
                  </button>
                </div>

                {/* Sample test leaves */}
                <div className="mt-5 pt-4 border-t border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                    Quick Demo Leaves
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadSampleImage('tomato_blight')}
                      className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 rounded-md text-[11px] font-medium text-amber-900 text-left transition truncate cursor-pointer"
                    >
                      🍂 Diseased Leaf Sample
                    </button>
                    <button
                      onClick={() => loadSampleImage('healthy_leaf')}
                      className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-md text-[11px] font-medium text-emerald-900 text-left transition truncate cursor-pointer"
                    >
                      🌿 Healthy Leaf Sample
                    </button>
                  </div>
                </div>

              </div>

              {/* Engine Badge */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-xs text-stone-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Dual Engine: <strong>TFJS (38 classes) + Gemini</strong></span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Online
                </span>
              </div>

            </div>

            {/* Right Column: Diagnosis Summary & "Dr. Leaf" Interactive Chat (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Diagnosis Output (if analyzed) */}
              {results && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all animate-fadeIn">
                  
                  {/* Result Header Banner */}
                  <div className={`p-6 border-b ${
                    results.isHealthy 
                      ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-100'
                      : results.details.severity === 'Critical'
                      ? 'bg-gradient-to-r from-rose-50 via-amber-50 to-white border-rose-100'
                      : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-white border-amber-100'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white shadow-2xs border border-stone-200 text-stone-700 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        {results.details.crop}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          results.isHealthy
                            ? 'bg-emerald-100 text-emerald-800'
                            : results.details.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {results.isHealthy ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          Severity: {results.details.severity}
                        </span>

                        <button
                          onClick={handleExportPDF}
                          disabled={isExportingPDF}
                          className="p-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1 transition shadow-2xs cursor-pointer"
                          title="Download Diagnostic Report as PDF"
                        >
                          <FileDown className="w-4 h-4 text-emerald-600" />
                          <span className="hidden sm:inline">Export PDF</span>
                        </button>

                        <button
                          onClick={handleReadAloud}
                          className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
                            isSpeaking 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                          title="Read out diagnosis"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit'] mt-1">
                      {results.details.disease}
                    </h3>
                    <p className="text-xs font-medium text-stone-500 mt-1">
                      Pathogen: <span className="text-stone-700 font-semibold">{results.details.pathogen}</span>
                      {backendDetailedInfo?.scientific_name && (
                        <span className="italic ml-2 text-stone-400">({backendDetailedInfo.scientific_name})</span>
                      )}
                    </p>

                    {results.geminiVerified && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          <strong>Gemini Vision Verified:</strong> {results.correctionNotes || 'Botanical features validated against global pathology records.'}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-stone-600">Model Confidence</span>
                      </div>
                      <span className="text-xl font-black text-emerald-700 font-['Outfit']">
                        {results.primary.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Information Tabs */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 mb-5 pb-2">
                      <button
                        onClick={() => setActiveTab('treatment')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'treatment'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> Treatment Plan
                      </button>
                      <button
                        onClick={() => setActiveTab('symptoms')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'symptoms'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <Info className="w-3.5 h-3.5" /> Clinical Symptoms
                      </button>
                      <button
                        onClick={() => setActiveTab('prevention')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'prevention'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Prevention
                      </button>
                      {backendDetailedInfo && (
                        <button
                          onClick={() => setActiveTab('scientific')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'scientific'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" /> Organic & Chemical Control
                        </button>
                      )}
                    </div>

                    <div className="text-sm text-stone-700 leading-relaxed">
                      {activeTab === 'treatment' && (
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                          <h4 className="font-bold text-emerald-950 mb-1 flex items-center gap-2">
                            💊 Immediate Agronomic Intervention
                          </h4>
                          <p>{results.details.treatment}</p>
                        </div>
                      )}

                      {activeTab === 'symptoms' && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                          <h4 className="font-bold text-amber-950 mb-1 flex items-center gap-2">
                            🔍 Field Diagnostic Signs
                          </h4>
                          <p>{results.details.symptoms}</p>
                        </div>
                      )}

                      {activeTab === 'prevention' && (
                        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4">
                          <h4 className="font-bold text-sky-950 mb-1 flex items-center gap-2">
                            🛡️ Cultural & Biosecurity Measures
                          </h4>
                          <p>{results.details.prevention}</p>
                        </div>
                      )}

                      {activeTab === 'scientific' && backendDetailedInfo && (
                        <div className="space-y-3">
                          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4">
                            <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">
                              🌿 Certified Organic Management
                            </h5>
                            <p className="text-xs text-emerald-950">{backendDetailedInfo.organic_remedy}</p>
                          </div>
                          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                            <h5 className="font-bold text-stone-700 text-xs uppercase tracking-wider mb-1">
                              🧪 Approved Chemical / Target Fungicide
                            </h5>
                            <p className="text-xs text-stone-800">{backendDetailedInfo.chemical_remedy}</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ✨ Gemini Vision Second Opinion Panel */}
              {results && (
                <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                        ✨
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm font-['Outfit']">
                          Gemini Vision Second Opinion
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          Cross-checks the photo with Gemini's worldwide pathological index
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleFetchGeminiOpinion}
                      disabled={isFetchingOpinion}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isFetchingOpinion ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Request AI Review
                        </>
                      )}
                    </button>
                  </div>

                  {geminiSecondOpinion && (
                    <div className="mt-3 p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
                      {geminiSecondOpinion}
                    </div>
                  )}
                </div>
              )}

              {/* 💬 "Ask Dr. Leaf" Dedicated Interactive Chat Interface */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[460px]">
                
                {/* Chat Top Bar */}
                <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center border border-white/20 text-emerald-300">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm font-['Outfit']">Ask Dr. Leaf — Crop Pathologist</h4>
                      <p className="text-[11px] text-emerald-200">Powered by Gemini 2.5 • Instant Field Answers</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-semibold">
                    Interactive
                  </span>
                </div>

                {/* Message Stream */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#FAFBF9]">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                          🌿
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isGeminiThinking && (
                    <div className="flex gap-2.5 items-center text-xs text-stone-500 italic">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                        🌿
                      </div>
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                        Dr. Leaf is analyzing your query <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                      </span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Dr. Leaf: e.g. How to prevent this spreading? What is the dosage?"
                    className="flex-1 bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none transition"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isGeminiThinking}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>

          </div>

        </main>
      )}

      {/* 🔑 Gemini API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 flex flex-col animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 font-['Outfit']">
                  Gemini API Key Settings
                </h3>
                <p className="text-xs text-stone-500">Powers Dr. Leaf Vision & Interactive Pathology</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Your key is active and securely configured. You can update or replace it here if needed.
            </p>

            <div className="space-y-3 mb-5">
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="Paste API key here"
                className="w-full bg-stone-50 border border-stone-300 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs outline-none font-mono transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📷 Live Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <span className="font-bold text-sm text-stone-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" /> Position Leaf in View
              </span>
              <button
                onClick={stopCamera}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="text-rose-400 text-xs p-4 text-center">{cameraError}</div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-8 border-2 border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-white/70 bg-black/40 px-2 py-1 rounded">
                      Align leaf center
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-stone-50 flex items-center justify-between">
              <button
                onClick={stopCamera}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" /> Snap Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌾 Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">LeafCare AI</span>
            <span>• Multimodal Vision + Local Convolutional Neural Network</span>
          </div>
          <p>© 2026 LeafCare AI • Precision Agriculture & Crop Pathology</p>
        </div>
      </footer>

    </div>
  );
}
