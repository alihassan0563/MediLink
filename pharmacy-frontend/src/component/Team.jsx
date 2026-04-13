import React from "react";
import { Link } from "react-router-dom";
const team = [
  {
    name: "Arman Ejaz",
    role: "Backend & Database Developer",
    img: "/Arman.jpg",
  },
  { name: "Ali Hassan", role: "Frontend Developer", img: "/ali.jpg" },
  {
    name: "Sikandar Aftab",
    role: "Market Research & Analyst",
    img: "/sikander.jpeg",
  },
];

const Team = () => {
  return (
    <section className="about-team-section">
      <div className="about-team-container">
        <div className="about-team-left">
          <h2 className="about-section-title">
            Meet the Minds, <span className="highlight"> Behind Our </span>{" "}
            Innovation:
          </h2>
          <p className="about-section-desc">
            Our team of skilled and <b>dedicated professionals</b> works hard to
            give our users the best experience possible. We use the latest
            technology and smart practices to design and improve every part of
            our platform so it runs smoothly, stays secure, and is easy to use.
            From building strong systems and simple designs to offering quick
            customer support and regular updates, we make sure everything meets
            the needs of our users. Our goal is to provide a reliable,
            innovative, and high-quality platform that goes beyond expectations.
          </p>
          <div className="about-team-buttons">
            {/* <Link to="/" className="about-btn primary">Get Started</Link> */}
            <Link to="/contact" className="about-btn secondary">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="about-team-right">
          <div className="team-list">
            {team.map((member, i) => (
              <div key={i} className="team-member-item">
                <div className="team-member-avatar">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">{member.name}</div>
                  <div className="team-member-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
