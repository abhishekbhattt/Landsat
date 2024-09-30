import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-black shadow-md w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        {/* Left Section */}
        <div className="flex items-center gap-10">
          <Link to="/">
            <h1 className="font-bold text-1xl sm:text-6xl flex flex-wrap">
              <span className="text-[#4540d1] text-2xl sm:text-4xl">Land</span>
              <span className="text-[#b1352c] text-2xl sm:text-4xl">Sat</span>
            </h1>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div>
            <ul className="hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-0">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/support" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/TrackingDash" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  ISS tracking
                </Link>
              </li>
            </ul>
          </div>
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex justify-end items-center relative">
            <div
              className="w-[35px] h-[35px] rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                src={
                  !isOpen
                    ? "src/mediaContent/drop.png"
                    : "src/mediaContent/cross.png"
                }
                alt="menu"
                className="w-[30px] h-[30px] object-contain"
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <div
            className={`sm:hidden absolute top-[60px] right-2 left-2 rounded-[10px] bg-[#1c1c24] z-10 shadow-secondary py-4 ${
              !isOpen ? "-translate-y-[100vh]" : "translate-y-0"
            }  transition-all duration-700`}
          >
            <ul className="flex flex-col sm:flex-row gap-6 sm:gap-6 p-4 sm:p-0">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/support" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/Notification" // Use absolute path
                  className="text-slate-300 font-bold text-xl hover:underline"
                >
                  ISS Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Profile or Sign in */}
          <div className="flex items-center gap-6">
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full text-3xlh-13 w-16 border-2 border-white object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-slate-300 font-bold text-xl hover:underline">
                  Sign in
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
