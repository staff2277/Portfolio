export default function Home() {
  return (
    <main className="min-h-[200vh] flex flex-col items-center pt-32 px-8">
      <h1 className="text-5xl font-bold mb-8">Home</h1>
      <p className="text-gray-400 max-w-xl text-center leading-relaxed">
        Scroll down to test the smart navbar hiding behavior.
        The layout is wrapped in a page transition provider ready for animation.
      </p>
    </main>
  );
}
