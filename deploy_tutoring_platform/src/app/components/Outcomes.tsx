import { Calendar, CheckCircle2, MessageCircle, TrendingUp, Video, Zap } from "lucide-react";

export function Outcomes() {
  const outcomes = [
    {
      icon: Calendar,
      title: "A clear weekly plan you can actually follow"
    },
    {
      icon: Video,
      title: "Short clips that save time and make concepts stick"
    },
    {
      icon: MessageCircle,
      title: "Fast answers to questions (so students don't get stuck)"
    },
    {
      icon: TrendingUp,
      title: "Test strategy + real insights from top university students"
    },
    {
      icon: Zap,
      title: "Confidence and consistency—not last-minute panic"
    }
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-[#f5f8fa] to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 leading-tight">
            What you get <span className="text-[#3b729e]">(beyond tutoring)</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {outcomes.map((outcome, index) => (
              <div key={index} className="group flex items-start gap-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-[#9ab8ce]">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <outcome.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-lg text-[#0a1628] font-medium pt-3 leading-relaxed">{outcome.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}