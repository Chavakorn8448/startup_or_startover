import { Award, Sparkles, Target, Video, MessageCircle, BookOpen, BarChart3, Smartphone } from "lucide-react";

export function Solution() {
  return (
    <section className="py-28 bg-gradient-to-b from-[#f5f8fa] to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 leading-tight">
            What makes us <span className="text-[#3b729e]">different</span>
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Pillar 1 */}
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#3b729e] mb-6 font-semibold">
                Pillar 1
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 leading-tight">
                Tutors who recently scored near-perfect
              </h3>
              <p className="text-lg text-[#5a6f84] leading-relaxed">
                We prioritize tutors who just achieved top scores and are studying at elite universities—so students learn the most relevant strategies, not outdated habits.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { icon: Award, title: "Recent top scores", desc: "Band 9, SAT 1550" },
                { icon: Target, title: "Elite universities", desc: "Oxford, MIT, Stanford" },
                { icon: Sparkles, title: "Current strategies", desc: "What works today" }
              ].map((item, idx) => (
                <div key={idx} className="group flex items-start gap-5 p-5 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="pt-2">
                    <div className="text-base font-semibold text-[#0a1628] mb-1">{item.title}</div>
                    <div className="text-sm text-[#5a6f84]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 space-y-6">
              {[
                { icon: Video, title: "Short clips + explanations", desc: "Bite-sized learning" },
                { icon: MessageCircle, title: "Ask questions anytime", desc: "Never get stuck" },
                { icon: BookOpen, title: "Targeted homework", desc: "Focus on your weaknesses" },
                { icon: Smartphone, title: "Mobile app", desc: "Daily quizzes & flashcards" }
              ].map((item, idx) => (
                <div key={idx} className="group flex items-start gap-5 p-5 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="pt-2">
                    <div className="text-base font-semibold text-[#0a1628] mb-1">{item.title}</div>
                    <div className="text-sm text-[#5a6f84]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs uppercase tracking-widest text-[#3b729e] mb-6 font-semibold">
                Pillar 2
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 leading-tight">
                A personalized learning system <span className="text-[#3b729e]">(not just lessons)</span>
              </h3>
              <p className="text-lg text-[#5a6f84] leading-relaxed">
                We build each student a tailored plan: short clips, Q&A access, structured homework that targets weaknesses, and a mobile app with daily quizzes, flashcards, and parent view.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#3b729e] mb-6 font-semibold">
                Pillar 3
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 leading-tight">
                High achievers who can actually teach
              </h3>
              <p className="text-lg text-[#5a6f84] leading-relaxed mb-10">
                We don't accept tutors just because they have a strong score. We recruit people who are:
              </p>
              <div className="space-y-4">
                {[
                  "Proven high performers",
                  "Trained to explain clearly",
                  "Committed to helping students stay consistent"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:scale-105 transition-all duration-300">
                    <div className="h-8 w-8 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-base text-[#0a1628] font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[
                { name: "Sarah Chen", title: "IELTS Band 9.0 • Oxford", quote: "I love helping students build confidence in speaking and writing." },
                { name: "James Wang", title: "SAT 1550 • MIT", quote: "I focus on teaching strategy, not just content." }
              ].map((tutor, idx) => (
                <div key={idx} className="group border-2 border-[#dae3ed] rounded-2xl p-7 hover:border-[#3b729e] hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-full shadow-md"></div>
                    <div>
                      <div className="font-semibold text-[#0a1628]">{tutor.name}</div>
                      <div className="text-xs text-[#5a6f84]">{tutor.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#5a6f84] italic">{tutor.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}