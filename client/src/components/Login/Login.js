import React from "react";
import {Link} from 'react-router-dom';
import {Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import API from "../../utils/API";

export class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };
  send = async () => {
    const { email, password } = this.state;
    if (!email || email.length === 0) {
      return;
    }
    if (!password || password.length === 0) {
      return;
    }
    try {
      const { data } = await API.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);

      window.location = "/dashboard";
    } catch (error) {
      console.error(error);
    }
  };
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { email, password } = this.state;
    return (
      <div className="Login">
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <Button onClick={this.send} block bsSize="large" type="submit">
          Connexion
        </Button>

	<Link to="/Signup">
		Signup
	</Link>
      </div>
    );
  }
}
