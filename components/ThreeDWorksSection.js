"use client";

/* ------------------------------------------------------------------ */
/*  ThreeDWorksSection                                                 */
/*                                                                      */
/*  Placeholder section for an upcoming "3D Works" gallery, sitting     */
/*  directly under the main Work section. Deliberately lightweight --   */
/*  no scroll-pin, no per-project data, no GSAP/Framer wiring -- since   */
/*  there's no real content yet, just a clear "this is coming" marker   */
/*  in the same visual language as the rest of the site (glass card,    */
/*  gradient-text heading, accent glow). Swap this out for a real       */
/*  gallery (likely mirroring WorkSection's structure) once there's     */
/*  actual 3D work to show.                                             */
/* ------------------------------------------------------------------ */
export default function ThreeDWorksSection() {
  return (
    <section
      id="3d-works"
      className="relative w-full min-h-[100vh] flex items-center justify-center px-8 py-28 bg-black overflow-hidden pointer-events-auto border-t border-white/[0.06]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[var(--accent)]/[0.06] blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
          3D Experiences
        </span>

        <h2 className="font-heading gradient-text text-4xl md:text-6xl leading-[1.05] mb-8">
          3D Works
        </h2>

        <div className="glass inline-flex items-center gap-3 px-5 py-2.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-white/70">
            Build in progress
          </span>
        </div>

        <p className="text-white/50 max-w-md leading-relaxed">
          A gallery of real-time 3D pieces is on its way. Check back soon.
        </p>
      </div>
    </section>
  );
}
