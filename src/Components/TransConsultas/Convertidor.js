import React from "react";

export function convertData(inputData) {
  try {
    let transformedData = []
  let arrObj = []
  //{ "obj": "AAA","field": "BBB","von": "CCC","vot": "","switch": false,"id": 53}
  
  for (let i = 0; i < inputData.length; i++) {
    let {obj} = inputData[i] 
    if(!arrObj.includes(obj)) {
      arrObj.push(obj)
    }
  }

  for (let j = 0; j < arrObj.length; j++) {
    let objetoLiteral = {}
    objetoLiteral[arrObj[j]] = {}
    objetoLiteral['id'] = j
    transformedData.push(objetoLiteral)
  }
  
  for (let l = 0; l < inputData.length; l++) {
    let {obj,field} = inputData[l] 
    let posicion = arrObj.indexOf(obj) 
    let cantField = [...Object.keys(transformedData[posicion][obj])].length
    let sw = inputData[l].switch
    let objField = {id:cantField+1,von:[],switch:sw}
    if(transformedData[posicion][obj][field] === undefined){
      transformedData[posicion][obj][field] = objField //Asumiendo que no se repitio field
    }
  }

  for (let q = 0; q < inputData.length; q++) {
    let {obj,field,von} = inputData[q] 
    let posicion = arrObj.indexOf(obj) 
    transformedData[posicion][obj][field].von.push(von)
  }

  return transformedData;
  } catch (error) {
    console.log(error, "error en el convertData");
    return [];
  }
}