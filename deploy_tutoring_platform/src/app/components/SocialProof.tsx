import { Award, GraduationCap, Trophy } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#f5f8fa] to-white border-t border-b border-[#dae3ed]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-lg text-[#5a6f84] max-w-2xl mx-auto italic">
            Built by students who've done it recently—so we teach what actually works today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
          <div className="text-center group cursor-pointer">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
              <Award className="h-10 w-10 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] bg-clip-text text-transparent mb-3">Band 9.0</div>
            <div className="text-sm text-[#5a6f84] uppercase tracking-wide">IELTS Tutor</div>
          </div>
          
          <div className="text-center group cursor-pointer">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] bg-clip-text text-transparent mb-3">1550</div>
            <div className="text-sm text-[#5a6f84] uppercase tracking-wide">SAT Score Tutor</div>
          </div>
          
          <div className="text-center group cursor-pointer">
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div className="text-5xl font-bold bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] bg-clip-text text-transparent mb-3">Top Unis</div>
            <div className="text-sm text-[#5a6f84] uppercase tracking-wide">Elite University Students</div>
          </div>
        </div>
      </div>
    </section>
  );
}