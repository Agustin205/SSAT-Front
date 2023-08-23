import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { upload, addLote } from "../../Services/apiService";

const Data = () => {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".txt"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setFilter(false);
    },
  });

  const arrayTablas = [
    "adrp.txt",
    "agr_1251.txt",
    "agr_prof.txt",
    "agr_users.txt",
    "t000_des_200.txt",
    "t000_des_300.txt",
    "t000_pro.txt",
    "t000_qua.txt",
    "usobt_c.txt",
    "usr02.txt",
    "usr03.txt",
    "usr04.txt",
    "usr11.txt",
    "usr13.txt",
    "usr21.txt",
    "ust04.txt",
    "ust10c.txt",
    "ust10s.txt",
    "ust12.txt",
  ];

  useEffect(() => {
    try {
      if (files.length > 0 && filter === false) {
        let copiaFiles = [...acceptedFiles];
        let acceptedFilesFilter = copiaFiles
          .filter((file) => arrayTablas.includes(file.name.toLowerCase()))
          .map((file) => {
            file.checked = true;
            return file;
          });
        setFiles(acceptedFilesFilter);
        setFilter(true);
      }
    } catch (error) {
      console.log(error, "error en el useEffect");
    }
  }, [files]);

  const check = (index) => {
    try {
      let copiaFiles = [...files];
      copiaFiles[index].checked = !copiaFiles[index].checked;
      setFiles(copiaFiles);
    } catch (error) {
      console.log(error, "error en el check");
    }
  };

  const acceptedFileItems = files.map((file, index) => {
    return (
      <tr key={file.path}>
        <td>{file.name}</td>
        <td>{file.size} bytes</td>
        <td>
          <input
            checked={file.checked}
            onChange={() => check(index)}
            type="checkbox"
            name={file.name}
          />
        </td>
      </tr>
    );
  });

  const handle = async () => {
    const tablasAsubir = files.filter((file) => file.checked === true);
    try {
      await upload(tablasAsubir).then((result) => {
        alert("Tablas insertadas");
        setLoader(false);
        window.location.reload();
      });
    } catch (error) {
      setLoader(false);
      alert("Error al subir las tablas");
      console.log(error, "error en el handle");
    }
  };

  const handleLote = async () => {
    let obj = { name: name, client: localStorage.getItem("clientId") };
    try {
      setLoader(true);
      await addLote(obj).then((result) => {
        handle();
      });
    } catch (error) {
      setLoader(false);
      alert("Error al cargar el lote");
      console.log(error, "error en el handleLote");
    }
  };

  const insertarTablas = () => {
    try {
      if (files.length > 0) {
        if (name !== "") {
          handleLote();
        } else {
          alert("Ingrese un nombre para el lote");
        }
      } else {
        alert("Primero subir carpeta con tablas");
      }
    } catch (error) {
      console.log(error, "error en el insertarTablas");
    }
  };

  return (
    <section className="container">
      {loader ? (
        <h2>Cargando...</h2>
      ) : (
        <>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Arrastrar los archivos aquí</p>
            <em>(Solo .txt seran aceptados)</em>
          </div>
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Form.Control
              style={{ margin: 0, width: "20%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Nombre lote"
            />
            <h4>Archivos Aceptados</h4>
            <table className="table-hover">
              <thead>
                <tr>
                  <th className="border-0">Name</th>
                  <th className="border-0">Size</th>
                  <th className="border-0">Select</th>
                </tr>
              </thead>
              <tbody>{acceptedFileItems}</tbody>
            </table>
            <Button
              style={{ width: "50%", marginTop: "3%" }}
              variant="primary"
              onClick={() => insertarTablas()}
            >
              Insertar tablas
            </Button>
            {loader ? <h2>Cargando...</h2> : <></>}
          </aside>
        </>
      )}
    </section>
  );
};

export default Data;
