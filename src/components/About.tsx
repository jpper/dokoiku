import React from "react";
import { Typography } from "@material-ui/core";
import "../styles/About.css";
import "typeface-roboto";
import iconImgWhite from "../img/logo-dokoiku-white.png";

function About() {
  return (
    <div className="about">
      <Typography variant="h1">
        <b>Dokoiku</b>
      </Typography>
      <h1>The app for people to connect and share trips</h1>
      {/* <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h4>Header 4</h4>
      <h5>Header 5</h5>
      <h6>Header 6</h6> */}
      <div className="get-started">
        <h2>Get Started</h2>
        <h3>Search Trips:</h3>
        <p>
          Browse trips that other users have created. When you find a trip you
          like, hit the "JOIN" button to request to join!
        </p>
        <h3>Build Trip:</h3>
        <p>
          Create a trip of your own! Input information including destinations,
          dates, and budget. Other users will be able to request to join.
        </p>
        <h3>Upcoming Trips:</h3>
        <p>
          Plan the trips you are a member of! Use the Notes and Messages
          features to coordinate with members of your trip.
        </p>
        <h3>Profile:</h3>
        <p>
          Customize your profile! You can also include links to your social
          media accounts!
        </p>
      </div>

      {/* <Typography variant="h5">
        Dokoiku is an app for people who want to connect and share a trip
        together.
      </Typography> */}
      <div className="about-dokoiku">
        <h2>About Dokoiku</h2>
        <p>
          Dokoiku is a full-stack, single-page app that was created as a senior
          project during the Immersive Bootcamp at Code Chrysalis.
        </p>

        <ul>
          The Dokoiku Team:
          <a href="https://github.com/followdiallo">
            <li>Diallo Spears</li>
          </a>
          <a href="https://github.com/Imamachi-n">
            <li>Naoto Imamachi</li>
          </a>
          <a href="https://github.com/nlandon2">
            <li>Nate Landon</li>
          </a>
          <a href="https://github.com/baruishi">
            <li>Waldemar Ishibashi</li>
          </a>
          <a href="https://github.com/Ziyu-Chen">
            <li>Ziyu Chen</li>
          </a>
        </ul>
      </div>

      {/* <ul>
        Technology used:
        <li>Google Cloud Platform (Google App Engine, Cloud Build)</li>
        <li>Firebase Authentication</li>
        <li>Firebase Cloud FireStore</li>
        <li>Firebase RealTime Database</li>
        <li>React</li>
        <li>Redux</li>
        <li>Typescript</li>
        <li>Material UI</li>
        <a href="https://github.com/cc10-team-gryffindor">
          <li>GitHub</li>
        </a>
      </ul> */}

      <div className="iconImg-container">
        <img
          src={iconImgWhite}
          className="iconImg-about"
          alt="Dokoiku logo"
        ></img>
      </div>
    </div>
  );
}

export default About;
