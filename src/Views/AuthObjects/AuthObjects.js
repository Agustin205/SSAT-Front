import React, { Component } from "react";
import "./authObjects.css";
// react-bootstrap components
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
  Form,
} from "react-bootstrap";
import EditableTable from "../../Components/editarTable/editableTable";
import axios from "axios";
import { saveAs } from "file-saver";
import { addConsult,authObject } from "../../Services/apiService";

const array = [];
class AuthObjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 0,
        },
      ],
      loader: false,
      inputValue: "",
      userValidityDate: false,
      powerProfiles: false,
      blockUsers: false,
      client: localStorage.getItem("clientName"),
    };
  }

  componentDidMount() {
    try {
      this.interval = setInterval(() => {
        const updatedClient = localStorage.getItem("clientName");
        this.setState({ client: updatedClient });
      }, 1000);
    } catch (error) {
      console.log(error, "error en el componentDidMount");
    }
  }

  componentWillUnmount() {
    try {
      clearInterval(this.interval);
    } catch (error) {
      console.log(error, "error en el componentWillUnmount");
    }
  }

  agregar() {
    try {
      let array = this.state.data;
      let lastId = -1;
      if (this.state.data.length !== 0) {
        lastId = array[array.length - 1].id;
      }
      array.push({ id: lastId + 1 });
      this.setState({ data: array });
    } catch (error) {
      console.log(error, "error en el agregar");
    }
  }

  delete(indice) {
    try {
      let Narray = this.state.data;
      Narray.splice(indice, 1);
      this.setState({ data: Narray });
    } catch (error) {
      console.log(error, "error en el delete");
    }
  }

  deleteField(indice, objeto, fieldName) {
    try {
      let Narray = this.state.data;
      delete Narray[indice][objeto][fieldName];
      this.setState({ data: Narray });
    } catch (error) {
      console.log(error, "error en el deleteField");
    }
  }

  deleteVon(indice, objeto, fieldName, posVon) {
    try {
      let Narray = this.state.data;
      Narray[indice][objeto][fieldName].von.splice(posVon, 1);
      this.setState({ data: Narray });
    } catch (error) {
      console.log(error, "error en el deleteVon");
    }
  }

  updateRowObj = (id, value, index) => {
    try{
      let array = [...this.state.data];
    let pos = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        pos = i;
        break;
      }
    }
    if (pos != -1) {
      let objetoAguardar = { id: id };
      objetoAguardar[value.trim().toUpperCase()] = {};
      array[index] = objetoAguardar;
      this.setState({ data: array });
    }
    }catch(error){
      console.log(error, "error en el updateRowObj");
    }
  };

  updateRowField = (objIndex, objVal, valores) => {
    try {
      let { name, ...newVal } = valores;
    let lista = this.state.data;
    let campos = Object.keys(lista[objIndex][objVal]);
    if (campos.length === 0) {
      lista[objIndex][objVal][name] = newVal;
    } else {
      //Actualizar
      for (let i = 0; i < campos.length; i++) {
        if (lista[objIndex][objVal][campos[i]].id === newVal.id) {
          delete lista[objIndex][objVal][campos[i]];
          break;
        }
      }
      //Agregar
      lista[objIndex][objVal][name] = newVal;
    }
    this.setState({ data: lista });
    } catch (error) {
      console.log(error, "error en el updateRowField");
    }
  };

  updateRowVon = (objIndex, objVal, fieldName, campoAct) => {
    try {
      let { name, ...campoSub } = campoAct;
    let lista = this.state.data;
    lista[objIndex][objVal][fieldName] = campoSub;
    this.setState({ data: lista });
    } catch (error) {
      console.log(error, "error en el updateRowVon");
    }
  };

  handleClick = async () => {
    //Validaciones -> Tengo que asegurarme x cada objeto que se ingreso haya al menos un filed y para ese filed un von
    let verif = true;
    let index = 0;
    let problem = "";

    if (localStorage.getItem("loteId") == 0) {
      verif = false;
      problem = "Tiene que tener un lote asignado para realizar la consulta!";
    }

    while (verif && index < this.state.data.length) {
      let claveObj = Object.keys(this.state.data[index]).filter(
        (key) => key !== "id"
      )[0];
      if (claveObj === undefined || claveObj === "") {
        problem = "Un objeto esta vacio! Inserte el nombre correspondiente";
        verif = false;
      } else {
        //Todos los objetos estan completos -> Chekeamos los campos
        let clavesCampos = Object.keys(this.state.data[index][claveObj]);
        let camposVacios = clavesCampos.filter(
          (clave) => clave === "" || clave === undefined
        );
        if (clavesCampos.length === 0 || camposVacios.length > 0) {
          problem = "Se deben agregar el Field del objeto: " + claveObj;
          verif = false;
        } else {
          //Si tiene valores chekeo que tenga al menos un VON
          let indiceVon = 0;
          while (indiceVon < clavesCampos.length) {
            let von =
              this.state.data[index][claveObj][clavesCampos[indiceVon]].von;
            let vonVacio = von.filter((val) => val === "" || val === undefined);
            if (von.length === 0 || vonVacio.length > 0) {
              problem =
                "Se deben agregar los valores desde del campo: " +
                clavesCampos[indiceVon] +
                " en el objeto: " +
                claveObj;
              verif = false;
            }
            indiceVon++;
          }
        }
      }
      index++;
    }

    if (!verif) {
      alert(problem);
      return 5;
    } else {
      //Obtener TCD
      let name = "standar";
      let objStcode = this.state.data.filter(
        (element) =>
          Object.keys(element)[0] === "S_TCODE" ||
          Object.keys(element)[1] === "S_TCODE"
      );
      if (objStcode.length > 0) {
        let nameVar = objStcode[0]["S_TCODE"]["TCD"];
        if (nameVar !== undefined) {
          name = nameVar.von[0];
        }
      }

      try {
        let data = this.state;
        data["lote"] = localStorage.getItem("loteId");
        this.setState({ loader: true });
        const response = await authObject(data);
        const blob = new Blob([response.data], { type: "text/csv" });
        saveAs(blob, `resultado_${name}.csv`);
        this.setState({
          loader: false,
          data: [{ id: 0 }],
          userValidityDate: false,
          powerProfiles: false,
          blockUsers: false,
        });
      } catch (error) {
        console.error("Error al llamar al backend:", error);
        this.setState({ loader: false });
      }
    }
  };

  handleSave = async () => {
    try {
      const { data } = this.state;
    let consulta = {
      name: this.state.inputValue,
      client: this.state.client,
      data: [],
    };
    data.forEach((obj) => {
      let claveObj = Object.keys(obj).filter((key) => key !== "id")[0];
      let camposObj = Object.keys(obj[claveObj]);
      camposObj.forEach((campo) => {
        let vonsXcampo = obj[claveObj][campo].von;
        let switchXcampo = obj[claveObj][campo].switch;
        for (let i = 0; i < vonsXcampo.length; i++) {
          let item = {
            obj: claveObj,
            field: campo,
            von: vonsXcampo[i],
            switch: switchXcampo,
          };
          consulta.data.push(item);
        }
      });
    });
    array.push(consulta);
    await addConsult(consulta);
    } catch (error) {
      console.log(error, "error en el handleSave");
    }
  };

  handleInputChange(event) {
    try {
      this.setState({ inputValue: event.target.value }); // Actualiza el estado del valor del input
    } catch (error) {
      console.log(error, "error en el handleInputChange");
    }
  }

  render() {
    return (
      <>
        <Container fluid>
          {this.state.loader ? (
            <h2>Cargando...</h2>
          ) : (
            <>
              <h2>Búsqueda por objeto de Autorización </h2>
              <Row>
                <Col md="12">
                  <Card className="card-plain table-plain-bg">
                    <Card.Header>
                      <Card.Title as="h4">Objetos de autorización</Card.Title>
                      <label htmlFor="inputValue" className="label1">
                        Nombre de la Consulta:{" "}
                      </label>
                      <input
                        type="text"
                        value={this.state.inputValue}
                        onChange={(event) => this.handleInputChange(event)} // Agregado: Manejador para actualizar el estado del valor del input
                      />
                      <Button variant="primary" onClick={this.handleSave}>
                        Guardar
                      </Button>
                    </Card.Header>
                    <Card.Body className="table-full-width table-responsive px-0">
                      <section className="filtros">
                        <h5>Filtros:</h5>
                        <Form.Check
                          onClick={() =>
                            this.setState({
                              userValidityDate: !this.state.userValidityDate,
                            })
                          }
                          ckecked={this.state.userValidityDate}
                          label={"Check user validity Date with 30/06/2023"}
                        />
                        <Form.Check
                          onClick={() =>
                            this.setState({
                              powerProfiles: !this.state.powerProfiles,
                            })
                          }
                          ckecked={this.state.powerProfiles}
                          label={"Exclude power profiles"}
                        />
                        <Form.Check
                          onClick={() =>
                            this.setState({
                              blockUsers: !this.state.blockUsers,
                            })
                          }
                          ckecked={this.state.blockUsers}
                          label={"Exclude users with a blocking flag"}
                        />
                      </section>
                      <Table className="table-hover">
                        <thead>
                          <tr>
                            <th className="border-0">OBJ AUTH</th>
                            <th className="border-0">FIELD</th>
                            <th className="border-0">VALUE FROM</th>
                            <th className="border-0">VALUE TO</th>
                            <th className="border-0">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.data.map((obj, idx) => {
                            return (
                              <EditableTable
                                datos={obj}
                                index={idx}
                                key={obj.id}
                                delete={(id) => this.delete(id)}
                                deleteField={(indice, objeto, fieldName) =>
                                  this.deleteField(indice, objeto, fieldName)
                                }
                                deleteVon={(
                                  indice,
                                  objeto,
                                  fieldName,
                                  posVon
                                ) =>
                                  this.deleteVon(
                                    indice,
                                    objeto,
                                    fieldName,
                                    posVon
                                  )
                                }
                                updateObj={(id, value, index) =>
                                  this.updateRowObj(id, value, index)
                                }
                                updateField={(objIndex, objVal, valores) =>
                                  this.updateRowField(objIndex, objVal, valores)
                                }
                                updateRowVon={(
                                  objIndex,
                                  objVal,
                                  fieldName,
                                  campoAct
                                ) =>
                                  this.updateRowVon(
                                    objIndex,
                                    objVal,
                                    fieldName,
                                    campoAct
                                  )
                                }
                              />
                            );
                          })}
                          <Button
                            className="Add"
                            variant="dark"
                            onClick={() => this.agregar()}
                          >
                            {" "}
                            Agregar objeto
                          </Button>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Button
                  className="PrimaryBTN"
                  variant="primary"
                  onClick={() => this.handleClick()}
                >
                  Buscar
                </Button>
                <Button className="PreviewBTN" variant="warning">
                  Previsualizar
                </Button>
              </Row>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default AuthObjects;

//delete={(id) => this.delete(id)} update={(id, value, type) => this.updateRow(id, value, type)}
