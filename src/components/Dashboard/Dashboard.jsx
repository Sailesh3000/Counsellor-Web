import  { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.webp";
import { signOut} from "firebase/auth";
import { auth } from "../../firebase/auth";
import Footer from "../Footer/Footer";
import collegesData from "./colleges.json";
import ScrollToTop from "react-scroll-to-top";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FAQS from "../FAQs/FAQS";

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(collegesData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [fix, setFix] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        toast.success("Logged in! 🚀",{
          className: "toast-message",
        });
      } else if (!user) {
        toast.success("Logged out!",{
          className: "toast-message",
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    });
  }, [navigate]);

  useEffect(() => {
    const results = collegesData.filter(
      (college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(results);
  }, [searchTerm]);

  const handleSignOut = useCallback(() => {
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        toast.error(err.message,{
          className: "toast-message",
        });
      });
  }, [navigate]);

  const handleCollegeClick = useCallback(
    (college) => {
      navigate(`/college/${college.id}`);
    },
    [navigate]
  );

  const toggleMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTouchStart = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // Function for appearance of background for nav menu
  function setFixed() {
    if (window.scrollY > 0) {
      setFix(true);
    } else {
      setFix(false);
    }
  }

  window.addEventListener("scroll", setFixed);

  // Function to sort colleges by CTC
  const sortCollegesByCTC = (colleges) => {
    return colleges.sort((a, b) => {
      const ctcA = parseInt(a.ctc.replace(/\D/g, ""));
      const ctcB = parseInt(b.ctc.replace(/\D/g, ""));
      return ctcB - ctcA;
    });
  };

  // Apply sorting to filtered colleges
  const sortedColleges = sortCollegesByCTC(filteredColleges);

  const createHandleCollegeClick = (college) => () => {
    handleCollegeClick(college);
  };

  const createHandleTouchStart = (index) => () => {
    handleTouchStart(index);
  };

  return (
    <main>
      <div className="scroll">
        <ScrollToTop
          smooth
          viewBox="0 0 24 24"
          svgPath="M16 13a1 1 0 0 1-.707-.293L12 9.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4A1 1 0 0 1 16 13z M16 17a1 1 0 0 1-.707-.293L12 13.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4A1 1 0 0 1 16 17z"
          color="white"
          style={{ backgroundColor: "#5CB6F9" }}
        />
      </div>
      <nav className={`navbar ${fix ? 'fixed' : ''}`}>
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className={`menu ${menuOpen ? "show" : ""}`}>
          <ul>
            <li>
              <a href="#">Top Universities</a>
            </li>
            <li>
              <a href="#">Jobs</a>
            </li>
            <li>
              <a href="#">Courses</a>
            </li>
            <li>
              <a href="#">Career Support</a>
            </li>
            <li className="dot">
              <a href="#"/>
            </li>
            <li>
              <a href="#" onClick={handleSignOut}>
                Log Out
              </a>
            </li>
            <li>
              <Link to="/profile">
                <button className="profile_btn">Profile</button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? 'open' : ''}`}/>
          <div className={`bar ${menuOpen ? 'open' : ''}`}/>
          <div className={`bar ${menuOpen ? 'open' : ''}`}/>
        </div>
      </nav>
      <div className="maintxt">
        <ToastContainer/>
        <h1>
          <span className="blue">Find your </span>Dream
          <br />
          College <span className="blue">here!</span>
        </h1>
        <p>For the Students, By the Students</p>
      </div>
      <div className="search">
        <div className="s_bar_c">
          <a href="">
            <img src="src/assets/icons8-search-50.png" alt="Search" />
          </a>
          <div className="vl"/>
          <input type="text" placeholder='Type college name or university name'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button>Search</button>
      </div>
      <div className="navigator">
        <span className="nearby">Nearby</span>
        <span className="seeall">See All</span>
      </div>
      <div className="colleges">
        {sortedColleges.map((college, index) => (
          <div
            className={`college ${activeIndex === index ? 'active' : ''}`}
            key={college.id}
            onClick={createHandleCollegeClick(college)}
            onTouchStart={createHandleTouchStart(index)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="college-content">
              <div className="up">
                <img className="college-image" src={college.imageURL} alt="College Logo" />
                <div className="context">
                  <p className="college_name">{college.name}</p>
                  <span className="college-location">{college.location}</span>
                </div>
              </div>
              <div className="down">
                <div className="ctc">{college.ctc}</div>
                <div className="time">{college.time}</div>
              </div>
            </div>
            <button className="click-info-button">Click for more info</button>
          </div>
        ))}
      </div>
      <FAQS/>
      <Footer />
    </main>
  );
};

export default Dashboard;
