import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="group border-2 border-[#dae3ed] hover:border-[#3b729e] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-[#f5f8fa] hover:to-white transition-all duration-300"
      >
        <span className="font-semibold text-[#0a1628] pr-4 text-base">{question}</span>
        <ChevronDown 
          className={`h-5 w-5 text-[#3b729e] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
        <div className="px-8 pb-6 pt-0">
          <p className="text-sm text-[#5a6f84] leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const faqs = [
    {
      question: "Do you teach online or in-person?",
      answer: "Primarily online for flexibility and access to top tutors (Thailand-friendly scheduling)."
    },
    {
      question: "Who are your tutors?",
      answer: "Recent top scorers studying at top universities, selected for both results and teaching ability."
    },
    {
      question: "Is this only for top students?",
      answer: "No—personalization works for any level. We focus on progress and consistency."
    },
    {
      question: "How is this different from a normal tutoring center?",
      answer: "We combine elite tutors + personalized learning system + modern tracking and analytics."
    },
    {
      question: "Can parents track progress?",
      answer: "Yes. Our system is designed for visibility and planning (and the app will expand this further)."
    },
    {
      question: "What if I'm not sure SAT or IELTS is right for me?",
      answer: "Book a free consultation—we'll help you choose the best path."
    }
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-[#f5f8fa] to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 leading-tight">
            Frequently Asked <span className="text-[#3b729e]">Questions</span>
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}