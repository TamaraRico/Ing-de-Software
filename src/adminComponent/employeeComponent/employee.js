import React from "react";
import "./employee.css";
import Menu from "../menuComponent/menu";

import { Grid } from "@mui/material";
import { StickyTable } from "./employeeTable";
import ModalAdd from "./modalAdd";
import ModalEdit from "./modalEdit";
import ModalDelete from "./modalDelete";
import ModalPass from "./modalPass";

import { EmployeeStadistics } from "../stadisticsComponent/employeeStadistics";

function getUsers() {
  return new Promise((resolve, reject) => {
    window.api.send("users:findAllUsers");

    window.api.receive("users:getAllUsers", (data) => {
      resolve(data);
    });
  });
}

class Employee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.fetchUsers = this.fetchUsers.bind(this);
  }

  fetchUsers() {
    getUsers().then((data) => {
      if (data !== "null") {
        const dataUser = JSON.parse(data);

        var newUsers = this.state.users.concat(dataUser);

        var dropAdmin = new Array();

        for (let i = 0; i < dataUser.length; i++) {
          if (dataUser[i].role == "employee") {
            dropAdmin.push(dataUser[i]);
          }
        }

        this.setState(
          {
            users: dropAdmin,
          },
          () => {
            console.log("Datos desde inventario.js: ", this.state.users);
          }
        );
      } else {
        throw console.error(
          "no hay productos en la base de datos",
          this.state.users
        );
      }
    });
  }

  componentDidMount() {
    this.fetchUsers();
  }

  render() {
    return (
      <div className="view-container">
        <Menu />
        <div id="main">
          <h1>Empleado</h1>
          <h7>
            <b>INICIO/</b>Empleado
          </h7>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <div class="card">
                <EmployeeStadistics />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div class="card">
                <h2>ACCIONES DE EMPLEADOS</h2><br/>
                <table align="center" width="100%">
                  <tr align="center">
                    <td align="center"><ModalAdd /></td>
                  </tr>
                  <tr align="center">
                  <td align="center"><ModalDelete /></td>
                  </tr>
                  <tr align="center">
                  <td align="center"><ModalEdit /></td>
                  </tr>
                  <tr align="center">
                  <td align="center"><ModalPass /></td>
                  </tr>
                </table>
              </div>
            </Grid>
            <Grid item xs={12} md={12}>
              <div class="card">
                {this.state.users.length > 0 ? (
                  <StickyTable data={this.state.users} />
                ) : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Employee;
