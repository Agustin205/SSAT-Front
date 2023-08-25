import React, { useState, useEffect } from "react";
import Modall from "./Modal";
import "./Consultas.css";
import axios from "axios";
import { Card, Button, Row, Col, Table,Form } from "react-bootstrap";
import EditableTable from "../editarTable/editableTable";
import { convertData } from "../TransConsultas/Convertidor.js";
import { getConsult, editConsult, addConsult, authObject } from "../../Services/apiService";
import { saveAs } from "file-saver";

function Consultas() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [consultData, setConsultData] = useState(null);
  const [inputValue, setInputValue] = useState(""); // Agregado: Estado para el valor del input
  const [inputValue2, setInputValue2] = useState(""); // Agregado: Estado para el valor del input2
  const [showEditableTable2, setShowEditableTable2] = useState(false);
  const [client, setClient] = useState([]);
  const [userValidityDate, setUserValidityDate] = useState(false);
  const [powerProfiles, setPowerProfiles] = useState(false);
  const [blockUsers, setBlockUsers] = useState(false);

  useEffect(() => {
    setClient(localStorage.getItem("clientName"));
    // Función para obtener los datos de la consulta
    const fetchData = async () => {
      try {
        const resultado = await getConsult({});
        setConsultData(resultado);
      } catch (error) {
        console.log(error, "error en el fetch");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        const updatedClientName = localStorage.getItem("clientName");
        setClient(updatedClientName);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } catch (error) {
      console.log(error, "error en el useeffect");
    }
  }, []);

  function addIdsToResponse(response) {
    try {
      let currentIndex = 1;
      const newResponse = {
        ...response,
        data: consultData.map((item, index) => ({
          //CAMBIO DATA
          ...item,
          data: item.data.map((obj, objIndex) => ({
            ...obj,
            id: currentIndex++,
          })),
        })),
      };
      return newResponse;
    } catch (error) {
      console.log(error, "error en el addsIds");
      return response;
    }
  }

  const handleSelectChange = (event) => {
    try {
      const filteredData = consultData.filter((item) => item.client === client);
      const idss = addIdsToResponse(filteredData); //CAMBIO DATA
      const selectedName = event.target.value;
      const query = idss.data.find((item) => item.name === selectedName); // CAmbio data
      setSelectedQuery({ data: convertData(query.data) });
      setShowEditableTable2(false);
      setTimeout(() => {
        setShowEditableTable2(true); // Después de 1 segundo, establecemos setShowEditableTable2 en true
      }, 100); // 1000 milisegundos = 1 segundo
      setShowTable(false);
      setInputValue(selectedName);
    } catch (error) {
      console.log(error, "error en el select");
    }
  };

  const handleOverwriteTable = async () => {
    try {
      if (selectedQuery.data === null) {
      } else {
        const index = consultData.findIndex((item) => item.name === inputValue);
        const nuevaData = [];
        selectedQuery.data.forEach((obj) => {
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
              nuevaData.push(item);
            }
          });
        });
        consultData[index].data = nuevaData;
        await editConsult(consultData[index]);
      }
    } catch (error) {
      console.log(error, "error en el sobreescribir");
    }
  }; //ACA

  const handleNewQuery = async () => {
    try {
      // Aquí podrías crear una nueva consulta vacía y mostrarla en la lista desplegable
      const selectedName = inputValue;
      const index = consultData.findIndex((item) => item.name === selectedName);
      const nuevaData = [];
      selectedQuery.data.forEach((obj) => {
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
            nuevaData.push(item);
          }
        });
      });
      const newQuery = {
        ...consultData[index],
        name: inputValue2,
        data: nuevaData,
      }; // Crear una nueva copia del objeto con la propiedad "name" actualizada y la data actualizada
      await addConsult(newQuery);
      window.location.reload();
    } catch (error) {
      console.log(error, "error en hacer la nueva consulta");
    }
  }; //ACA

  const handleEjecutar = async () => {
    let verif = true;
    let index = 0;
    let problem = "";

    if (localStorage.getItem("loteId") == 0) {
      verif = false;
      problem = "Tiene que tener un lote asignado para realizar la consulta!";
    }

    while (verif && index < selectedQuery.data.length) {
      let claveObj = Object.keys(selectedQuery.data[index]).filter(
        (key) => key !== "id"
      )[0];
      if (claveObj === undefined || claveObj === "") {
        problem = "Un objeto esta vacio! Inserte el nombre correspondiente";
        verif = false;
      } else {
        //Todos los objetos estan completos -> Chekeamos los campos
        let clavesCampos = Object.keys(selectedQuery.data[index][claveObj]);
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
              selectedQuery.data[index][claveObj][clavesCampos[indiceVon]].von;
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
      let objStcode = selectedQuery.data.filter(
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
        let data = selectedQuery;
        data["lote"] = localStorage.getItem("loteId");
        data["loader"] = true;

        let finalObject = {
          ...data,
          userValidityDate: userValidityDate,
          powerProfiles: powerProfiles,
          blockUsers: blockUsers,
          client: localStorage.getItem("clientName"),
        };
        const response = await authObject(finalObject)
        const blob = new Blob([response.data], { type: "text/csv" });
        saveAs(blob, `resultado_${name}.csv`);
        finalObject["loader"] = false;
        setUserValidityDate(!userValidityDate);
        setPowerProfiles(!powerProfiles);
        setBlockUsers(!blockUsers);
      } catch (error) {
        console.error("Error al llamar al backend:", error);
        this.setState({ loader: false });
      }
    }
  };

  const handleInputChange = (event) => {
    try {
      setInputValue2(event.target.value);
    } catch (error) {
      console.log(error, "error en el inputChange");
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  const agregar = () => {
    try {
      let array = [...selectedQuery.data];
      let lastId = -1;
      if (array.length !== 0) {
        lastId = array[array.length - 1].id;
      }
      array.push({
        "": {
          "": {
            id: 1,
            von: [""],
            switch: false,
          },
        },
        id: lastId + 1,
      });
      setSelectedQuery({ data: array });
    } catch (error) {
      console.log(error, "error en el agregar");
    }
  };

  const borrar = (indice) => {
    try {
      let Narray = selectedQuery.data;
      Narray.splice(indice, 1);
      setSelectedQuery({ data: Narray });
    } catch (error) {
      console.log(error, "error en el borrar");
    }
  };

  const deleteField = (indice, objeto, fieldName) => {
    try {
      let Narray = [...selectedQuery.data];
      delete Narray[indice][objeto][fieldName];
      setSelectedQuery({ data: Narray });
    } catch (error) {
      console.log(error, "error en el deleteField");
    }
  };

  const deleteVon = (indice, objeto, fieldName, posVon) => {
    try {
      let Narray = [...selectedQuery.data];
      Narray[indice][objeto][fieldName].von.splice(posVon, 1);
      setSelectedQuery({ data: Narray });
    } catch (error) {
      console.log(error, "error en el deleteVon");
    }
  };

  const updateRowObj = (id, value, index) => {
    try {
      let array = [...selectedQuery.data];
      let pos = -1;
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          pos = i;
          break;
        }
      }
      if (pos !== -1) {
        let objetoAguardar = { id: id };
        let nameObj = Object.keys(array[index]).filter((key) => key != "id");

        objetoAguardar[value.trim().toUpperCase()] = array[index][nameObj];
        array[index] = objetoAguardar;
        setSelectedQuery({ data: array });
      }
    } catch (error) {
      console.log(error, "error en el updateRowObj");
    }
  };

  const updateRowField = (objIndex, objVal, valores) => {
    try {
      let { name, ...newVal } = valores;
      let lista = [...selectedQuery.data];
      let campos = Object.keys(lista[objIndex][objVal]);
      if (campos.length === 0) {
        lista[objIndex][objVal][name] = newVal;
      } else {
        // Actualizar
        for (let i = 0; i < campos.length; i++) {
          if (lista[objIndex][objVal][campos[i]].id === newVal.id) {
            delete lista[objIndex][objVal][campos[i]];
            break;
          }
        }
        // Agregar
        lista[objIndex][objVal][name] = newVal;
      }
      setSelectedQuery({ data: lista });
    } catch (error) {
      console.log(error, "error en el updateRowField");
    }
  };

  const updateRowVon = (objIndex, objVal, fieldName, campoAct) => {
    try {
      let { name, ...campoSub } = campoAct;
      let lista = [...selectedQuery.data];
      lista[objIndex][objVal][fieldName] = campoSub;
      setSelectedQuery({ data: lista });
    } catch (error) {
      console.log(error, "error en el updateRowVon");
    }
  };

  const filtrar = (Todos) => {
    try {
      return Todos.filter((item) => item.client === client);
    } catch (error) {
      console.log(error, "error en el filtrar");
    }
  };

  return (
    <div>
      <select onChange={handleSelectChange} className="Seleccion">
        <option disabled selected value="">
          Selecciona una consulta de prueba
        </option>
        {consultData ? (
          filtrar(consultData).map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Loading...
          </option>
        )}
      </select>
      {selectedQuery && (
        <>
          <button onClick={handleOverwriteTable} className="Sobreescribir">
            Sobreescribir tabla
          </button>
          <button onClick={handleNewQuery} className="Crear">
            Crear nueva consulta
          </button>
          <button onClick={handleEjecutar} className="Ejecutar">
            Ejecutar
          </button>
          {showEditableTable2 && (
            <Row>
              <Col md="12">
                <Card className="card-plain table-plain-bg">
                  <Card.Header>
                    <Card.Title as="h4">Objetos de autorización</Card.Title>
                    <div className="label-input-container">
                      <div className="input-container">
                        <label htmlFor="inputValue" className="label1">
                          Nombre de la Consulta:
                        </label>
                        <input
                          type="text"
                          value={inputValue2}
                          onChange={(event) => handleInputChange(event)}
                        />
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                  <section className="filtros">
                        <h5>Filtros:</h5>
                        <Form.Check
                          onClick={() =>
                            setUserValidityDate(!userValidityDate)
                          }
                          ckecked={userValidityDate}
                          label={"Check user validity Date with 30/06/2023"}
                        />
                        <Form.Check
                          onClick={() =>
                            setPowerProfiles(!powerProfiles)
                          }
                          ckecked={powerProfiles}
                          label={"Exclude power profiles"}
                        />
                        <Form.Check
                          onClick={() =>
                            setBlockUsers(!blockUsers)
                          }
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
                          <th className="border-0">VALUE TO</th>
                          <th className="border-0">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuery.data.map((item, index) => (
                          <EditableTable
                            key={item.id}
                            datos={item}
                            index={index}
                            delete={(id) => borrar(id)}
                            deleteField={(indice, objeto, fieldName) =>
                              deleteField(indice, objeto, fieldName)
                            }
                            deleteVon={(indice, objeto, fieldName, posVon) =>
                              deleteVon(indice, objeto, fieldName, posVon)
                            }
                            updateObj={(id, value, index) =>
                              updateRowObj(id, value, index)
                            }
                            updateField={(objIndex, objVal, valores) =>
                              updateRowField(objIndex, objVal, valores)
                            }
                            updateRowVon={(
                              objIndex,
                              objVal,
                              fieldName,
                              campoAct
                            ) =>
                              updateRowVon(
                                objIndex,
                                objVal,
                                fieldName,
                                campoAct
                              )
                            }
                          />
                        ))}
                        <Button
                          className="Add"
                          variant="dark"
                          onClick={() => agregar()}
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
          )}
        </>
      )}
    </div>
  );
}

export default Consultas;
