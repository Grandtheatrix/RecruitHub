import React, { Component } from "react";
import AdminAddressesViewAll from "./AdminAddressesViewAll";
import AdminAddressesEdit from "./AdminAddressesEdit";
import { Route } from "react-router-dom";

class AdminAddressesComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Route
          exact
          path="/admin/addresses"
          component={AdminAddressesViewAll}
        />
        <Route
          exact
          path="/admin/addresses/edit"
          component={AdminAddressesEdit}
        />
        <Route
          exact
          path="/admin/addresses/:id(\d+)"
          component={AdminAddressesEdit}
        />
      </React.Fragment>
    );
  }
}

export default AdminAddressesComponent;
