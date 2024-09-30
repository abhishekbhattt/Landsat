import React from "react";
import Footer from "../components/Footer";

const teamMembers = [
  {
    name: "Abhishek Bhatt",
    role: "B.Tech CSE Student",
    linkedin: "https://www.linkedin.com/in/abhishek-bhatt-537781232",
    photo: "../mediaContent/alice.jpg",
  },
  {
    name: "Daksh Bamola",
    role: "B.Tech CSE Student",
    linkedin: "https://www.linkedin.com/in/daksh-bamola-537027290",
    photo: "../mediaContent/bob.jpg",
  },
  {
    name: "Saurabh Painuly",
    role: "B.Tech CSE Student",
    linkedin: "https://www.linkedin.com/in/saurabh-painuly-012381256",
    photo: "../mediaContent/charlie.jpg",
  },
  {
    name: "Aanchal Agarwal",
    role: "B.Tech CSE Student",
    linkedin: "https://www.linkedin.com/in/danawhite",
    photo: "../mediaContent/dana.jpg",
  },
];

export default function About() {
  return (
    <div>
      {/* Hero Image with About Us Text */}
      <section
        className="relative w-full h-[30vh] md:h-[35vh] lg:h-[51vh] flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('src/mediaContent/about.jpg')", // Make sure to update this path
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
        {/* Overlay for better text visibility */}
        <h1 className="relative text-white text-4xl md:text-5xl lg:text-6xl font-bold z-12">
          About Us
        </h1>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16 w-full">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Welcome to Instant Landsat Insights! Our web app harnesses the power
            of satellite technology to provide real-time Landsat data, tracking,
            and location alerts. Our platform is designed to offer detailed
            insights and seamless integration into your existing systems. With
            our advanced analytics and user-friendly interface, we aim to
            revolutionize the way you interact with satellite data.
          </p>
        </div>
      </section>

      {/* Team Cards Section */}
      <section className="bg-white py-16 w-full">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Connect with me
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
