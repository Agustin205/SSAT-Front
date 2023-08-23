import React from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import { routes } from "./routes";
import Sidebar from "./Views/Sidebar/Sidebar";
import Topbar from "./Views/Topbar/topbar";
import Login from "./Views/Login/Login";

function App() {

	const isAuthenticated = () => {
		return localStorage.getItem("gameToken") !== null;
	  };

	return (
		<Router>
			<div className="wrapper">
				<Sidebar />
				<Topbar />
				<div className="main-panel">
					<div className="content">
						<Routes>
							{routes.map((route, idx) => (
								<Route 
									key={idx}
									path={route.path}
									element={isAuthenticated() ? <route.component /> : <Login/>}
								/>
							))}
						</Routes> 
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
