import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3443",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gameToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  export const registerUser = async (data) => {
    try {
      const response = await instance.post("/register", data);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };  

  export const loginUser = async (data) => {
    try {
      const response = await instance.post("/login", data);
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  };

  export const getConsult = async (data) => {
    try {
      const response = await instance.post("/getConsult", data); 
      return response.data.data;
    } catch (error) {
      console.error("Error al editar los datos de la consulta:", error);
      throw error;
    }
  };
  
  export const addConsult = async (data) => {
    try {
      await instance.post("/addConsult", data); 
    } catch (error) {
      console.error("Error al agregar los datos de la consulta:", error);
      throw error;
    }
  };
  
  export const editConsult = async (data) => {
    try {
      await instance.post("/editConsult", data); 
    } catch (error) {
      console.error("Error al editar los datos de la consulta:", error);
      throw error;
    }
  };

  export const transaction = async () => {
    try {
      const response = await instance.get("/transaction");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los objetos de transacción:", error);
      throw error;
    }
  };

  export const transactionObjects = async (data) => {
    try {
      const response = await instance.post("/transactionObjetcs",data);
      return response;
    } catch (error) {
      console.error("Error obteneniedo los objetos de transaccion:", error);
      throw error;
    }
  };

  export const authObject = async (data) => {
    try {
      const response = await instance.post("/objectSearch", data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los objetos de autorización:", error);
      throw error;
    }
  };

  export const upload = async (data) => {
    try {
      const formData = new FormData();
      data.forEach((file) => {
        formData.append('files', file);
      }); 
      formData.append('lote',localStorage.getItem('loteId'))
      const response = await instance.post("/upload", formData,  {
        headers: {
            'Content-Type': 'multipart/form-data'
        },timeout: 0
    });
      return response
    } catch (error) {
      console.error("Error al obtener los objetos de autorización:", error);
      throw error;
    }

  };

  export const history = async (client) => {
    let obj = {cliente:client}
    try {
      const response = await instance.post("/history", obj);
      return response;
    } catch (error) {
      console.error("Error al obtener el historia de consultas:", error);
      throw error;
    }
  }

  export const getCsv = async (ruta) => {
    let obj = {route:ruta}
    try {
      const response = await instance.post("/historyCsv", obj, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Error al obtener el historia de consultas:", error);
      throw error;
    }
  }

  export const addClient = async (cliente) =>{
    let obj = {client:cliente}
    try {
      const response = await instance.post("/addClient", obj);
      return response;
    } catch (error) {
      console.error("Error al obtener añadir la consulta:", error);
      throw error;
    }
  }

  export const getClients = async () => {
    try {
      const response = await instance.post("/getClients");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      throw error;
    }
  }

  export const deleteClient = async (clientId) => {
  try {
    const response = await instance.delete(`/deleteClients/${clientId}`); // Corrección en la URL
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el cliente ${clientId}:`, error);
    throw error;
  }
};

  export const addLote = async (data) =>{
    let obj = {name:data.name,client:data.client}
    try {
      const response = await instance.post("/addLote", obj);
      localStorage.setItem("loteId",response.data.id);
      return response;
    } catch (error) {
      console.error("Error al obtener añadir el lote:", error);
      throw error;
    }
  }

  export const getLote = async (id) =>{
    let obj = {clientId: id}
    try {
      const response = await instance.post("/getLote",obj);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      throw error;
    }
  }
