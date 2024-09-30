import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6 md:space-x-10">
        {/* Contact Information */}
        <div className="mb-6 md:mb-0 md:pr-10">
          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-sm mb-2">
            Phone:{" "}
            <a href="tel:+918791622785" className="hover:underline">
              +918791622782
            </a>
          </p>
          <p className="text-sm mb-2">
            Email:{" "}
            <a href="mailto:ab9974085@gmail.com" className="hover:underline">
              ab9974085@example.com
            </a>
          </p>
          <p className="text-sm">
            Address:Near ISBT ,Lane 2 , block 3 , Dehradun , Uttarakhand
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="mb-6 md:mb-0 md:pr-10">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/abhishek-bhatt-537781232?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Copyright Information */}
        <div className="text-sm text-center md:text-left md:pt-4">
          <p>
            &copy; {new Date().getFullYear()} Instant Landsat Insights. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
