"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Activity, User, ShieldAlert, FileText, AlertCircle, Video, FileSearch } from 'lucide-react';

type Message = {
  role: 'ai' | 'user';
  content: string;
};

type AnamnesisState = {
  age?: number;
  sex?: string;
  duration?: string;
  severity?: string;
  associated_symptoms: string[];
};

type ClinicalReasoning = {
  assessment: string;
  possible_causes: string[];
  recommended_tests: string[];
  risk_level: string;
  specialist: string;
  treatment_advice: string;
};

export default function ConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am your AI Medical Assistant. Could you please describe what is bothering you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [consultationId] = useState(() => crypto.randomUUID());
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [anamnesis] = useState<AnamnesisState>({ associated_symptoms: [] });
  const [reasoning, setReasoning] = useState<ClinicalReasoning | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    const updatedSymptoms = [...symptoms, userMsg];
    setSymptoms(updatedSymptoms);

    try {
      // 1. Triage API for conversation flow
      const triageRes = await fetch('http://127.0.0.1:8000/triage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: updatedSymptoms, anamnesis: anamnesis })
      });
      const triageData = await triageRes.json();

      // 2. Clinical Reasoning API to build the RAG Trace
      const reasonRes = await fetch('http://127.0.0.1:8000/clinical/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: updatedSymptoms, anamnesis: anamnesis })
      });
      const reasonData = await reasonRes.json();
      setReasoning(reasonData);

      // Determine next AI message based on Risk and Triage
      let aiResponseText = "";
      
      if (reasonData.risk_level === "emergency") {
        aiResponseText = "⚠️ EMERGENCY RISK DETECTED. " + reasonData.treatment_advice;
      } else if (triageData.next_questions && triageData.next_questions.length > 0) {
        aiResponseText = triageData.next_questions[0]; 
      } else {
        aiResponseText = `Based on my assessment, possible causes include: ${reasonData.possible_causes.join(', ')}. ${reasonData.treatment_advice}`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm having trouble connecting to my medical database. Please try again or seek emergency care if needed." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white border-r relative">
        {/* Chat Header */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-slate-50 shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 leading-tight">AI Clinical Assistant</h2>
              <p className="text-xs text-slate-500 font-medium font-mono">ID: {consultationId.split('-')[0]}</p>
            </div>
          </div>
          {reasoning?.risk_level === 'emergency' && (
             <div className="animate-pulse bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
               EMERGENCY PROTOCOL
             </div>
          )}
        </div>

        {/* Emergency Escalation Banner */}
        {reasoning?.risk_level === 'emergency' && (
          <div className="bg-red-500 text-white p-4 flex items-center gap-4 justify-center shadow-inner z-10 shrink-0">
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
                <strong>Medical Disclaimer:</strong> I am an AI designed for preliminary triage using RAG logic and not a replacement for a licensed doctor. In a medical emergency, please call your local emergency number.
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
                    : (reasoning?.risk_level === 'emergency' && idx === messages.length - 1)
                      ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-sm shadow-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {reasoning && reasoning.risk_level !== 'emergency' && messages.length > 5 && (
               <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-[80%] ml-12">
                 <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                   <User className="w-4 h-4 text-primary" /> Specialist Recommendation
                 </h4>
                 <p className="text-sm text-slate-600 mb-4">Based on our clinical reasoning, a consultation with a <strong>{reasoning.specialist}</strong> is recommended.</p>
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
        <div className="p-4 border-t bg-white shrink-0">
          <form 
            className="max-w-3xl mx-auto relative flex items-end gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none min-h-[56px] max-h-32 text-[15px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={reasoning?.risk_level === 'emergency'}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping || reasoning?.risk_level === 'emergency'}
              className="h-14 w-14 shrink-0 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar: RAG Clinical Reasoning Trace */}
      <div className="hidden lg:flex w-[400px] bg-slate-50 flex-col p-6 overflow-y-auto border-l border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-primary" />
          Clinical Reasoning Trace
        </h3>
        
        {messages.length > 1 ? (
          <div className="space-y-4">
            
            {/* Risk Indicator */}
            {reasoning && (
                <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                    reasoning.risk_level === 'emergency' ? 'bg-red-50 border-red-200 text-red-800' : 
                    reasoning.risk_level === 'urgent' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    reasoning.risk_level === 'moderate' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <div className="text-[10px] uppercase font-bold opacity-70 tracking-wider">Assessed Risk</div>
                        <div className="font-semibold capitalize">{reasoning.risk_level} Risk</div>
                    </div>
                </div>
            )}

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Symptoms */}
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Primary Symptoms</div>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg max-w-full truncate" title={s}>
                      {s.length > 25 ? s.substring(0, 25) + '...' : s}
                    </span>
                  ))}
                </div>
              </div>

              {reasoning ? (
                 <>
                    {/* Assessment Narrative */}
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Clinical Assessment</div>
                        <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                            {reasoning.assessment.split('\n\nClinical References')[0]}
                        </p>
                    </div>

                    {/* Differential */}
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Possible Causes</div>
                        <ul className="list-disc pl-4 space-y-1">
                        {reasoning.possible_causes.map((cause, idx) => (
                            <li key={idx} className={`text-sm ${reasoning.risk_level === 'emergency' ? 'text-red-700 font-medium' : 'text-slate-700'}`}>
                            {cause}
                            </li>
                        ))}
                        </ul>
                    </div>

                    {/* Tests */}
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Recommended Tests</div>
                        <div className="flex flex-wrap gap-2">
                            {reasoning.recommended_tests.map((test, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs">
                                    {test}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* RAG References */}
                    {reasoning.assessment.includes('Clinical References utilized:') && (
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex flex-wrap items-center gap-1">
                                RAG Clinical References
                            </div>
                            <div className="bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg text-xs leading-relaxed">
                                {reasoning.assessment.split('Clinical References utilized: ')[1]}
                            </div>
                        </div>
                    )}
                 </>
              ) : (
                <div className="flex items-center justify-center p-8 text-slate-400">
                    <Activity className="w-6 h-6 animate-pulse" />
                </div>
              )}
            </div>

            {reasoning && reasoning.risk_level !== 'emergency' && (
                <button className={`w-full bg-white border text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  reasoning.risk_level === 'emergency' 
                    ? 'border-red-300 text-red-700 hover:bg-red-100' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}>
                  Generate Patient Report
                </button>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-500 text-center py-10 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-xl">
            <Activity className="w-8 h-8 text-slate-300 mb-3" />
            Clinical evidence vector search will build automatically as you chat.
          </div>
        )}
      </div>
    </div>
  );
}
