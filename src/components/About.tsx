import React from "react";

class About extends React.Component<{}, {}> {
  render() {
    return (
      <div className="about">
        <p>Welcome to Dokoiku</p>
        <p>Dokoiku is an app for people who want to connect and share a trip together. 
Users can join already active trips or find an already existing trip.
</p>
      <p>It is a full-stack, single-page app that was created as a senior project during the Immersive Bootcamp at Code Chrysalis. <br></br> It was created by five people in about ten full days of work.</p>

      <ul>Team:
        <a href="https://github.com/followdiallo"><li>Diallo Spears</li></a>
        <a href="https://github.com/Imamachi-n"><li>Naoto Imamachi</li></a>
        <a href="https://github.com/nlandon2"><li>Nate Landon</li></a>
        <a href="https://github.com/baruishi"><li>Waldemar Ishibashi</li></a>
        <a href="https://github.com/Ziyu-Chen"><li>Ziyu Chen</li></a>
      </ul>
      <ul>Technology used:
       <li>Google Cloud Services</li>
       <li>Firebase Database</li>
       <li>React-Redux</li>
       <li>Typescript</li>
       <li>Material UI</li>
       <a href="https://github.com/cc10-team-gryffindor"><li>GitHub</li></a>
      </ul>

      </div>
    );
  }
}

	

export default About;
