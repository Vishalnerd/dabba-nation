"use client";

import { Heart, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F9F7F0] pt-12 md:pt-20 pb-10 px-4 sm:px-6 md:px-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Brand Card - Spans 2 columns on larger screens */}
          <div className="sm:col-span-2 bg-[#FF8C42] border-4 border-[#333333] p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0px_#333333] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2 rounded-xl border-2 border-[#333333] rotate-[-10deg]">
                  <span className="text-2xl">🍱</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  DabbaNation
                </h2>
              </div>
              <p className="text-white font-bold text-base md:text-lg max-w-sm leading-tight">
                Fresh, home-cooked magic delivered straight to your desk. No
                stress, just taste.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              {[Instagram, Twitter, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-white p-3 rounded-2xl border-4 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Icon className="w-6 h-6 text-[#333333]" />
                </a>
              ))}
            </div>
          </div>

          {/* Office Location Map Card - Increased min-h for mobile */}
          <div className="bg-white border-4 border-[#333333] rounded-[2.5rem] shadow-[8px_8px_0px_#333333] overflow-hidden relative min-h-[300px] sm:min-h-[250px] lg:min-h-0">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14022.955513257521!2d77.22744885!3d28.51600375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce19680e65535%3A0x4747e569b0ab97c8!2sDevli%2C%20Sangam%20Vihar%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1705412345678!5m2!1sen!2sin"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="absolute top-4 left-4 bg-[#A3D9A5] border-2 border-[#333333] px-3 py-1 rounded-full shadow-[2px_2px_0px_#333333] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#333333]" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#333333]">
                Our HQ
              </span>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-[#FFD166] border-4 border-[#333333] p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0px_#333333] flex flex-col justify-between">
            <h3 className="text-xl font-black text-[#333333] uppercase mb-4 tracking-widest leading-none">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-[#333333]/60 mb-1 tracking-tighter">
                  Office Address
                </span>
                <span className="font-black text-[#333333] text-sm leading-tight italic">
                  House No. 428,Nai Basti,Deoli,Pushpa Bhawan,South
                  Delhi,Delhi-110080
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-[#333333]/60 mb-1 tracking-tighter">
                  Email Us
                </span>
                <span className="font-black text-[#333333] text-sm underline break-all">
                  <a href="mailto:dabbnation.tiffin@gmail.com">
                    dabbnation.tiffin@gmail.com
                  </a>
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block text-center bg-[#333333] text-white py-4 rounded-2xl font-black text-xs shadow-[4px_4px_0px_white] active:shadow-none active:translate-y-1 transition-all hover:bg-[#555555] uppercase tracking-widest"
            >
              SAY HI!
            </a>
          </div>
        </div>

        {/* Bottom Bar - Centered on Mobile */}
        <div className="bg-[#333333] rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between border-4 border-[#333333] gap-4">
          <p className="text-white font-black text-[10px] sm:text-sm uppercase tracking-widest text-center md:text-left">
            © 2026 DabbaNation • Made with{" "}
            <Heart className="inline w-4 h-4 fill-[#FF8C42] text-[#FF8C42] mx-1" />{" "}
            in Delhi
          </p>
          <div className="flex gap-6 sm:gap-8">
            <a
              href="#"
              className="text-gray-400 text-[10px] sm:text-xs font-bold hover:text-white uppercase tracking-tighter transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 text-[10px] sm:text-xs font-bold hover:text-white uppercase tracking-tighter transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
