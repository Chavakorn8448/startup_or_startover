import { Facebook, Instagram, Mail, MapPin, MessageCircle, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-[#5a6f84] border-t border-[#dae3ed]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-[#1e3a5f] to-[#3b729e] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">TS</span>
              </div>
              <span className="text-lg font-semibold text-[#0a1628]">TopScoreTutors</span>
            </div>
            <p className="text-sm text-[#5a6f84] leading-relaxed">
              Thailand's premier tutoring platform connecting students with top scorers from elite universities.
            </p>
          </div>
          
          {/* Programs */}
          <div>
            <h4 className="text-sm font-semibold text-[#0a1628] mb-4 uppercase tracking-wide">Programs</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">IELTS Preparation</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">SAT Preparation</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">Our Tutors</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">Pricing</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[#0a1628] mb-4 uppercase tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-[#3b729e] transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">Success Stories</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="hover:text-[#3b729e] transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#0a1628] mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 hover:text-[#3b729e] transition-colors duration-300 cursor-pointer">
                <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>LINE: @topscoreth</span>
              </li>
              <li className="flex items-start gap-2 hover:text-[#3b729e] transition-colors duration-300 cursor-pointer">
                <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>WhatsApp: +66 XX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2 hover:text-[#3b729e] transition-colors duration-300 cursor-pointer">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>hello@topscore.th</span>
              </li>
              <li className="flex items-start gap-2 hover:text-[#3b729e] transition-colors duration-300 cursor-pointer">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Bangkok, Thailand</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-[#dae3ed] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5a6f84]">
            © 2026 TopScoreTutors. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#5a6f84] hover:text-[#3b729e] transition-all duration-300 hover:scale-110">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#5a6f84] hover:text-[#3b729e] transition-all duration-300 hover:scale-110">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#5a6f84] hover:text-[#3b729e] transition-all duration-300 hover:scale-110">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}