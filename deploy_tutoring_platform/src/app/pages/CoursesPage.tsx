import { ArrowLeft, Clock, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

// Course offerings data
const courseOfferings = {
  SAT: [
    {
      id: 1,
      category: "Math",
      title: "SAT Math Complete Package",
      description: "Master all SAT Math topics from algebra to advanced problem solving with a 1550 scorer",
      price: "฿15,000",
      duration: "12 weeks",
      sessions: "24 sessions",
      students: "1-on-1",
      features: [
        "Personalized study plan",
        "Practice problems & mock tests",
        "Weekly progress reports",
        "Q&A support via Line"
      ]
    },
    {
      id: 2,
      category: "Math",
      title: "SAT Math Intensive (Crash Course)",
      description: "Fast-track SAT Math prep for students needing quick score improvements",
      price: "฿9,000",
      duration: "4 weeks",
      sessions: "12 sessions",
      students: "1-on-1",
      features: [
        "Focus on high-yield topics",
        "Daily practice problems",
        "2 full mock tests",
        "Priority Q&A support"
      ]
    },
    {
      id: 3,
      category: "Verbal",
      title: "SAT Reading & Writing Complete",
      description: "Comprehensive verbal prep covering reading comprehension and grammar with expert strategies",
      price: "฿15,000",
      duration: "12 weeks",
      sessions: "24 sessions",
      students: "1-on-1",
      features: [
        "Reading passage strategies",
        "Grammar rules mastery",
        "Vocabulary building",
        "Weekly writing practice"
      ]
    },
    {
      id: 4,
      category: "Verbal",
      title: "SAT Full Package (Math + Verbal)",
      description: "Complete SAT preparation covering all sections for maximum score improvement",
      price: "฿28,000",
      priceNote: "Save ฿2,000",
      duration: "12 weeks",
      sessions: "48 sessions",
      students: "1-on-1",
      features: [
        "Full SAT coverage",
        "Personalized study plan",
        "4 full mock tests",
        "Parent progress meetings",
        "Unlimited Q&A support"
      ]
    },
  ],
  IELTS: [
    {
      id: 5,
      category: "Reading",
      title: "IELTS Reading Mastery",
      description: "Achieve Band 8-9 in Reading with proven skimming, scanning, and comprehension techniques",
      price: "฿8,000",
      duration: "6 weeks",
      sessions: "12 sessions",
      students: "1-on-1",
      features: [
        "All question types covered",
        "Speed reading techniques",
        "Practice with real tests",
        "Time management strategies"
      ]
    },
    {
      id: 6,
      category: "Writing",
      title: "IELTS Writing Excellence",
      description: "Master Task 1 & 2 with Band 9 writing strategies and personalized feedback",
      price: "฿10,000",
      duration: "8 weeks",
      sessions: "16 sessions",
      students: "1-on-1",
      features: [
        "Task 1 & 2 strategies",
        "Essay corrections",
        "Band 9 vocabulary",
        "Grammar refinement"
      ]
    },
    {
      id: 7,
      category: "Listening",
      title: "IELTS Listening Boost",
      description: "Improve listening score with note-taking strategies and accent familiarization",
      price: "฿7,000",
      duration: "5 weeks",
      sessions: "10 sessions",
      students: "1-on-1",
      features: [
        "Note-taking systems",
        "Accent training",
        "Practice tests",
        "Common trap awareness"
      ]
    },
    {
      id: 8,
      category: "Speaking",
      title: "IELTS Speaking Confidence",
      description: "Build fluency and confidence with mock interviews and Band 9 response frameworks",
      price: "฿9,000",
      duration: "6 weeks",
      sessions: "12 sessions",
      students: "1-on-1",
      features: [
        "Mock speaking tests",
        "Fluency exercises",
        "Topic-specific practice",
        "Pronunciation coaching"
      ]
    },
    {
      id: 9,
      category: "All Skills",
      title: "IELTS Complete Package",
      description: "Full IELTS preparation covering all 4 skills for Band 8-9 achievement",
      price: "฿32,000",
      priceNote: "Save ฿2,000",
      duration: "12 weeks",
      sessions: "48 sessions",
      students: "1-on-1",
      features: [
        "All 4 skills covered",
        "Personalized study plan",
        "8 full mock tests",
        "Weekly progress reports",
        "Unlimited Q&A support",
        "Parent progress meetings"
      ]
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
    badge: "bg-blue-100"
  },
  Verbal: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100"
  },
  // IELTS colors
  Reading: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100"
  },
  Writing: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100"
  },
  Listening: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badge: "bg-rose-100"
  },
  Speaking: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100"
  },
  "All Skills": {
    bg: "bg-gradient-to-br from-green-50 to-indigo-50",
    border: "border-gradient-to-r from-green-200 to-indigo-200",
    text: "text-[#1e3a5f]",
    badge: "bg-gradient-to-r from-green-100 to-indigo-100"
  }
};

