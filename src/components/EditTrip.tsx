import React from "react";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import { Button, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { firestore } from "firebase";
import "../styles/BuildTrip.css";
import moment from "moment";

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    showEdit: state.showEdit
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowEdit: (index: number) =>
      dispatch({
        type: "SHOW_EDIT",
        index
      }),
    onClosePopup: () =>
      dispatch({
        type: "CLOSE_POPUP"
      }),
    onEditTrip: async (
      name: string,
      startDate: string,
      endDate: string,
      startLocation: string,
      waypoints: any,
      budget: string,
      tripId: string
    ) => {
      await myFirestore
        .collection("trips")
        .doc(tripId)
        .update({
          name,
          travelMode: "DRIVING",
          startDate: firestore.Timestamp.fromDate(new Date(startDate)),
          endDate: firestore.Timestamp.fromDate(new Date(endDate)),
          startLocation,
          waypoints,
          budget
        });
      window.location.reload();
    }
  };
};

type EditProps = {
  name: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: any;
  budget: number;
  onClosePopup: any;
  onShowEdit: any;
  onEditTrip: any;
  userId: string;
  tripId: string;
};
type EditState = {
  name: string;
  travelMode: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: any;
  addedWaypoint: string;
  budget: number;
};

class EditTrip extends React.Component<EditProps, EditState> {
  constructor(props: EditProps) {
    super(props);
    this.state = {
      name: this.props.name,
      travelMode: "DRIVING",
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      startLocation: this.props.startLocation,
      waypoints: this.props.waypoints,
      addedWaypoint: "",
      budget: this.props.budget
    };
  }
  componentWillMount() {
    console.log(this.props.startDate);
    ValidatorForm.addValidationRule("startDateValidator", (value: string) => {
      const startDate = new Date(value).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return startDate >= today;
    });
    ValidatorForm.addValidationRule("startDateValidator2", (value: string) => {
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
      travelMode: "DRIVING",
      startDate: null,
      endDate: null,
      startLocation: "",
      waypoints: [],
      addedWaypoint: "",
      budget: 0
    });
  }
  render() {
    return (
      <div>
        <div>
          <div className="EditTrip">
            <h1>Edit Trip</h1>
            <ValidatorForm
              onSubmit={() => {
                console.log(this.state.waypoints);
                this.props.onEditTrip(
                  this.state.name,
                  this.state.startDate,
                  this.state.endDate,
                  this.state.startLocation,
                  this.state.waypoints,
                  this.state.budget,
                  this.props.tripId
                );
                this.clearState();
                this.props.onClosePopup();
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
                  Edit My Trip
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Please Fill Out the Form
                </Button>
              )}
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="secondary"
                onClick={this.props.onClosePopup}
              >
                Close
              </Button>
            </ValidatorForm>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTrip);
