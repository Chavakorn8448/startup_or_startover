import { CheckCircle2, Star } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Hero() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        const supabase = createClient(
          `https://${projectId}.supabase.co`,
          publicAnonKey
        );
        const { data: { user } } = await supabase.auth.getUser(accessToken);
        setUser(user);
      }
    };
    
    checkUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 lg:px-8 py-6 flex items-center justify-between border-b border-[#dae3ed]">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold">TS</span>
          </div>
          <span className="text-xl font-semibold text-[#0a1628]">TopScoreTutors</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a href="#programs" className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105">Programs</a>
          <a href="#how-it-works" className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105">How It Works</a>
          <a href="#about" className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105">About</a>
          {user ? (
            <Link
              to="/lecture-library"
              className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105"
            >
              Lecture Library
            </Link>
          ) : null}
          {user ? (
            <>
              <span className="text-sm text-[#1e3a5f] font-medium">
                {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="text-sm text-[#5a6f84] hover:text-[#1e3a5f] transition-all duration-300 hover:scale-105">
              Sign In
            </Link>
          )}
          <Link to="/video-demos" className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
            Book Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#dae3ed] to-[#9ab8ce]/30 px-5 py-2.5 rounded-full mb-6 border border-[#9ab8ce]/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <span className="text-xs uppercase tracking-wider text-[#1e3a5f] font-semibold">THAILAND'S HIGH ACHIEVING STUDENT-RUN TUTORING PLATFORM</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0a1628] mb-5 leading-[1.1] tracking-tight">
            Learn from top scorers.<br />
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#3b729e] to-[#9ab8ce] bg-clip-text text-transparent">
              Get results that matter.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#5a6f84] mb-8 leading-relaxed max-w-3xl mx-auto">
            We match you with recent near-perfect scorers studying at top universities and build a personalized plan that goes beyond lessons: clips, Q&A, daily practice, and progress tracking.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/video-demos" className="group px-9 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden inline-block text-center">
              <span className="relative z-10">Book a Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b729e] to-[#1e3a5f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link to="/courses" className="px-9 py-4 bg-white text-[#1e3a5f] border-2 border-[#9ab8ce] text-sm font-medium rounded-lg hover:border-[#3b729e] hover:bg-[#dae3ed]/30 hover:scale-105 transition-all duration-300 inline-block text-center">
              See Programs (IELTS / SAT)
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group hover:scale-110 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] bg-clip-text text-transparent mb-2">9.0</div>
              <div className="text-sm text-[#5a6f84]">IELTS Band Tutor</div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] bg-clip-text text-transparent mb-2">1550</div>
              <div className="text-sm text-[#5a6f84]">SAT Score Tutor</div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-300">
              <div className="text-4xl font-bold text-[#3b729e] mb-2">✓</div>
              <div className="text-sm text-[#5a6f84]">Personalized Plan</div>
            </div>
            <div className="text-center group hover:scale-110 transition-all duration-300">
              <div className="text-4xl font-bold mb-2">🇹🇭</div>
              <div className="text-sm text-[#5a6f84]">Thailand-focused</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}