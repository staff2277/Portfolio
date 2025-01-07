const services = [
  {
    icon: "/images/search.svg",
    title: "Website Review",
    description:
      "I make sure your website is performing its best by thoroughly reviewing it before making any changes.",
  },
  {
    icon: "/images/business.svg",
    title: "Business Strategy",
    description:
      "We discuss what you are trying to achieve, and place goals on your website planning how to achieve that.",
  },
  {
    icon: "/images/ux.svg",
    title: "User Experience Design",
    description:
      "I design your website to be as easy to use as possible while guiding users towards the end goal.",
  },
  {
    icon: "/images/page.svg",
    title: "Tailored Development",
    description:
      "I build with your goals in mind, whether you want a simple flexible website, a custom storefront or a SaaS product.",
  },
  {
    icon: "/images/testing.svg",
    title: "Rigorous Testing",
    description:
      "I ensure your website is of excellent quality by thoroughly testing using multiple approaches.",
  },
  {
    icon: "/images/support.svg",
    title: "Ongoing Support",
    description:
      "Your website is always growing. Whether you’re adding new features or making improvements I’m here to help.",
  },
];

const Need = () => {
  return (
    <div className="py-[10rem] px-10 dee-only:px-2 border-2  grid xl:grid-cols-[repeat(auto-fit,minmax(500px,1fr))]  grid-rows-2 gap-4 max-xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] bg-[#070707] text-white">
      {services.map((service, index) => (
        <div
          key={index}
          className="border-2 border-[#1F1F1F] rounded-lg p-[30px]"
        >
          <div className="flex items-center gap-5">
            <span>
              <img
                className="w-[50px]"
                src={service.icon}
                alt={service.title.toLowerCase()}
              />
            </span>
            <span className="font-extrabold text-[1.2rem]">
              {service.title}
            </span>
          </div>
          <p className="my-5 text-[#999999] sm:text-[1rem] max-5s:text-[0.8rem]">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Need;
