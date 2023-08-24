import React, { useState } from "react";
import "./transaction.css";
// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
} from "react-bootstrap";
import TransactionInput from "../../Components/transactionInput/transactionInput";
import { transactionObjects,authObject } from "../../Services/apiService";
import { convertData } from "../../Components/TransConsultas/Convertidor";
import axios from "axios";
import { saveAs } from "file-saver";

function Transactions() {
  const [listaObjetos, setObjetos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tr, setTr] = useState("");
  const [superObj, setSuperObj] = useState([]);
  const [userValidityDate, setUserValidity] = useState(false);
  const [powerProfiles, setPowerProfiles] = useState(false);
  const [blockUsers, setBlockUsers] = useState(false);

  const handle = async () => {
    try {
      await transactionObjects(tr).then((result) => {
        setObjetos(result.data);
      });
    } catch (error) {
      console.log(error, "error en el handle");
    }
  };

  const handleBuscar = async () => {
    try {
      setLoader(true);
      const response = await authObject(superObj);
      setLoader(false);
      const blob = new Blob([response.data], { type: "text/csv" });
      saveAs(blob, `resultado_${tr}.csv`);
    } catch (error) {
      console.log(error, "error en el handleBuscar");
      setLoader(false);
    }
  };

  const convertirClavesAMinusculas = (objeto) => {
    try {
      const nuevoObjeto = {};

      for (const clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
          let nuevaClave = clave.toLowerCase();
          if (nuevaClave === "object") {
            nuevaClave = "obj";
          }
          nuevoObjeto[nuevaClave] = objeto[clave];
        }
      }

      return nuevoObjeto;
    } catch (error) {
      console.log(error, "error en el convertir");
    }
  };

  const divCons = (cons) => {
    try {
      let array = [];
      cons.forEach((consulta) => {
        let objDev = {};
        objDev["field"] = consulta.field;
        objDev["obj"] = consulta.obj;
        objDev["switch"] = consulta.switch;
        if (consulta.von.length === 1) {
          objDev["von"] = consulta.von[0];
          array.push(objDev);
        } else if (consulta.von.length > 1) {
          for (let i = 0; i < consulta.von.length; i++) {
            let copy = Object.assign({}, objDev);
            copy["von"] = consulta.von[i];
            array.push(copy);
          }
        }
      });
      return array;
    } catch (error) {
      console.log(error, "error en el divCons");
    }
  };

  const buscar = () => {
    try {
      let arrayAsubir = listaObjetos
        .filter((consulta) => consulta.CHECK === true)
        .map((consulta) => convertirClavesAMinusculas(consulta));
      let consultaDivididaVon = divCons(arrayAsubir);
      let obj = convertData(consultaDivididaVon);
      console.log(obj);
      let objASubir = {};
      objASubir["data"] = obj;
      objASubir["userValidityDate"] = userValidityDate;
      objASubir["powerProfiles"] = powerProfiles;
      objASubir["blockUsers"] = blockUsers;
      objASubir["blockUsers"] = blockUsers;
      objASubir["lote"] = localStorage.getItem("loteId");
      setSuperObj(objASubir);
      if (localStorage.getItem("loteId") !== 0) {
        handleBuscar();
      } else {
        alert("No hay ningun lote seleccionado");
      }
    } catch (error) {
      console.log(error, "error en el buscar");
    }
  };

  const agregar = () => {
    try {
      handle();
    } catch (error) {
      console.log(error, "error en el agregar");
    }
  };

  const agregarListaVon = (index) => {
    try {
      let copiaLista = [...listaObjetos];
      if (copiaLista[index].VON.length > 0) {
        copiaLista[index].VON.push("");
        setObjetos(copiaLista);
      } else {
        alert("Antes de agregar un valor nuevo ingrese uno");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const acutalizarVon = (posObj, val, posVon) => {
    try {
      let copiaLista = [...listaObjetos];
      copiaLista[posObj].VON[posVon] = val;
      setObjetos(copiaLista);
    } catch (error) {
      console.log(error, "error en el actualizarVon");
    }
  };

  const delteVon = (posObj, posVon) => {
    try {
      let copiaLista = [...listaObjetos];
      copiaLista[posObj].VON.splice(posVon, 1);
      setObjetos(copiaLista);
    } catch (error) {
      console.log(error, "error en el delteVon");
    }
  };

  const acatualizarSwitch = (posObj) => {
    try {
      let copiaLista = [...listaObjetos];
      copiaLista[posObj].switch = !copiaLista[posObj].switch;
      setObjetos(copiaLista);
    } catch (error) {
      console.log(error, "error en el acatualizarSwitch");
    }
  };

  const acatualizarCheck = (posObj) => {
    try {
      let copiaLista = [...listaObjetos];
      copiaLista[posObj].CHECK = !copiaLista[posObj].CHECK;
      setObjetos(copiaLista);
    } catch (error) {
      console.log(error, "error en el acatualizarCheck");
    }
  };

  return (
    <>
      {loader == true ? (
        <h2>Cargando</h2>
      ) : (
        <Container fluid>
          <h2>Búsqueda por objeto de Transacción: {tr} </h2>
          <Row className="justify-content-center">
            <TransactionInput event={(val) => setTr(val)} />
          </Row>
          <Row className="justify-content-center">
            <Button className="Agregar" variant="dark" onClick={agregar}>
              {" "}
              Agregar{" "}
            </Button>
          </Row>
          <Row>
            <Col md="12">
              <Card className="card-plain table-plain-bg">
                <Card.Header>
                  <Card.Title as="h4">Objetos de la Transacción</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <section className="filtros">
                    <h5>Filtros:</h5>
                    <Form.Check
                      onClick={() => setUserValidity(!userValidityDate)}
                      ckecked={userValidityDate}
                      label={"Check user validity Date with 30/06/2023"}
                    />
                    <Form.Check
                      onClick={() => setPowerProfiles(!powerProfiles)}
                      ckecked={powerProfiles}
                      label={"Exclude power profiles"}
                    />
                    <Form.Check
                      onClick={() => setBlockUsers(!blockUsers)}
                      ckecked={blockUsers}
                      label={"Exclude users with a blocking flag"}
                    />
                  </section>
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th className="border-0">OBJ AUTH</th>
                        <th className="border-0">FIELD</th>
                        <th className="border-0">VALUE FROM</th>
                        <th className="border-0">ACTION</th>
                        <th className="border-0">SELECT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaObjetos.map((item, index) => {
                        return (
                          <>
                            <tr>
                              <td>{item.OBJECT}</td>
                              <td>{item.FIELD}</td>
                              <td>
                                <Form.Group>
                                  <InputGroup>
                                    <Form.Control
                                      value={item.VON[0]}
                                      style={{ padding: "1%", border: "none" }}
                                      placeholder="VALUE TO"
                                      onChange={(e) =>
                                        acutalizarVon(index, e.target.value, 0)
                                      }
                                    />
                                  </InputGroup>
                                </Form.Group>
                              </td>
                              <td>
                                <Button
                                  onClick={() => agregarListaVon(index)}
                                  variant="success"
                                >
                                  Agregar VON
                                </Button>
                                <Form.Check
                                  checked={item.switch}
                                  label="or / and"
                                  type="switch"
                                  id="custom-switch"
                                  onChange={() => acatualizarSwitch(index)}
                                />
                              </td>
                              <td>
                                <Form.Check
                                  onChange={() => acatualizarCheck(index)}
                                  checked={item.CHECK}
                                />
                              </td>
                            </tr>
                            {item.VON.map((von, indice) => {
                              if (indice !== 0) {
                                return (
                                  <tr>
                                    <td>{item.OBJECT}</td>
                                    <td>{item.FIELD}</td>
                                    <td>
                                      <Form.Group>
                                        <InputGroup>
                                          <Form.Control
                                            value={von}
                                            style={{
                                              padding: "1%",
                                              border: "none",
                                            }}
                                            placeholder="VALUE TO"
                                            onChange={(e) =>
                                              acutalizarVon(
                                                index,
                                                e.target.value,
                                                indice
                                              )
                                            }
                                          />
                                        </InputGroup>
                                      </Form.Group>
                                    </td>
                                    <td>
                                      <Button
                                        variant="danger"
                                        onClick={() => delteVon(index, indice)}
                                      >
                                        Delete
                                      </Button>{" "}
                                    </td>
                                  </tr>
                                );
                              } else {
                                return <></>;
                              }
                            })}
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button
              onClick={() => buscar()}
              className="PrimaryBTN"
              variant="primary"
            >
              Buscar
            </Button>
            <Button className="PreviewBTN" variant="warning">
              Previsualizar
            </Button>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Transactions;
