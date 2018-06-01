import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  addresses_getById,
  addresses_create,
  addresses_update
} from "./server";

class AdminAddressesEdit extends Component {
  state = {
    addressId: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    mode: "Create New Address",
    line1Err: false,
    line2Err: false,
    cityErr: false,
    stateErr: false,
    postalCodeErr: false,
    redirectToViewAll: false,
    loading: false
  };
  componentDidMount() {
    if (this.props.match.params.id)
      this.setState({ addressId: this.props.match.params.id, loading: true });
    addresses_getById(this.props.match.params.id).then(myResponse => {
      console.log("getById Successful", myResponse.data);
      this.setState({
        line1: myResponse.data.item.line1,
        line2: myResponse.data.item.line2,
        city: myResponse.data.item.city,
        state: myResponse.data.item.state,
        postalCode: myResponse.data.item.postalCode,
        latitude: myResponse.data.item.latitude,
        longitude: myResponse.data.item.longitude,
        mode: "Update Existing Address",
        loading: false
      });
    });
  }

  changeHandler = () => {
    const newState = {};

    for (let field of ["line1", "line2", "city", "state"]) {
      newState[field + "Err"] = this.state[field].length == 0;
    }

    newState.postalCodeErr = !/^\d{5}(-\d{4})?$/.test(this.state.postalCode);

    const hadAtLeastOneErr = Object.values(newState).includes(true);
    if (!hadAtLeastOneErr) {
      const formData = {
        id: this.state.addressId,
        line1: this.state.line1,
        line2: this.state.line2,
        city: this.state.city,
        state: this.state.state,
        postalCode: this.state.postalCode,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        fieldsDisabled: false
      };

      this.setState({ fieldsDisabled: true });

      if (this.state.mode === "Update Existing Address") {
        addresses_update(formData)
          .then(response => {
            console.log("Update Success", response);
            this.setState(
              { fieldsDisabled: false },
              this.setState({ redirectToViewAll: true })
            );
          })
          .catch(error => {
            // Error
            console.log("Update Unsuccessful", error);
          });
      } else {
        addresses_create(formData)
          .then(response => {
            console.log("Create Success", response),
              this.setState(
                { fieldsDisabled: false },
                this.setState({ redirectToViewAll: true })
              );
          })
          .catch(error => {
            // Error
            console.log("Create Unsuccessful", error);
          });
      }
    }
    this.setState(newState);
  };

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <React.Fragment>
        <form action="#">
          <div className="form-body">
            <label class="control-label pull-right">
              All starred fields are required <span class="asterisk">*</span>
            </label>
            {this.state.addressId && (
              <div class="form-group">
                <label class="control-label">Id #</label>
                <input
                  className="form-control"
                  disabled="disabled"
                  type="text"
                  value={this.state.addressId}
                />
              </div>
            )}
            <div
              className={
                this.state.line1Err ? "form-group has-error" : "form-group"
              }
            >
              <label className="control-label">
                Address Line 1 <span class="asterisk">*</span>
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.line1}
                onChange={e => this.setState({ line1: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
              {this.state.line1Err && (
                <label
                  id="bv_username-error"
                  className="error control-label"
                  for="bv_username"
                  style={{ display: "inline-block" }}
                >
                  Address Line 1 is Required.
                </label>
              )}
            </div>
            <div
              className={
                this.state.line2Err ? "form-group has-error" : "form-group"
              }
            >
              <label className="control-label">
                Address Line 2 <span class="asterisk">*</span>
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.line2}
                onChange={e => this.setState({ line2: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
              {this.state.line2Err && (
                <label
                  id="bv_username-error"
                  className="error control-label"
                  for="bv_username"
                  style={{ display: "inline-block" }}
                >
                  Address Line 2 is required.
                </label>
              )}
            </div>
            <div
              className={
                this.state.cityErr ? "form-group has-error" : "form-group"
              }
            >
              <label className="control-label">
                City <span class="asterisk">*</span>
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.city}
                onChange={e => this.setState({ city: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
              {this.state.cityErr && (
                <label
                  id="bv_username-error"
                  className="error control-label"
                  for="bv_username"
                  style={{ display: "inline-block" }}
                >
                  City is required.
                </label>
              )}
            </div>
            <div
              className={
                this.state.stateErr ? "form-group has-error" : "form-group"
              }
            >
              <label class="control-label">
                State <span class="asterisk">*</span>
              </label>
              <select
                class="form-control"
                name="sv2_state"
                value={this.state.state}
                onChange={e => this.setState({ state: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              >
                <option value="">Choose State:</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
              {this.state.stateErr && (
                <label
                  id="bv_username-error"
                  className="error control-label"
                  for="bv_username"
                  style={{ display: "inline-block" }}
                >
                  State is Required.
                </label>
              )}{" "}
            </div>
            <div
              className={
                this.state.postalCodeErr ? "form-group has-error" : "form-group"
              }
            >
              <label className="control-label">
                Postal Code<span class="asterisk">*</span>
              </label>
              <input
                className="form-control"
                maxlength="10"
                type="text"
                value={this.state.postalCode}
                onChange={e => this.setState({ postalCode: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
              {this.state.postalCodeErr && (
                <label
                  id="bv_username-error"
                  className="error control-label"
                  for="bv_username"
                  style={{ display: "inline-block" }}
                >
                  Please enter a valid Postal Code. You must enter either 5 or 9
                  digits: XXXXX or XXXXX-XXXX.
                </label>
              )}
            </div>
            <div className="form-group">
              <label className="control-label">Latitude</label>
              <input
                className="form-control"
                type="number"
                step="any"
                value={this.state.latitude}
                onChange={e => this.setState({ latitude: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
            </div>
            <div className="form-group">
              <label className="control-label">Longitude</label>
              <input
                className="form-control"
                type="number"
                step="any"
                value={this.state.longitude}
                onChange={e => this.setState({ longitude: e.target.value })}
                disabled={this.state.fieldsDisabled ? "disabled" : ""}
              />
            </div>

            <input
              type="button"
              value={this.state.mode}
              onClick={this.changeHandler}
            />
          </div>
        </form>
        {this.state.redirectToViewAll && <Redirect to="/admin/addresses" />}
      </React.Fragment>
    );
  }
}

export default AdminAddressesEdit;
