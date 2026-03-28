import React from "react";

function Logo() {
  return (
    <>
      <svg
        viewBox="0 0 200 120"
        xmlns="http://www.w3.org/2000/svg"
        className="logo"
      >
        <rect width="100%" height="100%" fill="white" />

        <polygon points="40,90 100,20 160,90" fill="black" />

        <polygon points="85,60 100,40 115,60" fill="white" />

        <line x1="40" y1="90" x2="160" y2="90" stroke="black" strokeWidth="2" />
      </svg>
    </>
  );
}

export default Logo;
