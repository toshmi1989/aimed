import { ArrowRight, Activity, Stethoscope, FileText, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full bg-slate-50 border-b relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-sm font-semibold mb-6">
              <ShieldAlert className="w-4 h-4" />
              Professional AI Triage Assistant
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              A smarter way to understand your <span className="text-primary">Symptoms</span> & <span className="text-accent">Labs</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl">
              Our clinical reasoning AI conducts a thorough initial interview, analyzes your lab results, and connects you with the right specialist when you need one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consultation" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Start AI Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/doctors" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Find a Doctor
              </Link>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-center relative">
            <div className="w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col p-6 relative z-10 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Dr. AI</h3>
                  <p className="text-xs text-slate-500">Triage AI Assistant</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 text-sm rounded-lg text-slate-700 rounded-bl-none max-w-[85%]">
                  Hello! I'm ready to help you evaluate your symptoms. Where are you experiencing discomfort right now?
                </div>
                <div className="bg-primary/10 p-3 text-sm rounded-lg text-primary rounded-br-none self-end max-w-[85%] ml-auto">
                  I've had a persistent dry cough and mild fever since yesterday.
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                <div className="h-10 border border-slate-200 rounded-full flex-1 px-4 flex items-center text-slate-400 text-sm">
                  Type your symptoms...
                </div>
              </div>
            </div>
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 to-accent/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Care Pathway</h2>
          <p className="text-slate-600">The platform is designed to safely triage your conditions and bridge the gap with licensed professionals seamlessly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border hover:border-primary/30 hover:shadow-lg transition-all p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Triage & Assessment</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Engage in a clinical-style interview. The AI will build a differential diagnosis, structure your anamnesis, and suggest next steps.
            </p>
            <Link href="/consultation" className="text-primary font-medium inline-flex items-center gap-1 hover:underline">
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border hover:border-accent/30 hover:shadow-lg transition-all p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-accent flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Interpret Lab Tests</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Upload blood work or other labs via PDF. Our system extracts standard values, highlights abnormalities, and explains them simply.
            </p>
            <Link href="/labs" className="text-accent font-medium inline-flex items-center gap-1 hover:underline">
              Analyze Labs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border hover:border-primary/30 hover:shadow-lg transition-all p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center mb-6">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Telemedicine</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Connect directly with verified specialists. Book virtual appointments and securely transfer your AI-generated health reports to them.
            </p>
            <Link href="/doctors" className="text-slate-700 font-medium inline-flex items-center gap-1 hover:underline">
              Find Specialist <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
