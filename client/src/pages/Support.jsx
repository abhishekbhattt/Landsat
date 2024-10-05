import React, { useState, useRef } from "react";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";

export default function Support() {
  const form = useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Capture the form data
    const userName = e.target.username.value;
    const userEmail = e.target.email.value;
    const userDescription = e.target.description.value;

    // Email parameters matching the variables in your EmailJS template
    const emailParams = {
      senderMail: userEmail, // Ensure this matches the variable in your template
      senderName: userName, // Ensure this matches the variable in your template
      description: userDescription, // Ensure this matches the variable in your template
    };

    // Send email using emailjs
    emailjs
      .send(
        "service_c8lh2rr", // Your EmailJS service ID
        "template_p8wz8c91", // Your EmailJS template ID
        emailParams,
        "FpX8Y6jNqEdBKMQAH" // Your EmailJS public key
      )
      .then(
        (result) => {
          console.log(result.text);
          setAlertMessage(
            "Form submitted successfully. We will reach out to you as soon as possible."
          );
          setAlertColor("bg-green-600");
          setTimeout(() => {
            setAlertMessage("");
            setAlertColor("");
          }, 5000); // Set alert to green color
        },
        (error) => {
          console.log(error.text);
          setAlertMessage("Something went wrong, please try again.");
          setAlertColor("bg-red-500"); // Set alert to red color for error
        }
      );

    // Reset the form after submission
    e.target.reset();
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-9">
      {/* Hero Image with About Us Text */}
      <section
        className="relative w-full h-[30vh] md:h-[35vh] lg:h-[50vh] flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('src/mediaContent/support.jpg')", // Update this path if necessary
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-white text-4xl md:text-5xl lg:text-6xl font-bold z-12">
          Support
        </h1>
      </section>

      {/* Support Information Section */}
      <section className="relative py-16 px-6 text-center">
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 mb-6">
              We are here to help you with any questions or issues you might
              have. Our platform offers various features to enhance your
              experience with Landsat data tracking. Below you'll find detailed
              information on how to use the platform and get the most out of it.
            </p>
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <p className="text-lg font-semibold">
                For Accessing Landsat Tracking And Notification Feature, you
                have to create an account. You can sign up with Google or with
                your other email ID. After that, you will see a green button on
                the profile page to access this feature. This is free of cost.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
              src="src/mediaContent/support2.png"
              alt="Signup Information"
              className="w-full h-auto max-w-lg md:max-w-xl lg:max-w-2xl mx-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Support Form Section */}
      <section className="py-16 px-6">
        <div
          className="container mx-auto bg-white text-gray-800 p-8 rounded-lg shadow-lg"
          style={{ maxWidth: "80%" }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Need Help ?
          </h2>

          {/* Alert message */}
          {alertMessage && (
            <div
              className={`p-4 my-10 rounded-lg transition duration-3000 text-white text-center ${alertColor}`}
            >
              {alertMessage}
            </div>
          )}

          <form
            ref={form}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-lg font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="p-3 rounded-lg border border-gray-300 bg-gray-200 text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-medium">
                Your Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="p-3 rounded-lg border border-gray-300 bg-gray-200 text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-lg font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                maxLength="5000"
                required
                className="p-3 rounded-lg border border-gray-300 bg-gray-200 text-gray-800"
              ></textarea>
            </div>
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="bg-green-800 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Submit
              </button>
              <button
                type="reset"
                className="bg-red-700 hover:bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
