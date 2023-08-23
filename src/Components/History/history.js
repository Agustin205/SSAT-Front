//Tengo un kilombo con history (me deberia de traer x cliente: q ta localstorage el historial x lote) Recorro en welcome y le mando por prompts los lotes x cliente. 
import React, { useState,useEffect } from 'react';
import './history.css'
import { Card, Table, Container, Row, Col, Button } from "react-bootstrap";
import { getCsv,history } from '../../Services/apiService';
import { saveAs } from "file-saver";

function History(props) {
    const [listaConsultas, setListaConsultas] = useState(props.lote);
    console.log(props.lote)

    const handleCsv = async (item) => {
        
        try {
            await getCsv(item.csv).then((result)=> {
                const blob = new Blob([result.data], { type: "text/csv" });
                saveAs(blob, `${item.name}.csv`);
            })  
          } catch (error) {
            console.log(error,'error en el csv')
        }
    }
    return (
    <>
        <Container fluid>
            <Row>
					<Col md="12">
						<Card className="card-plain table-plain-bg" style={{marginTop:'1%'}}>
							<Card.Header>
								<Card.Title as="h4">Ultimas consultas de lote: {props.name} </Card.Title>
							</Card.Header>
							<Card.Body className="table-full-width table-responsive px-0">
								<Table className="table-hover">
									<thead>
                                        <tr>
                                           <th className="border-0">NOMBRE</th> 
    						               <th className="border-0">FECHA</th> 
                   						   <th className="border-0">USUARIO</th> 
                                           <th className="border-0">RESULTADO</th> 
                                        </tr>
									</thead>
									<tbody>
                                        {listaConsultas.map((item) => {
                                            return(
                                            <tr>
                                                 <td>{item.name}</td>
                                                 <td>{item.date}</td>
                                                 <td>{item.user}</td>
                                                 <td><Button onClick={() => handleCsv(item)}>Descargar</Button></td>
                                             </tr>)
                                        })                                           
                                        }
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Col>
				</Row>
        </Container>    
    </>
    )
}
export default History;