import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
      <span className="footer-powered">Powered by Upbound</span>
        </div>
        
        <div className="footer-links">
          <a 
            href="https://github.com/tr0njavolta/uppound-demo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            View Demo Source
          </a>
          <a 
            href="https://docs.upbound.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            Upbound Documentation
          </a>
        </div>
        
        <hr className="footer-divider" />
        
        <div className="footer-disclaimer">
          The pets in this demo are Upbounders and are not up for adoption.
        </div>
    </footer>
  );
};

export default Footer;
