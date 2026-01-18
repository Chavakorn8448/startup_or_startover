import { Heart, Users } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function About() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left side - Content */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[#3b729e] mb-6 font-semibold">
                Our Story
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-8 leading-tight">
                Built by students who understand <span className="text-[#3b729e]">the pressure</span>
              </h2>
              
              <div className="space-y-6 text-base text-[#5a6f84] leading-relaxed">
                <p>
                  We're a team of high-achieving university students and educators who've recently achieved top scores (IELTS 9.0, SAT 1550). We created this because we saw the same problem in Thailand again and again: expensive tutoring, but no personalized system and no modern learning experience.
                </p>
                
                <p>
                  We teach academics—and what comes after: discipline, planning, and guidance for top university applications.
                </p>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden border-4 border-[#dae3ed] group-hover:border-[#3b729e] transition-all duration-500 shadow-xl group-hover:shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1600104055491-a1b4740563e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMHJlYWRpbmd8ZW58MXx8fHwxNzY4NDUzNjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="University students studying"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}