"use client";

import { useRef, useState, useCallback } from "react";
import HeroCanvas from "../components/3d/HeroCanvas";
import HeroLoader from "../components/HeroLoader";
import WorkSection from "../components/WorkSection";

const CONTACT_EMAIL = "mustaff2277@gmail.com";

export default function Home() {
  // Lifted here (rather than inside HeroCanvas) because heroSectionRef is
  // the pin target the GSAP ScrollTrigger in useCameraScroll.js measures
  // and pins for the whole camera sequence.
  const heroSectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("idle"); // idle | sending | success | error
  const [contactError, setContactError] = useState("");

  const handleProgress = useCallback((val) => {
    setProgress((prev) => Math.max(prev, val));
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsLoaderFinished(true);
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browsers, insecure context) --
      // the mailto link right above this still works as the fallback.
    }
  }, []);

  const handleContactFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleContactSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setContactStatus("sending");
      setContactError("");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactForm),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong sending your message.");
        }
        setContactStatus("success");
        setContactForm({ name: "", email: "", message: "" });
      } catch (err) {
        setContactStatus("error");
        setContactError(err.message);
      }
    },
    [contactForm]
  );

  return (
    <>
      <HeroLoader
        progress={progress}
        isLoaded={isLoaded}
        onTransitionStart={handleTransitionStart}
      />
      <HeroCanvas
        heroSectionRef={heroSectionRef}
        onProgress={handleProgress}
        onLoaded={handleLoaded}
        isLoaderFinished={isLoaderFinished}
      />

      {/* relative z-10 here (rather than a negative z-index on the canvas)
          is what guarantees this content paints above the fixed 3D layer --
          see the comment in HeroCanvas.js for why. */}
      <div className="relative z-10 pointer-events-none">
        <section
          id="home"
          ref={heroSectionRef}
          className="relative h-screen w-full p-8 md:p-12 pointer-events-none flex flex-col justify-between"
        >
          {/* Top Left Corner */}
          <div id="hero-scene" className="flex flex-col items-start space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">
              Portfolio / 2026
            </span>
            <h1 className="text-lg md:text-xl font-heading tracking-tight text-white/90">
              Creative Developer
            </h1>
          </div>

          {/* Top Right Corner */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 text-right">
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 block">
              Specialization
            </span>
            <span className="text-xs md:text-sm text-white/80 font-light">
              Frontend, UI &amp; 3D design
            </span>
          </div>

          {/* Bottom Left & Bottom Right flex layout container */}
          <div className="flex justify-between items-end w-full">
            {/* Bottom Left Corner - Connect & Socials */}
            <div className="flex flex-col space-y-3 pointer-events-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                Connect
              </span>
              <div className="flex items-center gap-3">
                {/* Contact Mail Icon */}
                <a
                  href="/contact"
                  title="Contact"
                  data-magnetic
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
                {/* X (formerly Twitter) Icon */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  data-magnetic
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn Icon */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  data-magnetic
                  className="p-2.5 border border-white/20 hover:border-white/60 bg-black/40 backdrop-blur-md transition-all text-white/80 hover:text-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom Right Corner */}
            <div className="text-right flex flex-col items-end space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                Scroll
              </span>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                <span>Explore Scene</span>
                <span className="animate-bounce">↓</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll distance for the camera sequence (frames 0 -> 110) is
            reserved automatically by ScrollTrigger's own pinSpacing (see
            useCameraScroll.js, SCROLL_DISTANCE = 4900vh). No manual spacer
            needed — one would create a dead scroll zone after the hero. */}

        <WorkSection />

        <section
          id="contact"
          className="relative min-h-screen flex flex-col items-center justify-center px-8 py-32 bg-zinc-950 pointer-events-auto border-t border-white/10 overflow-hidden"
        >
          {/* Ambient glow behind the mailbox -- echoes the hero's spotlit
              sphere without competing with it; pointer-events-none so it
              never blocks the mailto link/copy button beneath it. */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Contact
            </span>

            <h2 className="font-heading gradient-text text-4xl md:text-6xl leading-tight mb-6">
              Got a project
              <br />
              worth building?
            </h2>

            <p className="text-white/50 max-w-md leading-relaxed mb-12">
              Open to freelance work, collaborations, and interesting
              problems. Reach out directly -- every email lands with me, no
              contact form in between.
            </p>

            {/* The contact form -- posts to /api/contact, which proxies to
                Web3Forms so the access key stays server-side. The envelope
                icon on the submit button keeps the "mailbox" motif: the flap
                lifts and a little letter slides up from behind it on hover,
                same idea as the old mailto pill, just now attached to an
                actual send action instead of opening a mail client. */}
            <form
              onSubmit={handleContactSubmit}
              className="w-full glass rounded-2xl p-6 md:p-8 flex flex-col gap-5 text-left"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-white/40">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={handleContactFieldChange}
                  placeholder="Your name"
                  className="bg-white/5 border border-white/10 focus:border-white/30 rounded-lg px-4 py-2.5 text-white/90 placeholder:text-white/25 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-white/40">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={handleContactFieldChange}
                  placeholder="you@example.com"
                  className="bg-white/5 border border-white/10 focus:border-white/30 rounded-lg px-4 py-2.5 text-white/90 placeholder:text-white/25 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-white/40">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={handleContactFieldChange}
                  placeholder="What are you building?"
                  className="bg-white/5 border border-white/10 focus:border-white/30 rounded-lg px-4 py-2.5 text-white/90 placeholder:text-white/25 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus === "sending"}
                data-magnetic
                data-magnetic-max="10"
                className="group mt-1 self-center flex items-center gap-3 px-7 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 transition-all text-sm uppercase tracking-widest text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative w-6 h-6 shrink-0">
                  {/* Letter -- slides up from behind the envelope on hover */}
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute inset-0 w-full h-full text-white/60 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:-translate-y-1.5 transition-all duration-300 ease-out"
                  >
                    <rect
                      x="6"
                      y="1.5"
                      width="12"
                      height="9"
                      rx="1"
                      fill="currentColor"
                      fillOpacity="0.25"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                  {/* Envelope body */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="absolute inset-0 w-full h-full text-white/80"
                  >
                    <rect x="2" y="6" width="20" height="14" rx="2" />
                  </svg>
                  {/* Flap -- lifts open on hover */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="absolute inset-0 w-full h-full text-white/80 origin-top group-hover:-translate-y-1 transition-transform duration-300 ease-out"
                  >
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </span>
                {contactStatus === "sending" ? "Sending" : "Send message"}
              </button>

              <div aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
                {contactStatus === "success" && (
                  <p className="text-emerald-400/90">
                    Message sent -- thanks, I&apos;ll get back to you soon.
                  </p>
                )}
                {contactStatus === "error" && (
                  <p className="text-red-400/90">{contactError}</p>
                )}
              </div>
            </form>

            <div className="flex items-center gap-2 mt-6 text-xs text-white/40 pointer-events-auto">
              <span>Prefer email directly?</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                {emailCopied ? "Copied" : CONTACT_EMAIL}
              </button>
            </div>

            <div className="flex items-center gap-5 mt-4 pointer-events-auto">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                X
              </a>
              <span className="text-white/15">&middot;</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
