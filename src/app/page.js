"use client";
import React, { useState } from "react";
import fs from "fs";

export default function Home() {
  const [fileContent, setFileContent] = useState("");
  const [xmlContent, setXmlContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");

  // Función para leer el archivo de texto
  const leerArchivoTexto = (event) => {
    const file = event.target.files[0];
    // Verificar si es un archivo de texto
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      console.log("El archivo seleccionado no es un archivo de texto.");
    }
  };

  // Función para leer el archivo XML
  const leerArchivoXML = (event) => {
    const file = event.target.files[0];
    // Verificar si es un archivo XML
    if (file.type === "text/xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setXmlContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      console.log("El archivo seleccionado no es un archivo XML.");
    }
  };

  // Función para leer el archivo JSON
  const leerArchivoJSON = (event) => {
    const file = event.target.files[0];
    // Verificar si es un archivo JSON
    if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonContent(e.target.result);
      };
      reader.readAsText(file);
    } else {
      console.log("El archivo seleccionado no es un archivo JSON.");
    }
  };

  // Función para generar el documento XML
  const generarDocumentoXML = () => {
    const lineas = fileContent.split("\n");
    const xml = [];

    xml.push('<?xml version="1.0" encoding="UTF-8"?>');
    xml.push("<root>");

    lineas.forEach((linea) => {
      const campos = linea.split(";");
      if (campos.length >= 3) {
        xml.push("  <registro>");
        xml.push(`    <campo1>${campos[0]}</campo1>`);
        xml.push(`    <campo2>${campos[1]}</campo2>`);
        xml.push(`    <campo3>${campos[2]}</campo3>`);
        // Agrega más campos si es necesario

        xml.push("  </registro>");
      }
    });

    xml.push("</root>");

    setXmlContent(xml.join("\n"));
  };

  // Función para generar el archivo JSON
  const generarArchivoJSON = () => {
    const lineas = fileContent.split("\n");
    const registros = [];

    lineas.forEach((linea) => {
      const campos = linea.split(";");
      if (campos.length >= 3) {
        const registro = {
          campo1: campos[0],
          campo2: campos[1],
          campo3: campos[2],
          // Agrega más campos si es necesario
        };
        registros.push(registro);
      }
    });

    const contenidoJSON = JSON.stringify(registros, null, 2);
    setJsonContent(contenidoJSON);
  };

  // Función para generar el archivo de texto a partir del XML
  const generarArchivoTextoDeXML = () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    const registros = xmlDoc.getElementsByTagName("registro");
    let contenidoTexto = "";

    for (let i = 0; i < registros.length; i++) {
      const registro = registros[i];
      const campo1 = registro.querySelector("campo1").textContent;
      const campo2 = registro.querySelector("campo2").textContent;
      const campo3 = registro.querySelector("campo3").textContent;
      // Obtén más campos si es necesario

      const linea = `${campo1};${campo2};${campo3}\n`;
      contenidoTexto += linea;
    }

    setFileContent(contenidoTexto);
  };

  // Función para generar el archivo de texto a partir del JSON
  const generarArchivoTextoDeJSON = () => {
    const jsonData = JSON.parse(jsonContent);
    let contenidoTexto = "";

    jsonData.forEach((registro) => {
      const linea = `${registro.campo1};${registro.campo2};${registro.campo3}\n`;
      contenidoTexto += linea;
    });

    setFileContent(contenidoTexto);
  };

  // Función para guardar el documento XML
  const descargarDocumentoXML = () => {
    const element = document.createElement("a");
    const file = new Blob([xmlContent], { type: "text/xml" });
    element.href = URL.createObjectURL(file);
    element.download = "documento.xml";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Documento XML generado y descargado correctamente.");
  };

  // Función para descargar el archivo JSON
  const descargarArchivoJSON = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonContent], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "datos.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Archivo JSON generado y descargado correctamente.");
  };

  // Función para descargar el archivo de texto
  const descargarArchivoTexto = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "documento.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Archivo de texto generado y descargado correctamente.");
  };

  return (
    <main className="flex flex-col items-center justify-center p-20 w-full h-full">
      <h1 className="text-4xl font-rubik font-bold">Convertidor de archivos</h1>
      <div className="flex flex-col gap-10">
        <div className=" grid grid-cols-3 w-full justify-between items-center gap-20">
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Generador de Archivos de texto a XML o JSON</label>
            <input
              className="file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80"
              type="file"
              onChange={leerArchivoTexto}
            />
            <div className="flex justify-between mt-2 gap-2">
              <button
                className="bg-blue-300 p-4 rounded-xl"
                onClick={generarDocumentoXML}
              >
                Generar XML
              </button>
              <button
                className="bg-blue-300 p-4 rounded-xl"
                onClick={generarArchivoJSON}
              >
                Generar JSON
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Generador de Archivos XML a Texto</label>
            <input
              className="file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80"
              type="file"
              onChange={leerArchivoXML}
            />
            <div className="flex justify-between mt-2 gap-2">
              <button
                className="bg-blue-300 p-4 rounded-xl"
                onClick={generarArchivoTextoDeXML}
              >
                Generar archivo de texto desde un XML
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2  border-r-4 p-2 justify-center">
            <label>Generador de Archivos JSON a Texto</label>
            <input
              className="file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80"
              type="file"
              onChange={leerArchivoJSON}
            />
            <div className="flex justify-between mt-2  gap-2">
              <button
                className="bg-blue-300 p-4 rounded-xl"
                onClick={generarArchivoTextoDeJSON}
              >
                Generar archivo de texto desde un JSON
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center ">
          <div className="flex justify-around w-full h-full border-r-4 p-2">
            <button
              className="bg-blue-300 p-4 rounded-xl"
              onClick={descargarDocumentoXML}
            >
              Guardar XML
            </button>
            <button
              className="bg-blue-300 p-4 rounded-xl"
              onClick={descargarArchivoJSON}
            >
              Guardar JSON
            </button>
            <button
              className="bg-blue-300 p-4 rounded-xl"
              onClick={descargarArchivoTexto}
            >
              Guardar txt
            </button>
          </div>
        </div>
        <div className="font-rubik">
          <label>Previsualización de arhivo .txt</label>
          <textarea
            className="h-40 rounded-xl p-4 w-full bg-blue-100"
            value={fileContent}
            readOnly
          />
        </div>
        <div className="font-rubik">
          <label>Previsualización de arhivo .XML</label>
          <textarea
            className="h-40 rounded-xl p-4 w-full bg-blue-100"
            value={xmlContent}
            readOnly
          />
        </div>
        <div className="font-rubik">
          <label>Previsualización de arhivo .JSON</label>
          <textarea
            className="h-40 rounded-xl p-4 w-full bg-blue-100"
            value={jsonContent}
            readOnly
          />
        </div>
      </div>
    </main>
  );
}
