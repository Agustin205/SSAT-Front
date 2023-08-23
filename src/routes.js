// Importa tus componentes de página aquí
import Welcome from "./Views/Welcome/Welcome.js";
import Data from "./Views/Data/Data.js";
import AuthObjects from "./Views/AuthObjects/AuthObjects.js";
import Transactions from "./Views/Transactions/Transactions.js";
import Profile from "./Views/Profile/Profile.js";
import Login from "./Views/Login/Login.js";
import Register from "./Views/Register/Register.js";
import AdmLotes from "./Views/AdmLotes/AdmLotes.js";
import Config from"./Views/Config/config.js"

const routes = [
	// {
	// 	path: "/",
	// 	exact: true,
	// 	label: "Inicio",
	// 	component: Welcome,
	// },
	{
		path: "/",
		name: "Welcome",
		icon: "nc-icon nc-chart-pie-35",
		component: Welcome,
		layout: "/",
	},
	{
		path: "/managedata",
		name: "Manage Data",
		icon: "nc-icon nc-paper-2",
		component: Data,
		layout: "/",
	},
	{
		path: "/transactions",
		name: "Transactions",
		icon: "nc-icon nc-circle-09",
		component: Transactions,
		layout: "/",
	},
	{
		path: "/objects",
		name: "Auth Object",
		icon: "nc-icon nc-notes",
		component: AuthObjects,
		layout: "/",
	},
	{
		path: "/profile",
		name: "Perfil",
		icon: "nc-icon nc-bell-55",
		component: Profile,
		layout: "/",
	},
	{
		path: "/login",
		name: "logearme",
		icon: "nc-icon nc-bell-55",
		component: Login,
		layout: "/",
	},
	{
		path: "/register",
		name: "registrate",
		icon: "nc-icon nc-bell-55",
		component: Register,
		layout: "/",
	},
	{
		path: "/admLotes",
		name: "adminLotres",
		icon: "nc-icon nc-bell-55",
		component: AdmLotes,
		layout: "/",
	},
	{
		path: "/config",
		name: "configuration",
		icon: "nc-icon nc-bell-55",
		component: Config,
		layout: "/",
	},
	{
		path: "*",
		component: Welcome,
	},
];

export { routes };
