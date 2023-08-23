import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; // YA NO SE USA

function Modall({ onSave, data, onClose }) {
  const [newData, setNewData] = useState({ ...data });
  const isObjDestroyed = newData.obj === undefined || newData.obj === null; // Verifica si el valor de 'obj' se ha destruido

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setNewData({ ...newData, [name]: value.toUpperCase() });
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setNewData({ ...newData, [name]: checked });
  };

  const handleSaveClick = () => {
    console.log('Datos actualizados:', newData);
    onSave(newData);
    onClose();
  };

  return (
    <>
      <Modal
        show={onSave}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isObjDestroyed && ( // Verifica si el valor de 'obj' se ha destruido antes de mostrar el campo
            <div>
              <label htmlFor="obj">Obj:</label>
              <input
                type="text"
                id="obj"
                name="obj"
                value={newData.obj}
                onChange={handleFieldChange}
              />
            </div>
          )}
          <div>
            <label htmlFor="field">Field:</label>
            <input
              type="text"
              id="field"
              name="field"
              value={newData.field}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <label htmlFor="von">Von:</label>
            <input
              type="text"
              id="von"
              name="von"
              value={newData.von}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <label htmlFor="vot">Vot:</label>
            <input
              type="text"
              id="vot"
              name="vot"
              value={newData.vot}
              onChange={handleFieldChange}
            />
          </div>
          <div>
            <label htmlFor="switch">Switch:</label>
            <input
              type="checkbox"
              id="switch"
              name="switch"
              checked={newData.switch}
              onChange={handleSwitchChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modall;