export function CoursesPage() {
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
            Our Course Programs
          </h1>
          <p className="text-lg text-[#5a6f84] max-w-2xl mx-auto">
            Choose from our comprehensive course packages designed by top scorers. All courses include personalized learning plans and progress tracking.
          </p>
        </div>

        {/* SAT Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-[#0a1628]">SAT Programs</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
              Tutor Score: 1550
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {courseOfferings.SAT.map((course) => {
              const colors = categoryColors[course.category as keyof typeof categoryColors];
              const isFullPackage = course.category === "Verbal" && course.title.includes("Full Package");
              
              return (
                <div 
                  key={course.id}
                  className={`relative bg-white border-2 ${colors.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${isFullPackage ? 'ring-2 ring-[#3b729e] ring-offset-2' : ''}`}
                >
                  {isFullPackage && (
                    <div className="absolute -top-3 right-6 px-4 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-xs font-bold rounded-full">
                      BEST VALUE
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className={`inline-block px-3 py-1 ${colors.badge} ${colors.text} text-xs font-semibold rounded-full mb-4`}>
                    {course.category}
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">
                    {course.title}
                  </h3>
                  <p className="text-[#5a6f84] mb-4 text-sm">
                    {course.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#1e3a5f]">
                        {course.price}
                      </span>
                      {course.priceNote && (
                        <span className="text-sm text-green-600 font-semibold">
                          {course.priceNote}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Course Details */}
                  <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-[#dae3ed]">
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.sessions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#5a6f84]">
                        <CheckCircle2 className="w-4 h-4 text-[#3b729e] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* IELTS Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-[#0a1628]">IELTS Programs</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
              Tutor Band: 9.0
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseOfferings.IELTS.map((course) => {
              const colors = categoryColors[course.category as keyof typeof categoryColors];
              const isFullPackage = course.category === "All Skills";
              
              return (
                <div 
                  key={course.id}
                  className={`relative bg-white border-2 ${colors.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${isFullPackage ? 'ring-2 ring-[#3b729e] ring-offset-2 lg:col-span-3 md:max-w-2xl md:mx-auto' : ''}`}
                >
                  {isFullPackage && (
                    <div className="absolute -top-3 right-6 px-4 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-xs font-bold rounded-full">
                      BEST VALUE
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className={`inline-block px-3 py-1 ${colors.badge} ${colors.text} text-xs font-semibold rounded-full mb-4`}>
                    {course.category}
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">
                    {course.title}
                  </h3>
                  <p className="text-[#5a6f84] mb-4 text-sm">
                    {course.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#1e3a5f]">
                        {course.price}
                      </span>
                      {course.priceNote && (
                        <span className="text-sm text-green-600 font-semibold">
                          {course.priceNote}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Course Details */}
                  <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-[#dae3ed]">
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.sessions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5a6f84]">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className={`space-y-2 mb-6 ${isFullPackage ? 'md:columns-2 md:gap-8' : ''}`}>
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#5a6f84]">
                        <CheckCircle2 className="w-4 h-4 text-[#3b729e] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/30 rounded-2xl p-12 border border-[#9ab8ce]/20">
          <h3 className="text-2xl font-bold text-[#0a1628] mb-4">
            Not sure which program is right for you?
          </h3>
          <p className="text-[#5a6f84] mb-6 max-w-2xl mx-auto">
            Book a free consultation to discuss your goals and get personalized course recommendations from our expert team.
          </p>
          <Link 
            to="/video-demos"
            className="inline-block px-9 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
