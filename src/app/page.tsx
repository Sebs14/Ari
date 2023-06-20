"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

enum Types {
  XML = "XML",
  JSON = "JSON",
  TXT = "TXT",
}

export type Inputs = {
  secret: string;
  separator: string;
  type: Types;
  origen: FileList;
  destino: FileList;
};

export default function Home() {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [origenText, setOrigenText] = useState<string>("");
  const [destinoFile, setDestinoFile] = useState<Blob>();
  const [destinoText, setDestinoText] = useState<string>("");
  const [destinoType, setDestinoType] = useState<Types>();
  const [destinoName, setDestinoName] = useState<string>("destino");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  // Función para enviar el archivo al backend
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const fromFileType = data.origen[0].type;
    const toFileType = data.type;

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

    let url = `${API_URL}/fileConverter`;

    if (fromFileType === "text/plain" && toFileType === Types.JSON) {
      url += "/txtToJson";
      setDestinoType(Types.JSON);
    } else if (fromFileType === "text/plain" && toFileType === Types.XML) {
      url += "/txtToXml";
      setDestinoType(Types.XML);
    } else if (fromFileType === "text/xml" && toFileType === Types.TXT) {
      url += "/xmlToTxt";
      setDestinoType(Types.TXT);
    } else if (fromFileType === "application/json" && toFileType === Types.TXT) {
      url += "/jsonToTxt";
      setDestinoType(Types.TXT);
    } else {
      console.log("error");
    }

    const formData = new FormData();

    formData.append("file", data.origen[0]);
    formData.append("secret", data.secret);
    formData.append("separator", data.separator);

    try {
      const response = await axios.post(url, formData);
      console.log({response: response.data});
      
      if (response.status >= 400) {
        throw new Error();
      }

      if(toFileType === Types.JSON){
        const jsonOne = response.data[0]
      

        if (response.status >= 400) {
          throw new Error();
        }

        const dotIndex = data.origen[0].name.indexOf(".");
        setDestinoName(data.origen[0].name.substring(0, dotIndex));

        const file = await new Blob([JSON.stringify(response.data)])
        setDestinoFile(file);

        const text = await file.text();
        setDestinoText(text);
        return
      }

      const dotIndex = data.origen[0].name.indexOf(".");
      setDestinoName(data.origen[0].name.substring(0, dotIndex));

      const file = await new Blob([response.data])
      setDestinoFile(file);

      const text = await file.text();
      setDestinoText(text);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para descargar el archivo convertido
  const downloadFile = () => {
    if (!destinoFile) return;

    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(destinoFile);
    link.download = destinoName;

    if (destinoType === Types.JSON) link.download += ".json";
    else if (destinoType === Types.XML) link.download += ".xml";
    else if (destinoType === Types.TXT) link.download += ".txt";

    link.click();

    setIsDownloading(false);
  };

  const handleCambioDeOrigen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    const reader = new FileReader();

    try{
      reader.onload = () => {
        const text = reader.result;
        if (typeof text === "string") setOrigenText(text);
      };
      reader.readAsText(file);

    } catch {
      
    }

  };

  // // Función para leer el archivo de texto
  // const leerArchivoTexto = (event) => {
  //   const file = event.target.files[0];
  //   // Verificar si es un archivo de texto
  //   if (file.type === "text/plain") {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setFileContent(e.target.result);
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     console.log("El archivo seleccionado no es un archivo de texto.");
  //   }
  // };

  // // Función para leer el archivo XML
  // const leerArchivoXML = (event) => {
  //   const file = event.target.files[0];
  //   // Verificar si es un archivo XML
  //   if (file.type === "text/xml") {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setXmlContent(e.target.result);
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     console.log("El archivo seleccionado no es un archivo XML.");
  //   }
  // };

  // // Función para leer el archivo JSON
  // const leerArchivoJSON = (event) => {
  //   const file = event.target.files[0];
  //   // Verificar si es un archivo JSON
  //   if (file.type === "application/json") {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setJsonContent(e.target.result);
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     console.log("El archivo seleccionado no es un archivo JSON.");
  //   }
  // };

  // // Función para generar el documento XML
  // const generarDocumentoXML = () => {
  //   const lineas = fileContent.split("\n");
  //   const xml = [];

  //   xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  //   xml.push("<root>");

  //   lineas.forEach((linea) => {
  //     const campos = linea.split(";");
  //     if (campos.length >= 3) {
  //       xml.push("  <registro>");
  //       xml.push(`    <campo1>${campos[0]}</campo1>`);
  //       xml.push(`    <campo2>${campos[1]}</campo2>`);
  //       xml.push(`    <campo3>${campos[2]}</campo3>`);
  //       // Agrega más campos si es necesario

  //       xml.push("  </registro>");
  //     }
  //   });

  //   xml.push("</root>");

  //   setXmlContent(xml.join("\n"));
  // };

  // // Función para generar el archivo JSON
  // const generarArchivoJSON = () => {
  //   const lineas = fileContent.split("\n");
  //   const registros = [];

  //   lineas.forEach((linea) => {
  //     const campos = linea.split(";");
  //     if (campos.length >= 3) {
  //       const registro = {
  //         campo1: campos[0],
  //         campo2: campos[1],
  //         campo3: campos[2],
  //         // Agrega más campos si es necesario
  //       };
  //       registros.push(registro);
  //     }
  //   });

  //   const contenidoJSON = JSON.stringify(registros, null, 2);
  //   setJsonContent(contenidoJSON);
  // };

  // // Función para generar el archivo de texto a partir del XML
  // const generarArchivoTextoDeXML = () => {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  //   const registros = xmlDoc.getElementsByTagName("registro");
  //   let contenidoTexto = "";

  //   for (let i = 0; i < registros.length; i++) {
  //     const registro = registros[i];
  //     const campo1 = registro.querySelector("campo1").textContent;
  //     const campo2 = registro.querySelector("campo2").textContent;
  //     const campo3 = registro.querySelector("campo3").textContent;
  //     // Obtén más campos si es necesario

  //     const linea = `${campo1};${campo2};${campo3}\n`;
  //     contenidoTexto += linea;
  //   }

  //   setFileContent(contenidoTexto);
  // };

  // // Función para generar el archivo de texto a partir del JSON
  // const generarArchivoTextoDeJSON = () => {
  //   const jsonData = JSON.parse(jsonContent);
  //   let contenidoTexto = "";

  //   jsonData.forEach((registro) => {
  //     const linea = `${registro.campo1};${registro.campo2};${registro.campo3}\n`;
  //     contenidoTexto += linea;
  //   });

  //   setFileContent(contenidoTexto);
  // };

  // // Función para guardar el documento XML
  // const descargarDocumentoXML = () => {
  //   const element = document.createElement("a");
  //   const file = new Blob([xmlContent], { type: "text/xml" });
  //   element.href = URL.createObjectURL(file);
  //   element.download = "documento.xml";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  //   console.log("Documento XML generado y descargado correctamente.");
  // };

  // // Función para descargar el archivo JSON
  // const descargarArchivoJSON = () => {
  //   const element = document.createElement("a");
  //   const file = new Blob([jsonContent], { type: "application/json" });
  //   element.href = URL.createObjectURL(file);
  //   element.download = "datos.json";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  //   console.log("Archivo JSON generado y descargado correctamente.");
  // };

  // // Función para descargar el archivo de texto
  // const descargarArchivoTexto = () => {
  //   const element = document.createElement("a");
  //   const file = new Blob([fileContent], { type: "text/plain" });
  //   element.href = URL.createObjectURL(file);
  //   element.download = "documento.txt";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  //   console.log("Archivo de texto generado y descargado correctamente.");
  // };

  return (
    <main className="flex flex-col items-center justify-center p-20 w-full h-screen">
      <h1 className="text-3xl font-rubik font-bold mb-10">
        Convertidor de archivos
      </h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className=" grid grid-cols-4 w-full justify-between items-end gap-20">
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Seleccione un archivo archivo .txt .xml .json</label>
            <input
              className="file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80"
              type="file"
              id="origen"
              {...register("origen")}
              onChange={handleCambioDeOrigen}
            />
          </div>
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Escribe una frase</label>
            <input
              id="secret"
              className="bg-ari-gray p-2 rounded border border-solid border-ari-black w-full"
              placeholder="Escribe una frase"
              {...register("secret", { required: true })}
            />
            {errors.secret && errors.secret.type === "required" && (
              <span role="alert" className="pt-1 text-red-500">
                Campo requerido
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Escribe el delimitador a usar</label>
            <input
              id="separator"
              className="bg-ari-gray p-2 rounded border border-solid border-ari-black w-full"
              placeholder="Escribe un delimitador"
              {...register("separator", { required: true })}
            />
            {errors.separator && errors.separator.type === "required" && (
              <span role="alert" className="pt-1 text-red-500">
                Campo requerido
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 border-r-4 p-2 justify-center">
            <label>Selecciona el tipo de archivo a convertir</label>
            <select
              className="bg-ari-gray p-2 rounded border border-solid border-ari-black w-full"
              placeholder="Escribe un delimitador"
              {...register("type", { required: true })}
            >
              <option value="selecciona un campo" disabled hidden>
                selecciona un campo
              </option>
              <option value="XML">.xml</option>
              <option value="JSON">.json</option>
              <option value="TXT">.txt</option>
            </select>
            {errors.type && errors.type.type === "required" && (
              <span role="alert" className="pt-1 text-red-500">
                Campo requerido
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="bg-ari-gray rounded border border-solid border-ari-black w-fit h-[30.8px] px-2"
          onClick={downloadFile}
          disabled={isDownloading}
        >
          Descargar Documento
        </button>
        <div className="font-rubik">
          <label>Previsualización de arhivo cargado</label>
          <textarea
            className="h-40 rounded-xl p-4 w-full bg-blue-100"
            value={origenText}
            readOnly
          />
        </div>
        <div className="font-rubik">
          <label>Previsualización de arhivo generado</label>
          <textarea
            className="h-40 rounded-xl p-4 w-full bg-blue-100"
            value={destinoText}
            readOnly
          />
        </div>
        <input
          className="bg-ari-gray p-2 rounded border border-solid border-ari-black"
          type="submit"
        />
      </form>
    </main>
  );
}
