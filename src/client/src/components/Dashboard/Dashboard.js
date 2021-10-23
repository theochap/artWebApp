import React from "react";
import { Button } from "react-bootstrap";
import {Wall} from "../Wall/Wall.js"
import API from "../../utils/API";

export class Dashboard extends React.Component {
  disconnect = () => {
    API.logout();
    window.location = "/";
  };
  render() {
    return (
      <div className="Dashboard">
        <h1>Dashboard</h1>
	<Wall/>
	
        <Button onClick={this.disconnect} block bsSize="large" type="submit" style={{ marginTop: '30px'}}>
          Se déconnecter
        </Button>

      </div>
    );
  }
}
