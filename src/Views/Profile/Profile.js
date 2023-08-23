import React from "react";
import User from "./user.jpg"
import "./profile.css";
// react-bootstrap components
//import { Card, Table, Container, Row, Col } from "react-bootstrap";

function Profile() {
	return (
	<div className="box"> <div className="userCard">
				<img className="avatar" src={User}/>
				<h2 className="username">Usernmae</h2>
			</div>
		</div>
		);
}

export default Profile;
