"use client";

import { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle2, ChevronRight, Loader2, Hospital } from 'lucide-react';

type LabResult = {
  test_name: string;
  value: number;
  unit: string;
  status: string;
  reference_range: string;
};

type AnalysisResponse = {
  results: LabResult[];
  abnormal_values: string[];
  interpretation: string;
  possible_causes: string[];
  recommended_tests: string[];
  doctor_specialist: string;
};

export default function LabAnalysisPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleUploadMock = () => {
    setIsUploading(true);
    // Mock the PDF upload and OCR process over 2 seconds
    setTimeout(async () => {
      setIsUploading(false);
      setIsAnalyzing(true);
      
      try {
        // Send the OCR structured data to our Python FastAPI Lab Interpreter
        const response = await fetch('http://127.0.0.1:8000/labs/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_values: {
              "hemoglobin": 10.5,
              "leukocytes": 14.2,
              "glucose": 5.0,
              "alt": 22
            },
            patient_info: {
              "age": 35,
              "sex": "female"
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        } else {
          console.error("Failed to analyze");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Lab Result Analysis</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Upload your blood work or other laboratory test results. Our AI will extract the values, compare them against standard ranges, and provide a clinical interpretation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={!isUploading && !isAnalyzing ? handleUploadMock : undefined}
            className={`border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px] transition-all 
              ${!isUploading && !isAnalyzing ? 'cursor-pointer hover:bg-primary/10' : 'opacity-70 cursor-wait'}`
            }
          >
            {isUploading || isAnalyzing ? (
               <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            ) : (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isUploading ? "Extracting Data via OCR..." : isAnalyzing ? "AI Clinical Interpretation..." : "Upload your Lab PDF"}
            </h3>
            
            {!isUploading && !isAnalyzing && (
              <>
                <p className="text-sm text-slate-500 mb-6">Drag and drop your file here, or click to browse.</p>
                <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors pointer-events-none">
                  Select File
                </button>
                <p className="text-xs text-slate-400 mt-4">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
            <AlertCircle className="w-5 h-5 shrink-0 text-blue-600" />
            <p>
              <strong>Privacy Notice:</strong> Your documents are encrypted and only used for this specific analysis. They are not shared with third parties without your explicit consent.
            </p>
          </div>
        </div>

        {/* Dynamic Analysis Result Section */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="p-6 border-b bg-slate-50 flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-500" />
            <div>
              <h3 className="font-semibold text-slate-900">Analysis Report</h3>
              <p className="text-xs text-slate-500">Extracted & Evaluated by AI</p>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {analysis ? (
              <div className="space-y-6 flex-1 flex flex-col">
                {/* Extracted Values */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-widest border-b pb-2 mb-4">Structured Lab Values</h4>
                  {analysis.results.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1">
                      <span className="font-medium text-slate-700 capitalize">{item.test_name}</span>
                      <div className="flex items-center gap-3 w-48 justify-end">
                        <span className={`font-bold ${item.status === 'normal' ? 'text-slate-900' : item.status === 'high' ? 'text-orange-600' : 'text-blue-600'}`}>
                          {item.value} {item.unit}
                        </span>
                        <div className="w-20 text-right">
                          {item.status === 'normal' && <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 justify-center w-full"><CheckCircle2 className="w-3 h-3" /> 🟢</span>}
                          {item.status === 'high' && <span className="text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 justify-center w-full">HIGH 🔴</span>}
                          {item.status === 'low' && <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 justify-center w-full">LOW 🔴</span>}
                          {item.status === 'unknown' && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">--</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Interpretation */}
                <div className="bg-slate-50 p-5 rounded-xl border mt-auto">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-primary" />
                    Clinical AI Interpretation
                  </h4>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed bg-white p-3 rounded-lg border shadow-sm">
                    {analysis.interpretation}
                  </p>
                  
                  {analysis.abnormal_values.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Possible Causes</span>
                        <ul className="list-disc pl-4 text-xs mt-1 text-slate-700 space-y-1">
                          {analysis.possible_causes.map((cause, i) => <li key={i}>{cause}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Suggested Tests</span>
                        <ul className="list-disc pl-4 text-xs mt-1 text-slate-700 space-y-1">
                          {analysis.recommended_tests.map((test, i) => <li key={i}>{test}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-5 pt-4 border-t border-slate-200">
                     <button className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                       Consult a {analysis.doctor_specialist}
                       <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <FileText className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 pb-20">Upload a lab report on the left to see the AI analysis structural breakdown here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
