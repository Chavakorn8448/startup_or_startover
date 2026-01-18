import { ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";

// Mock video data
const videoCategories = {
  SAT: [
    {
      id: 1,
      category: "Math",
      title: "Algebra Problem Solving Techniques",
      duration: "12:30",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
      tutor: "Alex Chen",
      score: "1550"
    },
    {
      id: 2,
      category: "Math",
      title: "Geometry Shortcuts & Tips",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
      tutor: "Alex Chen",
      score: "1550"
    },
    {
      id: 3,
      category: "Verbal",
      title: "Reading Comprehension Strategies",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      tutor: "Sarah Lin",
      score: "1550"
    },
    {
      id: 4,
      category: "Verbal",
      title: "Grammar Rules Made Simple",
      duration: "14:15",
      thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
      tutor: "Sarah Lin",
      score: "1550"
    },
  ],
  IELTS: [
    {
      id: 5,
      category: "Reading",
      title: "IELTS Reading: Skimming & Scanning",
      duration: "16:30",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      tutor: "Emma Wilson",
      score: "9.0"
    },
    {
      id: 6,
      category: "Writing",
      title: "Task 2 Essay Structure",
      duration: "20:45",
      thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
      tutor: "David Park",
      score: "9.0"
    },
    {
      id: 7,
      category: "Listening",
      title: "Note-Taking Strategies",
      duration: "13:50",
      thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400",
      tutor: "Emma Wilson",
      score: "9.0"
    },
    {
      id: 8,
      category: "Speaking",
      title: "Part 2: Mastering the Cue Card",
      duration: "17:25",
      thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
      tutor: "Michael Brown",
      score: "9.0"
    },
  ]
};

// Color coding for categories
const categoryColors = {
  // SAT colors
  Math: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:bg-blue-100"
  },
  Verbal: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    hover: "hover:bg-purple-100"
  },
  // IELTS colors
  Reading: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:bg-green-100"
  },
  Writing: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    hover: "hover:bg-amber-100"
  },
  Listening: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    hover: "hover:bg-rose-100"
  },
  Speaking: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    hover: "hover:bg-indigo-100"
  }
};

export function VideoDemos() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-[#dae3ed]">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#1e3a5f] hover:text-[#3b729e] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">
            Teaching Video Demos
          </h1>
          <p className="text-lg text-[#5a6f84] max-w-2xl mx-auto">
            Watch sample lessons from our top-scoring tutors. Each video demonstrates our teaching style and expertise.
          </p>
        </div>

        {/* SAT Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#0a1628]">SAT</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
              Score: 1550
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoCategories.SAT.map((video) => {
              const colors = categoryColors[video.category as keyof typeof categoryColors];
              return (
                <div 
                  key={video.id}
                  className="group bg-white border border-[#dae3ed] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1e3a5f] ml-1" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.border} border ${colors.text} text-xs font-semibold rounded-full mb-3`}>
                      {video.category}
                    </div>
                    <h3 className="font-semibold text-[#0a1628] mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[#5a6f84]">
                      {video.tutor} • SAT {video.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* IELTS Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#0a1628]">IELTS</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
              Band 9.0
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoCategories.IELTS.map((video) => {
              const colors = categoryColors[video.category as keyof typeof categoryColors];
              return (
                <div 
                  key={video.id}
                  className="group bg-white border border-[#dae3ed] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1e3a5f] ml-1" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.border} border ${colors.text} text-xs font-semibold rounded-full mb-3`}>
                      {video.category}
                    </div>
                    <h3 className="font-semibold text-[#0a1628] mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[#5a6f84]">
                      {video.tutor} • IELTS {video.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/30 rounded-2xl p-12 border border-[#9ab8ce]/20">
          <h3 className="text-2xl font-bold text-[#0a1628] mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-[#5a6f84] mb-6 max-w-2xl mx-auto">
            Book a free trial session with one of our expert tutors and experience personalized learning firsthand.
          </p>
          <Link 
            to="/"
            className="inline-block px-9 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Book a Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
