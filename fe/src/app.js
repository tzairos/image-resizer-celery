import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./demo.css";
import axios from "axios";

const ReactUploader = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [result, setResult] = useState();
  const [resultThumbImagePath, setResultThumbImagePath] = useState();
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", selectedFile, selectedFile.name);

    // Details of the uploaded file
    console.log(selectedFile);

    // Request made to the backend api
    // Send formData object

    axios.post("http://localhost:3000/uploadfile", formData).then(
      (response) => {
        console.log(response);
        if (response.data && response.data.resultId) {
          setResult(response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };


 

  const onResultCheck = () => {
    axios
      .get("http://localhost:3000/getResult?id=" + result.resultId)
      .then((response) => {
        if(response && response.data && response.data.status && response.data.status=='ready'){
            setResultThumbImagePath(response.data.path);
            const resultTemp={...result,status:'ready'}
            setResult(resultTemp);
        }
      },
      (error) => {
        console.log(error);
      });
  };

  const resultThumbInfo=()=>{
      if(resultThumbImagePath)
      {
          return(
              <React.Fragment>
                  <h1>Thumb Image</h1>
                  <img src={resultThumbImagePath}/>
              </React.Fragment>
            
          )
      }
  }

  const resultInfo = () => {
    if (result && result.resultId) {
      return (
        <React.Fragment>
          <div>
            <span>{result.resultId}</span>
            <span>| {result.status}</span>
          </div>
          <div>
            <button onClick={onResultCheck}>Check image status </button>
          </div>
        </React.Fragment>
      );
    }
  };

  const fileInfo = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose file</h4>
        </div>
      );
    }
  };

  return (
    <div className="flex-container">
      <h1>File Uploader</h1>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload image </button>
      </div>
      {fileInfo()}
      {result && resultInfo()}
      {selectedFile && <img src={preview} />}
      {resultThumbImagePath && resultThumbInfo()}
    </div>
  );
};
ReactDOM.render(<ReactUploader />, document.getElementById("app"));
