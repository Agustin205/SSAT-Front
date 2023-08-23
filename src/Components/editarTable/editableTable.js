import React, { Component } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import "./editableTable.css";
class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obj: {},
      files: [],
      delete: false,
    };
  }

  componentDidMount() {
    try {
      this.setState({ obj: this.props.datos });
      const listaActual = [];
      for (const key1 in this.props.datos) {
        if (
          this.props.datos.hasOwnProperty(key1) &&
          typeof this.props.datos[key1] === "object"
        ) {
          for (const key2 in this.props.datos[key1]) {
            if (
              this.props.datos[key1].hasOwnProperty(key2) &&
              typeof this.props.datos[key1][key2] === "object"
            ) {
              const {
                id,
                von,
                switch: switchValue,
              } = this.props.datos[key1][key2];
              const file = {
                id: listaActual.length + 1,
                name: key2,
                von: [...von],
                switch: switchValue !== undefined ? switchValue : false,
              };
              listaActual.push(file);
            }
          }
        }
      }

      this.setState({ files: listaActual });
    } catch (error) {
      console.log(error, "error en el componentDidMount");
    }
  }

  agregarFile() {
    try {
      let listaActual = this.state.files;
      let file = {};
      let maxId = 0;
      if (listaActual.length > 0) {
        for (let i = 0; i < listaActual.length; i++) {
          if (listaActual[i].id > maxId) {
            maxId = listaActual[i].id;
          }
        }
      }
      file.id = maxId + 1;
      file.von = [""];
      file.switch = false;
      file.name = "";
      listaActual.push(file);
      this.setState({ files: listaActual });
    } catch (error) {
      console.log(error, "error en el agregarFile");
    }
  }

  agregarListaVon(index) {
    try {
      let listaCompleta = this.state.files;
      let listaValsField = listaCompleta[index].von;
      let obj = "";
      listaValsField.push(obj);
      listaCompleta[index].von = listaValsField;
      this.setState({ files: listaCompleta });
    } catch (error) {
      console.log(error, "error en el agregarListaVon");
    }
  }

  obtenerValObj() {
    try {
      let valObj = "";
      let claves = Object.keys(this.props.datos);
      if (claves.length > 1) {
        let i = 0;
        while (i < claves.length) {
          if (claves[i] != "id") {
            break;
          } else {
            i++;
          }
        }
        valObj = claves[i]; //Guardo el valor
      }
      return valObj;
    } catch (error) {
      console.log(error, "error en el obtenerValObj");
    }
  }

  actualizarValorField(indexFile, txt) {
    try {
      if (this.obtenerValObj() !== "") {
        let campos = this.state.files;
        campos[indexFile].name = txt.toUpperCase();
        this.setState({ files: campos });
        this.props.updateField(
          this.props.index,
          this.obtenerValObj(),
          campos[indexFile]
        );
      } else {
        alert("El objeto debe tener valor");
      }
    } catch (error) {
      console.log(error, "error en el actualizarValorField");
    }
  }

  actualizarVon(fieldIndex, vonIndex, value) {
    try {
      let lista = this.state.files;
      let name = lista[fieldIndex].name;
      if (this.obtenerValObj() !== "") {
        lista[fieldIndex].von[vonIndex] = value.toUpperCase();
        this.setState({ files: lista });
        this.props.updateRowVon(
          this.props.index,
          this.obtenerValObj(),
          name,
          lista[fieldIndex]
        );
      } else {
        alert("El objeto debe tener valor");
      }
    } catch (error) {
      console.log(error, "error en el actualizarVon");
    }
  }

  switchState(indiceCampo) {
    try {
      let lista = this.state.files;
      if (lista[indiceCampo].name === "") {
        alert("Para activar/desactivar el switch el FIELD debe tener valor");
      } else {
        lista[indiceCampo].switch = !lista[indiceCampo].switch;
        this.setState({ files: lista });
        this.props.updateField(
          this.props.index,
          this.obtenerValObj(),
          lista[indiceCampo]
        );
      }
    } catch (error) {
      console.log(error, "error en el switchState");
    }
  }

  deleteFieldInt(indice, name) {
    try {
      if (this.obtenerValObj() !== "") {
        let lista = this.state.files;
        lista.splice(indice, 1);
        this.setState({ files: lista });
        this.props.deleteField(this.props.index, this.obtenerValObj(), name);
      } else {
        alert("Ingrese primero el nombre del objeto!");
      }
    } catch (error) {
      console.log(error, "error en el deleteFieldInt");
    }
  }

  deleteVonInt(indiceField, fieldName, indiceVon) {
    try {
      if (this.obtenerValObj() !== "") {
        let lista = this.state.files;
        let Nvon = lista[indiceField].von.filter(
          (val, index) => index != indiceVon
        );
        lista[indiceField].von = Nvon;
        this.setState({ files: lista });
        this.props.deleteVon(
          this.props.index,
          this.obtenerValObj(),
          fieldName,
          indiceVon
        );
      } else {
        alert("Ingrese primero el nombre del objeto!");
      }
    } catch (error) {
      console.log(error, "error en el deleteVonInt");
    }
  }

  deleteObj() {
    try {
        this.props.delete(this.props.index);
    } catch (error) {
        console.log(error, "error en el deleteObj");
    }
  }

  render() {
    return (
      <>
        <tr>
          <td>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  value={this.obtenerValObj()}
                  className="campo"
                  placeholder="OBJ AUTH"
                  onChange={(e) =>
                    this.props.updateObj(
                      this.props.datos.id,
                      e.target.value,
                      this.props.index
                    )
                  }
                />
              </InputGroup>
            </Form.Group>
          </td>
          <td>
            <Button onClick={() => this.agregarFile()} variant="success">
              Agregar Field
            </Button>
          </td>
          <td></td>
          <td></td>
          <td>
            <Button onClick={() => this.deleteObj()} variant="danger">
              Delete
            </Button>{" "}
          </td>
        </tr>
        {this.state.files.map((file, index) => {
          return (
            <>
              <tr key={file.id}>
                <td>{this.obtenerValObj()}</td>
                <td>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        value={file.name}
                        className="campo"
                        placeholder="FIELD"
                        onChange={(e) =>
                          this.actualizarValorField(index, e.target.value)
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </td>
                <td>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        value={file.von[0]}
                        className="campo"
                        placeholder="VON"
                        onChange={(e) =>
                          this.actualizarVon(index, 0, e.target.value)
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </td>
                <td>
                  <Button onClick={() => this.agregarFile()} variant="success">
                    Agregar Field
                  </Button>
                  <Button
                    style={{ marginTop: "2%" }}
                    onClick={() => this.agregarListaVon(index)}
                    variant="success"
                  >
                    Agregar VON
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={() => this.deleteFieldInt(index, file.name)}
                    variant="danger"
                  >
                    Delete
                  </Button>{" "}
                  <Form.Check
                    checked={this.state.files[index].switch}
                    type="switch"
                    id="custom-switch"
                    onClick={() => this.switchState(index)}
                  />{" "}
                </td>
              </tr>
              {this.state.files[index].von.map((von, indexVon) => {
                return indexVon === 0 ? (
                  <></>
                ) : (
                  <tr key={indexVon}>
                    <td>{this.obtenerValObj()}</td>
                    <td>{file.name}</td>
                    <td>
                      <Form.Group>
                        <InputGroup>
                          <Form.Control
                            value={von}
                            className="campo"
                            placeholder="VON"
                            onChange={(e) =>
                              this.actualizarVon(
                                index,
                                indexVon,
                                e.target.value
                              )
                            }
                          />
                        </InputGroup>
                      </Form.Group>
                    </td>
                    <td></td>
                    <td>
                      <Button
                        onClick={() =>
                          this.deleteVonInt(index, file.name, indexVon)
                        }
                        variant="danger"
                      >
                        Delete
                      </Button>{" "}
                    </td>
                  </tr>
                );
              })}
            </>
          );
        })}
      </>
    );
  }
}
export default EditableTable;
