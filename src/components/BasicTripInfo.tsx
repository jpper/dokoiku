import React from "react";

import { Typography } from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import "../styles/TripInfo.css";
import "../styles/Modal.css";
import countriesToCurrencies from "../data/countries_to_currencies.json";

type myProps = {
  tripTitle: string;
  country: string;
  location: string;
  startDate: string;
  endDate: string;
  wayPoints: wayPoints;
};
type wayPoints = {
  waypoints: waypoints[];
};

type waypoints = {
  location: string;
  stopover: boolean;
};
type myState = {
  userCurrencyBudget: number;
};
type item = {
  countryCode: string;
};

export default class BasicTripInfo extends React.Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      userCurrencyBudget: 0
    };
  }

  render() {
    return (
      <div className="basicTripInfo">
        {/* Title */}
        <Typography variant="h4" className="noWrapper">
          <b>{this.props.tripTitle}</b>
        </Typography>

        {/* Country */}
        <Typography className="iconWrapper">
          <strong>Country:&nbsp; </strong>
          <img
            src={`https://www.countryflags.io/${this.props.country.toLowerCase()}/shiny/24.png`}
            alt="flag"
          ></img>
          {
            countriesToCurrencies.find((item: item) => {
              return this.props.country === item.countryCode;
            }).country
          }
        </Typography>

        {/* Starting Location */}
        <Typography className="noWrapper">
          <DoubleArrowIcon />
          <strong>Starting Location:&nbsp; </strong> {` ${this.props.location}`}
        </Typography>

        {/* Start Date */}
        <Typography className="noWrapper">
          <DateRangeIcon />
          <strong>Start Date: &nbsp;</strong> {this.props.startDate}
        </Typography>

        {/* End Date */}
        <Typography className="noWrapper">
          <DateRangeIcon />
          <strong>End Date: &nbsp;</strong> {this.props.endDate}
        </Typography>

        {/* WayPoints */}
        <div>
          <Typography className="noWrapper">
            <LocationOnIcon />
            <strong className="boldText topPadding">Destinations:</strong>
          </Typography>
          <ul className="ul-test">
            {this.props.wayPoints.waypoints.map((l: waypoints, i: number) => {
              return (
                <>
                  <Typography className="noWrapper">
                    <li>{l.location}</li>
                  </Typography>
                </>
              );
            })}
          </ul>
        </div>

        {/* Budget */}
        {/* <Typography className="iconWrapper">
          <MonetizationOnIcon />
          Budget: {this.props.budget}
        </Typography> */}
      </div>
    );
  }
}
