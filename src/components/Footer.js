import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img src={logo} alt="UAP Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-semibold">UAP</span>
            </div>
            <p className="text-gray-400 text-sm">
              Unified Access Platform - A secure and seamless Single Sign-On
              (SSO) solution for modern organizations.
            </p>
          </div>

          {/* Features */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Single Sign-On (SSO)</li>
              <li>Multi-Factor Authentication</li>
              <li>Role-Based Access Control</li>
              <li>Secure Token Management</li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Technologies</h3>
            <ul className="space-y-2 text-gray-400">
              <li>React.js</li>
              <li>Node.js</li>
              <li>MongoDB</li>
              <li>Express.js</li>
              <li>Redux</li>
              <li>TailwindCSS</li>
            </ul>
          </div>

          {/* Team */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Development Team</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Bhawani Shankar Sarswat (22JE0246)</li>
              <li>Ashish Singh (22JE0188)</li>
              <li>Ashish Singh (22JE0187)</li>
              <li>Ashok Mahala (22JE0190)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 UAP. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
              <a
                href="https://github.com/bssCoder/UAP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
