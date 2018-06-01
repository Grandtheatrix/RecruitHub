import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { addresses_delete, addresses_getAll } from "./server";
import { showModal } from "./SmallModal";

class AdminAddressesViewAll extends Component {
  state = {
    addresses: [],
    columnNames: [
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "Postal Code",
      " Latitude",
      "Longitude",
      "Date Added",
      "Date Last Modified"
    ],
    addressId: null,
    loading: true
  };

  getAll = () => {
    addresses_getAll().then(myResponse => {
      this.setState({
        addresses: myResponse.data.items,
        loading: false
      });
    });
  };

  componentDidMount() {
    this.getAll();
  }

  deleteAddress = () => {
    addresses_delete(this.state.addressId)
      .then(myResponse => {
        console.log("Delete Success", myResponse);
        this.getAll();
      })
      .catch(error => {
        console.log("Delete Failed", error);
        alert("Delete Unsuccessful");
      });
  };

  modalHandler = id => {
    this.setState({ addressId: id });
    showModal({
      title: "Delete Current Address?",
      body:
        "Are you sure you wish to delete this address? This process is irreversible."
    }).then(
      () => this.deleteAddress(),
      () => this.setState({ addressId: null })
    );
  };

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    return (
      <React.Fragment>
        <div className="table-responsive mb-20">
          <Link
            to="/admin/addresses/edit"
            value="Enter New Address"
            className="btn btn-primary"
          >
            Enter new Address
          </Link>
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">#</th>
                {this.state.columnNames.map(name => <th>{name}</th>)}
                <th class="text-center" style={{ "min-width": "15%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.addresses.map(address => (
                <tr
                  className={
                    this.state.addressId === address.id ? "warning" : ""
                  }
                >
                  <td className="text-center">{address.id}</td>
                  <td>{address.line1}</td>
                  <td>{address.line2}</td>
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>{address.postalCode}</td>
                  <td>{address.latitude}</td>
                  <td>{address.longitude}</td>
                  <td>{address.dateAdded}</td>
                  <td>{address.dateModified}</td>
                  <td class="text-center">
                    <Link
                      to={"/admin/addresses/" + address.id}
                      data-original-title="edit"
                    >
                      <i className="fa fa-edit" />
                    </Link>
                    <a
                      href="#"
                      onClick={() => this.modalHandler(address.id)}
                      data-original-title="delete"
                    >
                      <i className="fa fa-trash-o" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminAddressesViewAll;
