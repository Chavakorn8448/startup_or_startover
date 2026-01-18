import { MessageSquare, Target, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Free consultation",
      description: "We identify your goal, timeline, and current level."
    },
    {
      icon: Target,
      number: "02",
      title: "Personalized plan + matching",
      description: "You get matched to the right tutor and receive a weekly plan based on your gaps."
    },
    {
      icon: TrendingUp,
      number: "03",
      title: "Practice + feedback + tracking",
      description: "You study with clips, ask questions, do targeted practice, and track progress (with parent visibility when needed)."
    }
  ];

  return (
    <section id="how-it-works" className="py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4 leading-tight">
            How we help you <span className="text-[#3b729e]">improve</span>
          </h2>
          <p className="text-lg text-[#5a6f84] italic">(simple + measurable)</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="group relative text-center hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="absolute -top-3 -right-3 h-10 w-10 bg-[#dae3ed] rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#3b729e] group-hover:to-[#1e3a5f] transition-all duration-300 shadow-md">
                    <span className="text-sm font-bold text-[#1e3a5f] group-hover:text-white transition-colors duration-300">{step.number}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#0a1628] mb-4">{step.title}</h3>
                <p className="text-sm text-[#5a6f84] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}