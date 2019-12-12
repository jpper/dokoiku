import React from "react";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import { Button, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { firestore } from "firebase";
import "../styles/BuildTrip.css";

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    showBuild: state.showBuild
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddTrip: (
      name: string,
      userId: string,
      startDate: string,
      endDate: string,
      startLocation: string,
      waypoints: any,
      budget: string
    ) => {
      const tripId = uuidv4();
      myFirestore
        .collection("trips")
        .doc(tripId)
        .set({
          name,
          ownerId: userId,
          tripId,
          travelMode: "DRIVING",
          startDate: firestore.Timestamp.fromDate(new Date(startDate)),
          endDate: firestore.Timestamp.fromDate(new Date(endDate)),
          startLocation,
          waypoints,
          budget,
          memberIds: [userId]
        });
    }
  };
};

type BuildProps = {
  onAddTrip: any;
  userId: string;
};
type BuildState = {
  name: string;
  ownerId: string;
  tripId: string;
  travelMode: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: any;
  addedWaypoint: string;
  budget: number;
  memberIds: any;
};

class BuildTrip extends React.Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      name: "",
      ownerId: "",
      tripId: "",
      travelMode: "DRIVING",
      startDate: null,
      endDate: null,
      startLocation: "",
      waypoints: [],
      addedWaypoint: "",
      budget: 0,
      memberIds: []
    };
  }
  componentWillMount() {
    ValidatorForm.addValidationRule("startDateValidator", (value: string) => {
      const startDate = new Date(value).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return startDate >= today;
    });
    ValidatorForm.addValidationRule("startDateValidator2", (value: string) => {
      if (this.state.endDate === null) return true;
      const startDate = new Date(value);
      const endDate = new Date(this.state.endDate);
      return endDate >= startDate;
    });
    ValidatorForm.addValidationRule("endDateValidator", (value: string) => {
      const endDate = new Date(value);
      const startDate = new Date(this.state.startDate);
      return endDate >= startDate;
    });
  }
  clearState() {
    this.setState({
      name: "",
      ownerId: "",
      tripId: "",
      travelMode: "DRIVING",
      startDate: null,
      endDate: null,
      startLocation: "",
      waypoints: [],
      addedWaypoint: "",
      budget: 0,
      memberIds: []
    });
  }
  render() {
    return (
      <div>
        <div>
          <div className="BuildTrip">
            <h1>Build Trip</h1>
            <ValidatorForm
              onSubmit={() => {
                this.props.onAddTrip(
                  this.state.name,
                  this.props.userId,
                  this.state.startDate,
                  this.state.endDate,
                  this.state.startLocation,
                  this.state.waypoints,
                  this.state.budget
                );
                this.clearState();
              }}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                name="name"
                label="Name"
                variant="outlined"
                validators={["required"]}
                errorMessages={["this field is required"]}
                value={this.state.name}
                onChange={(e: any) => {
                  this.setState({ name: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              <TextValidator
                name="start-date"
                label="Start Date"
                variant="outlined"
                type="date"
                validators={[
                  "required",
                  "startDateValidator",
                  "startDateValidator2"
                ]}
                errorMessages={[
                  "this field is required",
                  "start date must be from today",
                  "start date must not be after end date"
                ]}
                InputLabelProps={{ shrink: true }}
                value={this.state.startDate}
                onChange={(e: any) => {
                  this.setState({ startDate: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              <TextValidator
                name="end-date"
                label="End Date"
                variant="outlined"
                type="date"
                validators={["required", "endDateValidator"]}
                errorMessages={[
                  "this field is required",
                  "end date must not be before start date"
                ]}
                InputLabelProps={{ shrink: true }}
                value={this.state.endDate}
                onChange={(e: any) => {
                  this.setState({ endDate: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              <TextValidator
                name="start-location"
                label="Start Location"
                variant="outlined"
                validators={["required"]}
                errorMessages={["this field is required"]}
                value={this.state.startLocation}
                onChange={(e: any) => {
                  this.setState({ startLocation: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              <label>Places:</label>
              {this.state.waypoints.length
                ? this.state.waypoints.map((waypoint: any, index: number) => (
                    <div>
                      <div>{waypoint.location}</div>
                      <IconButton
                        onClick={() =>
                          this.setState({
                            waypoints: [
                              ...this.state.waypoints.slice(0, index),
                              ...this.state.waypoints.slice(index + 1)
                            ]
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))
                : null}
              <br />
              <br />
              <br />
              <TextValidator
                name="places"
                label="Places"
                variant="outlined"
                value={this.state.addedWaypoint}
                onChange={(e: any) => {
                  this.setState({ addedWaypoint: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({
                    waypoints: this.state.waypoints.concat([
                      {
                        location: this.state.addedWaypoint,
                        stopover: true
                      }
                    ]),
                    addedWaypoint: ""
                  });
                }}
              >
                Add Place
              </Button>
              <br />
              <br />
              <br />
              <TextValidator
                name="budget"
                label="My Budget"
                type="number"
                variant="outlined"
                validators={["minNumber:0", "required"]}
                errorMessages={["cannot be negative", "this field is required"]}
                InputProps={{ inputProps: { min: 0 } }}
                value={this.state.budget}
                onChange={(e: any) => {
                  this.setState({ budget: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <br />
              {this.state.name &&
              this.state.travelMode &&
              this.state.startDate &&
              this.state.endDate &&
              this.state.startLocation &&
              this.state.waypoints.length &&
              this.state.budget > 0 ? (
                <Button variant="contained" color="primary" type="submit">
                  Submit My Trip
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Please Fill Out the Form
                </Button>
              )}
            </ValidatorForm>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildTrip);
