const Passion = () => {
  return (
    <div className="h-[100vh] overflow-hidden">
      <div className="grid grid-cols-[30%_auto] items-center justify-between text-[#e7dfc6]">
        <div className=" border-2 ml-[2rem]">
          <div className="">
            <h1 className="3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
              Design
            </h1>
            <p className="w-full border-2 text-[#919191]">
              I might not be the designer obsessing over pixels in Illustrator,
              but I design with purpose. You’ll usually find me buried in
              stylesheets, refining font sizes, and experimenting with layouts.
              My passion lies in delivering smooth, intuitive user
              experiences—always with a touch of style. (~_^)
            </p>
          </div>
          <div className="mt-[5rem]">
            <h1 className="3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
              Engineering
            </h1>
            <p className="w-full border-2 text-[#919191]">
              In building JavaScript applications, I'm equipped with just the
              right tools, and can absolutely function independently of them to
              deliver fast, resilient solutions optimized for scale —
              performance and scalabilty are priorities on my radar.
            </p>
          </div>
        </div>
        <div className="">
          <img className="sticky top-0" src="/images/ai15.jpg" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default Passion;
