import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export function Programs() {
  return (
    <section id="programs" className="py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 leading-tight">
            Choose your path
          </h2>
          <p className="text-lg text-[#5a6f84] max-w-2xl mx-auto">
            Whether you're aiming for university abroad or strengthening your English proficiency, we have a program designed for your goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* IELTS Program */}
          <div className="group relative border-2 border-[#dae3ed] rounded-2xl p-10 hover:border-[#3b729e] transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] bg-gradient-to-br from-white to-[#f5f8fa] overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/5 to-[#3b729e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-[#0a1628] mb-2">IELTS Program</h3>
              <p className="text-sm text-[#5a6f84] mb-8">For students aiming for higher bands fast</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Speaking & writing feedback that's precise and actionable</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Band-focused strategies + real test-level practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Confidence-building structure (especially for Thai learners)</span>
                </li>
              </ul>
              
              <button className="w-full px-6 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm rounded-xl hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 group/btn">
                <span>See IELTS Plan</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* SAT Program */}
          <div className="group relative border-2 border-[#dae3ed] rounded-2xl p-10 hover:border-[#3b729e] transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] bg-gradient-to-br from-white to-[#f5f8fa] overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/5 to-[#3b729e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-[#0a1628] mb-2">SAT Program</h3>
              <p className="text-sm text-[#5a6f84] mb-8">For students targeting top universities</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Personalized skill map (math, reading, writing)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Practice-exam analytics + targeted drills</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-[#0a1628]">Strategy training from someone who scored 1550</span>
                </li>
              </ul>
              
              <button className="w-full px-6 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm rounded-xl hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 group/btn">
                <span>See SAT Plan</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}