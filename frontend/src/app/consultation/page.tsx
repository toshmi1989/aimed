"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Activity, User, ShieldAlert, FileText, AlertCircle, Video } from 'lucide-react';

type Message = {
  role: 'ai' | 'user';
  content: string;
};

// Represents the medical state we track throughout the conversation
type AnamnesisState = {
  age?: number;
  sex?: string;
  duration?: string;
  severity?: string;
  associated_symptoms: string[];
};

export default function ConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am your AI Medical Triage Assistant. Could you please describe what is bothering you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Real conversation state
  const [consultationId] = useState(() => crypto.randomUUID());
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [anamnesis, setAnamnesis] = useState<AnamnesisState>({ associated_symptoms: [] });
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [possibleCauses, setPossibleCauses] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Naive symptom extraction (In a real app, an LLM would parse the userMsg to update anamnesis state)
    // For this MVP, we will pass the entire conversation history as context if needed, 
    // but the backend expects structured lists. We'll append the raw text as a "symptom" for the mock engine.
    const updatedSymptoms = [...symptoms, userMsg];
    setSymptoms(updatedSymptoms);

    try {
      // Call the Python FastAPI Backend
      const response = await fetch('http://127.0.0.1:8000/triage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: updatedSymptoms,
          anamnesis: anamnesis
        })
      });

      if (!response.ok) throw new Error("Failed to reach triage engine");
      
      const data = await response.json();
      
      // Update UI state with AI analysis
      setRiskLevel(data.risk_level);
      setPossibleCauses(data.possible_causes);

      // Determine next AI message
      let aiResponseText = "";
      
      if (data.risk_level === "emergency") {
        aiResponseText = "⚠️ EMERGENCY RISK DETECTED. " + data.recommended_action;
      } else if (data.next_questions && data.next_questions.length > 0) {
        // Just ask the first question for simplicity
        aiResponseText = data.next_questions[0]; 
      } else {
        aiResponseText = `Based on our conversation, possible causes include: ${data.possible_causes.join(', ')}. ${data.recommended_action}`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm having trouble connecting to my medical database. Please try again. If this is an emergency, call your local emergency number." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border-r">
        {/* Chat Header */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-slate-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 leading-tight">AI Medical Triage</h2>
              <p className="text-xs text-slate-500 font-medium font-mono">
                ID: {consultationId.split('-')[0]}
              </p>
            </div>
          </div>
          {riskLevel === 'emergency' && (
             <div className="animate-pulse bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
               EMERGENCY PROTOCOL ACTIVE
             </div>
          )}
        </div>

        {/* Emergency Escalation Banner */}
        {riskLevel === 'emergency' && (
          <div className="bg-red-500 text-white p-4 flex items-center gap-4 justify-center shadow-inner z-10 transition-all">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">EMERGENCY DETECTED</h3>
              <p className="text-sm">Please stop this chat and call emergency services (911/112) or go to the nearest emergency room immediately.</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <strong>Medical Disclaimer:</strong> I am an AI designed for preliminary triage and not a replacement for a licensed doctor. In a medical emergency, please call your local emergency number immediately.
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-primary/10 text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : (riskLevel === 'emergency' && idx === messages.length - 1)
                      ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-sm shadow-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Doctor Referral Hook (Shown after risk is evaluated, if not emergency) */}
            {riskLevel && riskLevel !== 'emergency' && messages.length > 5 && (
               <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-[80%] ml-12">
                 <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                   <User className="w-4 h-4 text-primary" /> Specialist Recommendation
                 </h4>
                 <p className="text-sm text-slate-600 mb-4">Based on your triage, a consultation with a General Practitioner is recommended to confirm the diagnosis.</p>
                 <button className="bg-primary text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                   <Video className="w-4 h-4" /> Book Video Consultation
                 </button>
               </div>
            )}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="px-5 py-4 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <form 
            className="max-w-3xl mx-auto relative flex items-end gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms here... (Try typing 'severe chest pain' to test emergency logic)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none min-h-[56px] max-h-32 text-[15px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={riskLevel === 'emergency'}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping || riskLevel === 'emergency'}
              className="h-14 w-14 shrink-0 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar: Anamnesis Summary */}
      <div className="hidden lg:flex w-80 bg-slate-50 flex-col p-6 overflow-y-auto">
        <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Live Anamnesis
        </h3>
        
        {messages.length > 1 ? (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="absolute top-4 right-4 max-w-[50%]">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
                  riskLevel === 'emergency' ? 'bg-red-100 text-red-700' : 
                  riskLevel === 'urgent' ? 'bg-orange-100 text-orange-700' :
                  riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {riskLevel ? `${riskLevel} RISK` : 'IN PROGRESS'}
                </span>
              </div>

              <div className="mb-4 mt-2">
                <div className="text-xs text-slate-500 font-medium mb-1">Reported Symptoms</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {symptoms.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg max-w-full truncate" title={s}>
                      {s.length > 25 ? s.substring(0, 25) + '...' : s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {possibleCauses.length > 0 && (
              <div className={`${riskLevel === 'emergency' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border p-4 rounded-xl shadow-sm`}>
                <h4 className={`flex items-center gap-2 text-sm font-bold mb-3 ${riskLevel === 'emergency' ? 'text-red-800' : 'text-green-800'}`}>
                  <AlertCircle className="w-4 h-4" />
                  Differential Diagnosis
                </h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {possibleCauses.map((cause, idx) => (
                    <li key={idx} className={`text-xs ${riskLevel === 'emergency' ? 'text-red-700' : 'text-green-700'}`}>
                      {cause}
                    </li>
                  ))}
                </ul>
                <button className={`w-full bg-white border text-xs font-semibold py-2 rounded-lg transition-colors ${
                  riskLevel === 'emergency' 
                    ? 'border-red-300 text-red-700 hover:bg-red-100' 
                    : 'border-green-300 text-green-700 hover:bg-green-100'
                }`}>
                  Generate Full PDF Report
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-500 text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
            Summary will build automatically as you chat.
          </div>
        )}
      </div>
    </div>
  );
}
