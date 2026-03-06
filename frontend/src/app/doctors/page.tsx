import { Search, Star, MessageSquare, Video, CheckCircle2, MapPin } from 'lucide-react';

export default function DoctorMarketplace() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Eleanor Jenkins",
      specialty: "General Practice & Internal Medicine",
      rating: 4.9,
      reviews: 128,
      location: "San Francisco, CA (or Online)",
      price: "$85",
      availability: "Available Today",
      image: "EJ"
    },
    {
      id: 2,
      name: "Dr. Marcus Chen",
      specialty: "Cardiology",
      rating: 4.8,
      reviews: 94,
      location: "New York, NY (or Online)",
      price: "$150",
      availability: "Next slots: Tomorrow",
      image: "MC"
    },
    {
      id: 3,
      name: "Dr. Sarah Al-Fayed",
      specialty: "Pediatrics",
      rating: 5.0,
      reviews: 215,
      location: "Chicago, IL (or Online)",
      price: "$90",
      availability: "Available Today",
      image: "SA"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            Find a Specialist
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
              Verified Network
            </span>
          </h1>
          <p className="text-slate-600">Connect with highly-rated doctors for a video consultation instantly.</p>
        </div>
        
        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search specialties, conditions, or doctors..." 
            className="w-full md:w-80 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Specialties</h3>
            <div className="space-y-3">
              {['General Practice', 'Cardiology', 'Pediatrics', 'Neurology', 'Dermatology'].map((s, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Consultation Fee</h3>
            <div className="space-y-3">
              {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map((f, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="lg:col-span-3 space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6">
              
              {/* Doctor Avatar */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 shrink-0 mx-auto sm:mx-0 relative">
                {doctor.image}
                <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white" title="Online now"></div>
              </div>

              {/* Central Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer">{doctor.name}</h2>
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-slate-500 font-medium text-sm mb-3">{doctor.specialty}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    {doctor.rating} <span className="text-slate-400 font-normal">({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                    {doctor.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    {doctor.availability}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                    Shares AI Reports
                  </span>
                </div>
              </div>

              {/* Right Action Column */}
              <div className="bg-slate-50 border sm:border-0 rounded-xl p-4 sm:bg-transparent sm:p-0 sm:w-48 flex flex-col justify-between shrink-0 text-center sm:text-right">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-slate-500 font-medium">Consultation Fee</p>
                  <p className="text-2xl font-bold text-slate-900">{doctor.price}</p>
                  <p className="text-xs text-slate-400 mt-1">per 30 min session</p>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <button className="w-full bg-primary text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                    <Video className="w-4 h-4" />
                    Book Video
                  </button>
                  <button className="w-full bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
