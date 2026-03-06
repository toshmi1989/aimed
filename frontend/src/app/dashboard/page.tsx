import { Activity, Clock, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
          <p className="text-slate-500">Welcome back, John Doe. Here is your medical overview.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          New AI Consultation
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Quick Stats and Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-1">Blood Pressure</div>
              <div className="text-2xl font-bold text-slate-900">120/80</div>
              <div className="text-xs text-accent mt-1">Normal</div>
            </div>
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-1">Heart Rate</div>
              <div className="text-2xl font-bold text-slate-900">72 bpm</div>
              <div className="text-xs text-slate-400 mt-1">Resting</div>
            </div>
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <div className="text-slate-500 text-sm font-medium mb-1">Latest Risk Score</div>
              <div className="text-2xl font-bold text-green-600">Low Risk</div>
              <div className="text-xs text-slate-400 mt-1">Assessed 2 days ago</div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Recent Medical Reports & Triages</h3>
              <button className="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="divide-y">
              
              <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">AI Consultation: Mild Fever</h4>
                  <p className="text-sm text-slate-600 line-clamp-1 mt-1">Assessed possible upper respiratory infection. Recommended rest and hydration.</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> 2 days ago
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium ml-2">Low Risk</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Lab Results: Complete Blood Count</h4>
                  <p className="text-sm text-slate-600 line-clamp-1 mt-1">Hemoglobin slightly elevated. All other parameters within normal limits.</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> 2 weeks ago
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Appointments and Profile */}
        <div className="space-y-8">
          
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Upcoming Appointments</h3>
            
            <div className="flex gap-4 items-start pb-6 border-b">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center shrink-0 text-slate-700">
                <span className="text-xs font-semibold uppercase">Oct</span>
                <span className="text-lg font-bold">14</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Dr. Sarah Jenkins</h4>
                <p className="text-sm text-slate-600">Cardiologist - Video Call</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-primary">
                  <Calendar className="w-3.5 h-3.5" /> 10:00 AM
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-center text-sm font-medium border border-slate-200 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Book Specialist
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Need immediate input?</h3>
              <p className="text-slate-300 text-sm mb-6">Our clinically-trained AI is available 24/7 to triage your symptoms.</p>
              <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors w-full">
                Chat with AI Doctor
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
          </div>

        </div>

      </div>
    </div>
  );
}
