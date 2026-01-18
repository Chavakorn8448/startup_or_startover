import { CheckCircle2, Mail, MessageCircle } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-36 bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#3b729e] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#9ab8ce] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3b729e] rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Start with a free consultation —<br />
            <span className="text-[#9ab8ce]">and leave with a real plan.</span>
          </h2>
          
          <p className="text-lg text-[#9ab8ce] mb-14 max-w-2xl mx-auto">
            We'll recommend the right program, timeline, and tutor match based on your goals.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group px-10 py-4 bg-white text-[#1e3a5f] text-sm font-semibold rounded-xl hover:bg-[#dae3ed] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              Book Free Consultation
            </button>
            <button className="px-10 py-4 bg-transparent text-white border-2 border-[#9ab8ce] text-sm font-semibold rounded-xl hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300">
              Contact Us
            </button>
          </div>
          
          {/* Contact methods */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-[#9ab8ce] text-sm">
            <div className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span>LINE: @topscoreth</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp: +66 XX XXX XXXX</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
              <Mail className="h-4 w-4" />
              <span>hello@topscore.th</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}