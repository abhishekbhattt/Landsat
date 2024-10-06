import { Link } from "react-router-dom";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="src\mediaContent\homeVideo.mp4"
          autoPlay
          loop
          muted
        ></video>
        <div className="absolute inset-0 flex items-center justify-start bg-black bg-opacity-50">
          <div className="flex flex-col items-start gap-6 p-6 pl-16 w-full text-left">
            <h1 className="text-white font-bold text-6xl md:text-6xl lg:text-7xl">
              Instant Landsat
              <br />
              <span className="text-red-500">Insights</span>
            </h1>
            <div className="text-gray-300 text-lg md:text-xl lg:text-2xl">
              Harness Satellite Technology: Real-Time Landsat Data, Tracking,
              and Instant Location Alerts.
              <br />
              All in One Dynamic Platform
            </div>
            <Link
              to={"/LandSat"}
              className="text-lg md:text-xl text-blue-400 font-bold hover:underline"
            >
              Let's get started...
            </Link>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className="bg-white py-16 h-auto w-full">
        <div className="relative h-auto w-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
            <img
              src="src\mediaContent\nightview.jpg"
              alt="Sample 2"
              className="object-contain w-full h-auto max-w-[80%] rounded-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Explore New Horizons
              </h2>
              <p className="text-gray-600 text-lg">
                Discover the unexplored with our advanced satellite tracking
                technology. Our platform offers detailed insights and real-time
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-black text-white py-16 h-auto w-full">
        <div className="relative h-auto w-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-800 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Advanced Analytics
              </h2>
              <p className="text-gray-300 text-lg">
                Our platform provides in-depth analysis and detailed reporting
                to help you make informed decisions based on satellite data.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
            <img
              src="src\mediaContent\satellite.png"
              alt="Sample 2"
              className="object-cover w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-white py-16 h-auto w-full">
        <div className="relative h-auto w-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
            <img
              src="src\mediaContent\earth2.jpg"
              alt="Sample 3"
              className="object-contain w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Seamless Integration
              </h2>
              <p className="text-gray-600 text-lg">
                Integrate our satellite data into your existing systems with
                ease. Our platform supports various integrations for your
                convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-black text-white py-16 h-auto w-full">
        <div className="relative h-auto w-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-800 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Collaborate and Achieve
              </h2>
              <p className="text-gray-300 text-lg">
                Work together with like-minded individuals and achieve great
                things through collaboration.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
            <img
              src="src\mediaContent\astro.jpg"
              alt="Sample 4"
              className="object-cover w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-16 h-auto w-full">
        <div className="relative h-auto w-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
            <img
              src="src\mediaContent\earth1.png"
              alt="Sample 3"
              className="object-contain w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Real Time Notification
              </h2>
              <p className="text-gray-600 text-lg">
                Stay up-to-date with real-time alerts on Landsat satellite
                movements and data collection events. Our system ensures you are
                always informed when your selected satellite passes over the
                chosen location.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
