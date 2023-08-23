import { React, useState, useEffect } from "react";
import "./config.css";
import { Form, Button } from "react-bootstrap";
import {
  addClient,
  getClients,
  deleteClient,
  getLote,
} from "../../Services/apiService";

const Welcome = () => {
  const [clientes, setClientes] = useState([]);
  const [name, setName] = useState("");
  const [clientToDelete, setClientToDelete] = useState(null);
  const [lotesPorCliente, setLotesPorCliente] = useState({});

  const agregarCliente = async () => {
    let arrName = clientes.filter(
      (cliente) => cliente.name.toUpperCase() === name.toUpperCase()
    );
    if (arrName.length === 0) {
      try {
        await addClient(name).then((result) => console.log(result));
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("El cliente " + name + " ya existe");
    }
  };

  const getClientes = async () => {
    try {
      const result = await getClients();
      setClientes(result.data);

      // Obtén la información de los lotes por cada cliente
      const lotesInfo = {};
      for (const client of result.data) {
        const lotes = await getLote(client.id);
        lotesInfo[client.id] = lotes.data.length; // Almacena la cantidad de lotes en el objeto
      }
      setLotesPorCliente(lotesInfo);
    } catch (error) {
      console.log(error, "error en el getClientes");
    }
  };

  const deleteClients = async (clientId) => {
    try {
      await deleteClient(clientId); // Utiliza deleteClient en lugar de deleteClients
      setClientToDelete(null);
      getClientes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (clientes.length === 0) {
        getClientes();
      }
    } catch (error) {
      console.log(error, "error en el useEffect");
    }
  });

  useEffect(() => {
    try {
      if (clientToDelete !== null) {
        deleteClients(clientToDelete);
      }
    } catch (error) {
      console.log(error, "error en el useEffect2");
    }
  }, [clientToDelete]);

  const items = clientes.map((client) => {
    return (
      <tr key={client.id}>
        <td>{client.name}</td>
        <td>{lotesPorCliente[client.id]}</td>
        <td>
          <button onClick={() => setClientToDelete(client.id)}>Eliminar</button>
        </td>
      </tr>
    );
  });

  return (
    <div className="containerConfig">
      <h2>Configuracion</h2>
      <h4>Añadir Cliente</h4>
      <Form className="form">
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Cliente"
        />
        <Button
          onClick={() => agregarCliente()}
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </Form>
      <h4>Clientes Actuales</h4>
      <table style={{ marginTop: "2%" }} className="table-hover">
        <thead>
          <tr>
            <th className="border-0">Nombre</th>
            <th className="border-0">Cantidad de lotes</th>
            <th className="border-0">Acciones</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
};

export default Welcome;
