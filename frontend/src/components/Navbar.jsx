import React, { useEffect, useRef } from 'react';
import { Building2, User, LogOut, Home, Info, PlusCircle, Briefcase, Sparkles } from 'lucide-react';
import gsap from 'gsap';

function Navbar({ isLoggedIn, userName, userRole, setCurrentPage, onLogout }) {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef([]);
  const authButtonsRef = useRef([]);

  useEffect(() => {
    // GSAP Animation for Navbar on mount
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.2)"
      }
    );

    // Animate logo
    gsap.fromTo(logoRef.current,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "elastic.out(1, 0.5)"
      }
    );

    // Animate nav links with stagger
    gsap.fromTo(navLinksRef.current,
      { opacity: 0, y: -20, rotationX: -90 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.2,
        ease: "back.out(1)"
      }
    );

    // Animate auth buttons
    gsap.fromTo(authButtonsRef.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.5,
        ease: "back.out(1.2)"
      }
    );

    // Continuous floating animation for logo icon
    gsap.to(".logo-icon", {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Add hover animations to nav buttons
    navLinksRef.current.forEach((link, index) => {
      if (link) {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            scale: 1.1,
            color: "#d4af37",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            scale: 1,
            color: index === 0 ? "#d4af37" : "rgba(255, 255, 255, 0.9)",
            duration: 0.3,
            ease: "power2.in"
          });
        });
      }
    });
  }, []);

  return (
    <nav 
      ref={navRef}
      className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex justify-between items-center shadow-2xl overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatNav ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div 
        ref={logoRef}
        className="flex items-center space-x-3 cursor-pointer group relative z-10"
        onClick={() => setCurrentPage('home')}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          <div className="logo-icon relative bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg transform group-hover:scale-105 transition-all duration-300 shadow-lg">
            <Building2 className="text-gray-900 w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-amber-400 to-white bg-clip-text text-transparent">
            BLR Estate
          </h1>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            by A1 Builders
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6 z-10">
        <button 
          ref={el => navLinksRef.current[0] = el}
          onClick={() => setCurrentPage('home')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium relative group"
        >
          <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button 
          ref={el => navLinksRef.current[1] = el}
          onClick={() => setCurrentPage('portfolio')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium relative group"
        >
          <Briefcase className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          Portfolio
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button 
          ref={el => navLinksRef.current[2] = el}
          onClick={() => setCurrentPage('about')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium relative group"
        >
          <Info className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
        </button>
        {userRole === 'owner' && (
          <button 
            ref={el => navLinksRef.current[3] = el}
            onClick={() => setCurrentPage('sell')}
            className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium relative group"
          >
            <PlusCircle className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            Sell Property
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 z-10">
        {!isLoggedIn ? (
          <button
            ref={el => authButtonsRef.current[0] = el}
            onClick={() => setCurrentPage('login')}
            className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="relative z-10">Login / Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div 
              ref={el => authButtonsRef.current[0] = el}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                  <User className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Hello, {userName}
              </span>
            </div>
            <button
              ref={el => authButtonsRef.current[1] = el}
              onClick={onLogout}
              className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 rounded-lg text-sm hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <LogOut className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
              Logout
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes floatNav {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
