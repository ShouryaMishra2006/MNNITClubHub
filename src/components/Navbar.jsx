import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("./LoginUser");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <h1 className="text-2xl font-extrabold tracking-wider cursor-pointer hover:text-blue-200 transition-all">
          MNNITClubHub
        </h1>

        {/* Login Button */}
        <div className="relative">
          <button
            className="bg-white text-blue-900 px-5 py-2 font-semibold rounded-lg shadow-md hover:bg-blue-200 hover:shadow-lg focus:ring-4 focus:ring-yellow-300 transition-all transform hover:scale-105"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
