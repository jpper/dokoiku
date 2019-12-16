import React from "react";

import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
// import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import countriesToCurrencies from "../data/countries_to_currencies.json";

export default class BasicTripInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      userCurrencyBudget: 0
    };
  }

  render() {
    return (
      <div className="basicTripInfo">
        {/* Title */}
        <Typography variant="h3" className="typoH3">
          <b>{this.props.tripTitle}</b>
        </Typography>

        {/* Country */}
        <Typography className="iconWrapper">
          Country:
          <img
            src={`https://www.countryflags.io/${this.props.country.toLowerCase()}/shiny/24.png`}
            alt="flag"
          ></img>
          {
            countriesToCurrencies.find(
              (item: any) => this.props.country === item.countryCode
            ).country
          }
        </Typography>

        {/* Start Date */}
        <Typography className="iconWrapper">
          <DateRangeIcon />
          Start Date: {this.props.startDate}
        </Typography>

        {/* End Date */}
        <Typography className="iconWrapper">
          <DateRangeIcon />
          End Date: {this.props.endDate}
        </Typography>

        {/* Starting Location */}
        <Typography className="iconWrapper">
          <DoubleArrowIcon />
          Starting Location:
          {this.props.location}
        </Typography>

        {/* WayPoints */}
        <div>
          <List>
            <Typography variant="h5">Waypoints:</Typography>
            {this.props.wayPoints.waypoints.map((l: any, i: number) => {
              return (
                <ListItem key={i} className="tripLocation">
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={l.location} />
                </ListItem>
              );
            })}
          </List>
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
