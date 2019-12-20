import React from "react";
import { Typography } from "@material-ui/core";
import "../styles/About.css";
import "typeface-roboto";
import iconImgWhite from "../img/logo-dokoiku-white.png";

class About extends React.Component<{}, {}> {
  render() {
    return (
      <div className="about">
        <Typography variant="h1">
          Welcome to <b>Dokoiku</b>
        </Typography>

        <div className="spacer10"></div>

        <Typography variant="h5">
          Dokoiku is an app for people who want to connect and share a trip
          together.
        </Typography>

        <div className="spacer50"></div>

        <Typography variant="h6">
          It is a full-stack, single-page app that was created as a senior
          project during the Immersive Bootcamp at Code Chrysalis. <br></br> It
          was created by five people in about ten full days of work.
        </Typography>

        <ul>
          Team:
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
        <ul>
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
        </ul>

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
}

export default About;
