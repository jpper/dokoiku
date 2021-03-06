import React, { Dispatch, ChangeEvent } from "react";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import { Waypoint } from "../redux/stateTypes";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { firestore } from "firebase";
import "../styles/BuildTrip.css";

type MapStateToProps = {
  userId: string;
  showEdit: boolean;
};

const mapStateToProps = (state: MapStateToProps) => {
  return {
    userId: state.userId,
    showEdit: state.showEdit
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
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
      waypoints: Waypoint[],
      budget: number,
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
    }
  };
};

type EditProps = {
  name: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: Waypoint[];
  budget: number;
  onClosePopup: () => void;
  onShowEdit: (index: number) => void;
  onEditTrip: (
    name: string,
    startDate: string,
    endDate: string,
    startLocation: string,
    waypoints: Waypoint[],
    budget: number,
    tripId: string
  ) => void;
  userId: string;
  tripId: string;
};
type EditState = {
  name: string;
  travelMode: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: Waypoint[];
  addedWaypoint: string;
  budget: number;
  toggleDialog: boolean;
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
      budget: this.props.budget,
      toggleDialog: false
    };
  }
  componentWillMount() {
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
      budget: 0,
      toggleDialog: false
    });
  }
  handleToggle() {
    this.setState({
      toggleDialog: true
    });
  }
  render() {
    return (
      <div>
        <div>
          <div className="BuildTrip">
            <h1>Update Trip</h1>
            <ValidatorForm
              onSubmit={() => {
                this.props.onEditTrip(
                  this.state.name,
                  this.state.startDate,
                  this.state.endDate,
                  this.state.startLocation,
                  this.state.waypoints,
                  this.state.budget,
                  this.props.tripId
                );
                this.handleToggle();
              }}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                name="name"
                label="Name"
                size="small"
                variant="outlined"
                validators={["required"]}
                errorMessages={["this field is required"]}
                value={this.state.name}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ name: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <TextValidator
                name="start-date"
                label="Start Date"
                variant="outlined"
                size="small"
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
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ startDate: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <TextValidator
                name="end-date"
                label="End Date"
                variant="outlined"
                type="date"
                size="small"
                validators={["required", "endDateValidator"]}
                errorMessages={[
                  "this field is required",
                  "end date must not be before start date"
                ]}
                InputLabelProps={{ shrink: true }}
                value={this.state.endDate}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ endDate: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <TextValidator
                name="start-location"
                label="Start Location"
                variant="outlined"
                size="small"
                validators={["required"]}
                errorMessages={["this field is required"]}
                value={this.state.startLocation}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ startLocation: e.currentTarget.value });
                }}
              />
              <br />
              <br />
              <label>Destinations:</label>
              {this.state.waypoints.length
                ? this.state.waypoints.map(
                    (waypoint: Waypoint, index: number) => (
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
                    )
                  )
                : null}
              <br />
              <br />
              <TextValidator
                name="places"
                label="Places"
                variant="outlined"
                size="small"
                value={this.state.addedWaypoint}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ addedWaypoint: e.currentTarget.value });
                }}
              />
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
                Add Destination
              </Button>
              <br />
              <br />
              <TextValidator
                name="budget"
                label="My Budget"
                type="number"
                size="small"
                variant="outlined"
                validators={["minNumber:0", "required"]}
                errorMessages={["cannot be negative", "this field is required"]}
                InputProps={{ inputProps: { min: 0 } }}
                value={this.state.budget}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  this.setState({ budget: Number(e.currentTarget.value) });
                }}
              />
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
                  Update My Trip
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Please Fill Out the Form
                </Button>
              )}
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
            <Dialog open={this.state.toggleDialog}>
              <DialogTitle>Successfully updated</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You just updated your trip.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    this.clearState();
                    document.location.reload();
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTrip);
