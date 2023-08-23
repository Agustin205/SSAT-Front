import React, { useState,useEffect } from 'react';
import Consultas from "../../Components/TransConsultas/Consultas";
import "./Welcome.css";
import History from "../../Components/History/history";
import { history } from "../../Services/apiService";

const Welcome = () => {
	const [listaConsultasClient, setListaConsultasCliente] = useState([]);
	const [listaNameLotes, setListaNameLotes] = useState([]);
  const [arranco, setArranco] = useState(true);

	useEffect(() =>{
        const handle = async () => {
            try {
            await history(localStorage.getItem('clientId')).then((result)=> {
                setListaConsultasCliente(result.data.data)
                setListaNameLotes(result.data.names)
                setArranco(false)
            })  
          } catch (error) {
            console.log(error,'error en el handle')
          }
        }
        if(arranco){
            handle();
        }
    })
	
	return (
		<div className="container">
			<h2>Ver y modificar Consultas</h2>
			{listaConsultasClient.map((lote,index)=> {
				return (
					<History lote={lote} name={listaNameLotes[index]}/>
				)
			})}
			<Consultas />
			
		</div>
	);
};

export default Welcome;
