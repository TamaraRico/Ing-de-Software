import React from "react";
import "./employee.css";
import Button from "@mui/material/Button";
import Menu from "../menuComponent/menu";

import ModalAdd from "./modalAdd";
import ModalEdit from "./modalEdit";
import ModalDelete from "./modalDelete";
import ModalPass from "./modalPass";
import { Grid } from "@mui/material";

import {EmployeeStadistics} from "../stadisticsComponent/employeeStadistics";

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
      reload: false,
    };

    this.fetchUsers = this.fetchUsers.bind(this);
  }

  reloadState = (childData) => this.setState({ reload: childData });

  fetchUsers() {
    getUsers().then((data) => {
      if (data !== "null") {
        const dataUser = JSON.parse(data);
        var dropAdmin = new Array();

        for (let i = 0; i < dataUser.length; i++) {
          if (dataUser[i].role == "employee") {
            dropAdmin.push(dataUser[i]);
          }
        }

        this.setState({
          users: dropAdmin,
        });
      } else {
        throw console.error(
          "no hay usuarios en la base de datos",
          this.state.users
        );
      }
    });
  }

  componentDidMount() {
    this.fetchUsers();
  }

  /// A como funciona mi codigo creo que esta bien
  /// Segun a lo que encontre no es reload
  componentDidUpdate() {
    if (this.state.reload) {
      this.fetchUsers();
      this.setState({ reload: false });
    }
  }

  render() {
    return (
      <div className="view-container">
        <Menu />
        <div id="main">
          <h1>EMPLEADOS</h1>
          <h7><b>INICIO/</b>Empleados</h7>
          <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
              <div class="card">
                <EmployeeStadistics />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div class="card">
                <AddButton parentCallback={this.reloadState} />
                <DeleteButton parentCallback={this.reloadState} />
                <EditButton parentCallback={this.reloadState} />
                <PassEditButton />
              </div>
            </Grid>
            <Grid item xs={12} md={12}>
              <div class="card">
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Checkin</th>
                      <th>Checkout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.users.map((val, key) => (
                      <tr usersId={key}>
                        <td>{val._id}</td>
                        <td>{val.name}</td>
                        <td>{val.entrada}</td>
                        <td>{val.salida}</td>
                        <td>{val.checkin}</td>
                        <td>{val.checkout}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

class AddButton extends React.Component {
  state = {
    active: false,
  };

  toogle = () => {
    this.setState({ active: !this.state.active });
    this.props.parentCallback(this.state.active);
  };

  render() {
    return (
      <div>
        <Button variant="text" onClick={this.toogle} margin="dense">
          Agregar Epleado
        </Button>
        <ModalAdd active={this.state.active} toogle={this.toogle}>
          <div>Ingrese Nuevo Usuario</div>
        </ModalAdd>
      </div>
    );
  }
  validate() {
    window.location.pathname = "/admin";
  }
}

class DeleteButton extends React.Component {
  state = {
    active: false,
  };

  toogle = () => {
    this.setState({ active: !this.state.active });
    this.props.parentCallback(this.state.active);
  };
  render() {
    return (
      <div>
        <Button variant="text" onClick={this.toogle} margin="dense">
          Eliminar Empleado
        </Button>
        <ModalDelete active={this.state.active} toogle={this.toogle}>
          <div>Ingrese Usuario</div>
        </ModalDelete>
      </div>
    );
  }
}

class EditButton extends React.Component {
  state = {
    active: false,
  };

  toogle = () => {
    this.setState({ active: !this.state.active });
    this.props.parentCallback(this.state.active);
  };

  render() {
    return (
      <div>
        <Button variant="text" onClick={this.toogle} margin="dense">
          Editar Horario
        </Button>
        <ModalEdit active={this.state.active} toogle={this.toogle}>
          <div>Ingrese Usuario</div>
        </ModalEdit>
      </div>
    );
  }
}

class PassEditButton extends React.Component {
  state = {
    active: false,
  };

  toogle = () => {
    this.setState({ active: !this.state.active });
    this.props.parentCallback(this.state.active);
  };

  render() {
    return (
      <div>
        <Button variant="text" onClick={this.toogle} margin="dense">
          Cambiar contrasena
        </Button>
        <ModalPass active={this.state.active} toogle={this.toogle}>
          <div>Ingrese Usuario</div>
        </ModalPass>
      </div>
    );
  }
}

export default Employee;
