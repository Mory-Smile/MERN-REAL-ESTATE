import RealEstateBg from "../assets/RealEstateBg.jpg";

const About = () => {
  return (
    <div
      className="py-5 px-5 mx-auto min-w-full h-[91.2vh]"
      style={{
        background: `url(${RealEstateBg}) center no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <h1 className="text-2xl sm:text-4xl font-bold py-10 text-slate-700 text-center">
        About Mora Real Estate
      </h1>
      <p className="pb-5 black text-xl sm:text-2xl">
        Mora Real Estate is a leading real estate agency that specializes in
        helping clients buy, sell, and rent properties in the most desirable
        neighborhoods. Our team of experienced agents is dedicated to providing
        exceptional service and making the buying and selling process as smooth
        as possible.
      </p>
      <p className="pb-5 black text-xl sm:text-2xl">
        Our mission is to help our clients achieve their real estate goals by
        providing expert advice, personalized service, and a deep understanding
        of the local market. Whether you are looking to buy, sell, or rent a
        propert, we are here to help you in every step of your way to find your
        perfect place.
      </p>
      <p className="pb-5 black text-xl sm:text-2xl">
        Our team of agents has a wealth of experience and knowledge in the real
        estate industry, and we are committed to providing the highest level of
        service to our clients. We believe that buying or selling or even
        renting should be an exciting and rewarding experience, and we are
        dedicated to making that a reality for each and every one of our
        clients.
      </p>
    </div>
  );
};

export default About;
