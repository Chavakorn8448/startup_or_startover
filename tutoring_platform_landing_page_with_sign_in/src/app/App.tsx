import "@/styles/fonts.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Hero } from "@/app/components/Hero";
import { SocialProof } from "@/app/components/SocialProof";
import { Solution } from "@/app/components/Solution";
import { Programs } from "@/app/components/Programs";
import { HowItWorks } from "@/app/components/HowItWorks";
import { Outcomes } from "@/app/components/Outcomes";
import { About } from "@/app/components/About";
import { FAQ } from "@/app/components/FAQ";
import { FinalCTA } from "@/app/components/FinalCTA";
import { Footer } from "@/app/components/Footer";
import { VideoDemos } from "@/app/pages/VideoDemos";
import { CoursesPage } from "@/app/pages/CoursesPage";
import { SignInPage } from "@/app/pages/SignInPage";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <SocialProof />
      <Solution />
      <Programs />
      <HowItWorks />
      <Outcomes />
      <About />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/video-demos" element={<VideoDemos />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}