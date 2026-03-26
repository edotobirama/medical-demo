"use client";

import Link from "next/link";
import { Activity, ArrowRight, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { theme } = useTheme();

    // Define which themes have dark backgrounds (requiring white text)
    const darkHeroThemes = ['modern', 'cyberpunk'];
    const isDarkHero = darkHeroThemes.includes(theme);

    // Text color logic:  
    // If transparent & not scrolled -> White (if Dark Hero) OR Dark (if Light Hero)
    // Otherwise -> Foreground/Muted
    const isTransparentState = transparent && !scrolled;

    const getTransparentTextColor = () => isDarkHero ? "text-white" : "text-slate-900";
    const getTransparentBrandColor = () => isDarkHero ? "text-white" : "text-primary";

    const textColorClass = isTransparentState
        ? getTransparentTextColor()
        : "text-muted-foreground hover:text-foreground";

    const brandColorClass = isTransparentState
        ? getTransparentBrandColor()
        : "text-foreground";

    // Sub-brand / tagline
    const brandSubColorClass = isTransparentState
        ? (isDarkHero ? "text-emerald-100" : "text-slate-500")
        : "text-muted-foreground";

    return (
        <nav
            className={clsx(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                scrolled || !transparent
                    ? "bg-background/80 backdrop-blur-xl border-b border-border py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container flex items-center justify-between px-6">

                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                        <Activity size={20} strokeWidth={3} />
                    </div>
                    <div>
                        <span className={clsx("text-xl font-bold tracking-tight leading-none block font-heading", brandColorClass)}>
                            Grandview<span className="text-primary">Medical</span>
                        </span>
                        <span className={clsx("text-[10px] font-bold uppercase tracking-widest leading-none", brandSubColorClass)}>
                            Center of Excellence
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className={clsx("hidden lg:flex items-center gap-8 font-medium text-sm", textColorClass)}>
                    <Link href="/doctors" className="hover:opacity-75 transition">Doctors</Link>
                    <Link href="/services" className="hover:opacity-75 transition">Services</Link>
                    <Link href="/about" className="hover:opacity-75 transition">About Us</Link>
                    <Link href="/contact" className="hover:opacity-75 transition">Contact</Link>
                </div>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {isLoading ? (
                        <div className="w-20 h-8 animate-pulse bg-muted rounded-full" />
                    ) : session ? (
                        <>
                            <Link href={session.user.role === 'DOCTOR' ? '/doctor' : '/patient'}
                                className={clsx("text-sm font-semibold flex items-center gap-2", textColorClass)}>
                                <User size={16} />
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-sm font-semibold text-destructive hover:text-destructive/80 flex items-center gap-2 ml-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={clsx("text-sm font-semibold", textColorClass)}>
                            Login
                        </Link>
                    )}
                    {(!isLoading && (!session || (session.user as any)?.role === 'PATIENT')) && (
                        <Link href="/book" className="h-10 px-6 text-sm rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20 flex items-center justify-center font-bold transition-all">
                            Book Appointment
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className={clsx("lg:hidden p-2 rounded-lg transition-colors", isTransparentState ? (isDarkHero ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-100") : "text-foreground hover:bg-accent")} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-background border-b border-border p-6 shadow-xl lg:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
                    <Link href="/doctors" className="text-lg font-semibold text-foreground p-2 hover:bg-accent rounded-lg" onClick={() => setIsOpen(false)}>Doctors</Link>
                    <Link href="/services" className="text-lg font-semibold text-foreground p-2 hover:bg-accent rounded-lg" onClick={() => setIsOpen(false)}>Services</Link>
                    <Link href="/about" className="text-lg font-semibold text-foreground p-2 hover:bg-accent rounded-lg" onClick={() => setIsOpen(false)}>About Us</Link>
                    <Link href="/contact" className="text-lg font-semibold text-foreground p-2 hover:bg-accent rounded-lg" onClick={() => setIsOpen(false)}>Contact</Link>

                    <div className="border-t border-border my-2"></div>

                    {isLoading ? (
                        <div className="w-full h-12 animate-pulse bg-muted rounded-lg" />
                    ) : session ? (
                        <>
                            <Link href={session.user.role === 'DOCTOR' ? '/doctor' : '/patient'}
                                className="flex items-center justify-center w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-bold" onClick={() => setIsOpen(false)}>
                                Dashboard
                            </Link>
                            <button
                                onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                                className="flex items-center justify-center w-full py-3 text-destructive border-destructive/20 bg-destructive/10 hover:bg-destructive/20 rounded-lg font-bold"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="flex items-center justify-center w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-bold" onClick={() => setIsOpen(false)}>Login</Link>
                    )}
                    {(!isLoading && (!session || (session.user as any)?.role === 'PATIENT')) && (
                        <Link href="/book" className="flex items-center justify-center w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-lg font-bold" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
