import './globals.css';
import SmoothScroll from '../components/SmoothScroll';
import SideProgressBar from '../components/SideProgressBar';
import MagneticButtons from '../components/MagneticButtons';

export const metadata = {
  title: 'Portfolio | Creative Developer',
  description: 'A premium creative portfolio built with Next.js, Three.js, and GSAP.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning here only ignores mismatches on this exact
          element (e.g. data-gr-ext-installed / data-new-gr-c-s-check-loaded,
          which browser extensions like Grammarly inject into <body> before
          React hydrates) -- it does not suppress hydration warnings anywhere
          else in the tree. */}
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        <SmoothScroll>
          <SideProgressBar />
          {children}
        </SmoothScroll>
        {/* Global, reusable magnetic-hover interaction -- see
            components/MagneticButtons.js. Tag any button/link anywhere in
            the tree with `data-magnetic` to opt it in; nothing else needs
            to change. Mounted once here (site-wide), not per-page. */}
        <MagneticButtons />
      </body>
    </html>
  );
}
