import React from "react";

import { Link } from "react-router-dom";

export default class Login extends React.Component {
  render(){
    return(
      <div>
        <h1>Login page</h1>
        <Link to="/pos">Ir a main</Link>
      </div>
    );
  }
}