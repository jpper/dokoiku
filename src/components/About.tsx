import React from "react";
import { Typography } from "@material-ui/core";
import "../styles/About.css";
import "typeface-roboto";

import SearchIcon from "@material-ui/icons/Search";
import BuildIcon from "@material-ui/icons/Build";
import PeopleIcon from "@material-ui/icons/People";
import PaletteIcon from "@material-ui/icons/Palette";
import GitHubIcon from "@material-ui/icons/GitHub";

function About() {
  return (
    <div className="about">
      <Typography variant="h1">
        <b>Dokoiku</b>
      </Typography>
      <h1>The app for people to connect and share trips</h1>
      <br />
      <div className="calls-to-action">
        <h3>
          <SearchIcon fontSize="large" />{" "}
          <b>
            <u>SEARCH</u>
          </b>
          {"  "}
          trips that other users have created.
        </h3>
        <h3>
          <BuildIcon fontSize="large" />{" "}
          <b>
            <u>BUILD</u>
          </b>
          {"  "}
          and share your own trips.
        </h3>
        <h3>
          <PeopleIcon fontSize="large" />{" "}
          <b>
            <u>CONNECT</u>
          </b>
          {"  "}
          with your fellow travelers.
        </h3>
        <h3>
          <PaletteIcon fontSize="large" />{" "}
          <b>
            <u>CUSTOMIZE</u>
          </b>
          {"  "}
          your profile.
        </h3>
      </div>
      <br />
      <br />
      <div className="about-dokoiku">
        <h2>About Dokoiku</h2>
        <p>
          Dokoiku is a full-stack, single-page app that was created as a senior
          project Code Chrysalis's Immersive Bootcamp.
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
        <a href="https://github.com/team-dokoiku/dokoiku">
          <GitHubIcon fontSize="large" />
        </a>
      </div>
    </div>
  );
}

export default About;
