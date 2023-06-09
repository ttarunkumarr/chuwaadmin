import React, { useState, useEffect, useRef } from "react";
import { auth, storage } from "../config";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Navbar from "../Components/Navbar";
import "./Home.css";
import "./Table.css";
import DeleteTable from "./DeleteTable";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function Home() {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [newValue, setnewValue] = useState("");
  const history = useHistory();
  const [Name, setName] = useState("");
const p=()=>{
  history.push({
    pathname: "/linkgen",
   
  });
}
  const [numbers, setNumbers] = useState(
    Array.from({ length: 30 }, (_, i) => i)
  );
  const selectOptionRef = useRef(null);
  const selectNumberRef = useRef(null);
  const textAreaRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [Visible, setVisible] = useState(false);
  const buttons = [{ text: "Logout" }];
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "options"), (snapshot) => {
      const optionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOptions(optionsData);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleOptionChange = (event) => {
    setNewOption(event.target.value);
  };

  const handleOptionChange1 = (event) => {
    setnewValue(event.target.value);
  };
  const handleAddOption = () => {
    const optionName = prompt("Enter a new option:");
    if (optionName !== null && optionName.trim() !== "") {
    
      const existingOption = options.find(
        (option) => option.name === optionName
      );
      if (existingOption) {
        alert("Option already exists!");
        return;
      }
      setUploading(true);
      const optionsCollection = collection(db, "options");
      const newOptionData = { name: optionName };
      addDoc(optionsCollection, newOptionData);
      setUploading(false);
    }
  };
  const handleFileSelect = (event) => {
    if (
      selectNumberRef.current.value === "" ||
      newOption === "" ||
      selectOptionRef.current.value === ""
    ) {
      alert(
        "Please select an option from both dropdowns before choosing files."
      );
      event.target.value = "";
      return;
    }
    const input = document.getElementById("fileInput");
    const file = input.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    if (file && allowedTypes.indexOf(file.type) === -1) {
      alert("Invalid file type. Please select a PDF, DOCX, DOC, or TXT file.");
      input.value = "";
    }

    const files = event.target.files;
    setSelectedFiles(Array.from(files));
    event.target.value = "";
  };

  const handleUpload = async () => {
    if (
      selectNumberRef.current.value === "" ||
      newOption === "" ||
      selectOptionRef.current.value === "" ||
      selectedFiles.length === 0
    ) {
      alert(
        "Please select an option from both dropdowns and choose at least one file before uploading."
      );
      return;
    }

    const storageRef = ref(
      storage,
      `files/${selectOptionRef.current.value}/${selectNumberRef.current.value}`
    );
    const metadata = {
      customMetadata: {
        skills: textAreaRef.current.value ? textAreaRef.current.value : "",
        name:Name,
        uploadedBy:auth.currentUser.email,
      },
    };
   
  const uploadPromises = selectedFiles.map(async (file) => {

    const randomString =
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 7) +
    Math.random().toString(36).slice(2, 7);

    const fileExtension = file.name.split(".").pop();

    const newFileName = `${Name}_${randomString}.${fileExtension}`;

    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    await uploadBytes(ref(storageRef, renamedFile.name), renamedFile, metadata);
  });

    setUploading(true); 
    try {
      await Promise.all(uploadPromises);
      setSelectedFiles([]);
      setNewOption("");
      setnewValue("");
      selectOptionRef.current.value = "";
      selectNumberRef.current.value = "";
      textAreaRef.current.value = "";
    } catch (error) {
      console.log(error);
      alert("Failed to upload files");
    } finally {
      setUploading(false); 
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    const items = event.dataTransfer.items;
    let containsFolder = false;
    const newFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const file = item.getAsFile();
        const extension = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "doc", "docx", "txt"].includes(extension)) {
          console.log(`File type "${extension}" is not allowed`);
          alert(`File type "${extension}" is not allowed`);
          return;
        }
        newFiles.push(file);
      } else if (item.kind === "directory") {
        containsFolder = true;
      }
    }

    if (containsFolder) {
      console.log("Folders not allowed");
      alert("Folders not allowed");
      return;
    }

    setSelectedFiles(newFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = () => {
    if (
      selectNumberRef.current.value === "" ||
      newOption === "" ||
      selectOptionRef.current.value === ""
    ) {
      alert(
        "Please select an option from both dropdowns and choose at least one file before uploading."
      );
      return;
    }
    setVisible(true);
  };
  return (
    <div className="ll">
      <Navbar
        backgroundColor="#333"
        textColor="#fff"
        buttons={buttons}
        onClick={handleLogout}
      />
      <div className="Selector">
   
        <div className="main-select">
          <button className="AddButton" onClick={handleAddOption}>
            Add
          </button>
          <div className="po">
            <label htmlFor="select-option">Technology - </label>
            <select
              id="select-option"
              className="leela"
              ref={selectOptionRef}
              onChange={handleOptionChange}
              value={newOption}
            >
              <option value="">-- Select Technology --</option>
              {options.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="po">
            <label htmlFor="select-number">Experience - </label>
            <select id="select-number" className="leela" ref={selectNumberRef}     onChange={handleOptionChange1}
              value={newValue}>
              <option value="">-- Select Experience --</option>
              {numbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          <div className="po">
            <label htmlFor="skills">Name - </label>
          <input 
          id="name"
          type="text"
          placeholder="Enter Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="po">
            <label htmlFor="skills">Skills - </label>
            <textarea
              id="skills"
              rows="4"
              cols="50"
              ref={textAreaRef}
              placeholder="C, C++, Python, Docker,...."
              className="TextArea"
            ></textarea>
          </div>
          <input
            type="file"
            id="fileInput"
            className="custom-file-input"
            accept=".pdf,.docx,.doc,.txt"
            multiple
            onChange={handleFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>
      </div>

      <div className="wrapper-table">
        <div className="Table-con">
          {uploading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File name</th>
                  <th>File type</th>
                  <th>File size</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {selectedFiles.map((file, index) => (
                  <tr key={file.name}>
                    <td>{file.name}</td>
                    <td>{file.type}</td>
                    <td>{file.size} bytes</td>
                    <td>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          const newSelectedFiles = [...selectedFiles];
                          newSelectedFiles.splice(index, 1);
                          setSelectedFiles(newSelectedFiles);
                        }}
                      >
                        <img src={require("../assets/delete.png")} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
{Visible?<DeleteTable data={{ "name":`${selectOptionRef.current.value}`,"quantity":`${selectNumberRef.current.value}`}}/>:null}
      <div className="lii">
        <button onClick={handleUpload}>Upload Resume</button>
        <button onClick={handleDelete}>Delete Resume</button>
      </div>
    </div>
  );
}

export default Home;
