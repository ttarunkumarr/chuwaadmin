import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../config";
import { listAll, ref, getMetadata, getDownloadURL } from "firebase/storage";
import "./ResumeInventory.css";
import "./Table.css";
import Navbar from "../Components/Navbar";
import { doc, setDoc } from "firebase/firestore";

export default function ResumeInventory() {
  const [folderNames, setFolderNames] = useState([]);
  const [selectedFolder1, setSelectedFolder1] = useState("");
  const [selectedFolder2, setSelectedFolder2] = useState("");
  const [subfolderNames, setSubfolderNames] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const buttons = [{ text: "Logout" }];
  const [Linkgen, setLinkgen] = useState("");
  const [textxp, settextxp] = useState("Copy link");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    fetchData("files/");
  }, []);

  async function fetchData(string) {
    try {
      const storageRef = ref(storage, string);
      const { prefixes } = await listAll(storageRef);

      const folderNames = prefixes.map((prefix) => prefix.name);
      setFolderNames(folderNames);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchSubfolderData(folderName) {
    try {
      const storageRef = ref(storage, `files/${folderName}`);
      const { prefixes } = await listAll(storageRef);

      const subfolderNames = prefixes.map((prefix) => prefix.name);
      setSubfolderNames(subfolderNames);
    } catch (error) {
      console.error(error);
    }
  }

  async function listFiles(folder, subfolder) {
    try {
      const storageRef = ref(storage, `files/${folder}/${subfolder}`);
      const { items } = await listAll(storageRef);

      const files = [];
      for (const item of items) {
        const metadata = await getMetadata(item);
        const uploadTime = metadata.timeCreated;
        const date = new Date(uploadTime.replace("Z", ""));
        const daysAgo = Math.round((new Date() - date) / 86400000);
        const downloadUrl = await getDownloadURL(item);

        files.push({ name: item.name, metadata, date: daysAgo, downloadUrl });
      }
      setFilesData(files);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleFolder1Change = (e) => {
    const selectedValue = e.target.value;
    setSelectedFolder1(selectedValue);
    setSelectedFolder2("");
    setLinkgen("");
    setFilesData([]);

    fetchSubfolderData(selectedValue);
  };
  function generateToken(tech, experience) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const tokenLength = 42;
    let token = "";
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    return `${token}`;
  }

  const handleGenerateToken = async () => {
    setLoading(true);

    const uniqueToken = generateToken(selectedFolder1, selectedFolder2);

    try {
      await setDoc(doc(db, "tokens", uniqueToken), {
        tech: selectedFolder1,
        exp: selectedFolder2,
        createdBy: auth.currentUser.email,
      }).then((e) => {
        setLinkgen(
          `http://tempusermodule.netlify.app/table?token=${uniqueToken}`
        );
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(Linkgen);
    settextxp("Copied !");
  };
  const handleFolder2Change = (e) => {
    setLinkgen("");
    const selectedValue = e.target.value;
    setSelectedFolder2(selectedValue);

    setLoading(true);

    listFiles(selectedFolder1, selectedValue);
  };
  const handleLogout = () => {
    auth.signOut();
  };
  const handleSelectFile = (e, filename) => {
    console.log(e.target.checked, filename);
    if ((e.target.checked, filename)) {
      console.log(selectedFiles.includes(filename));
      const updatedFiles = [...selectedFiles, filename];
      console.log(updatedFiles);
      setSelectedFiles(updatedFiles);
      console.log(selectedFiles.includes(filename));
      console.log(selectedFiles);
    }
  };
  return (
    <div>
      <Navbar
        backgroundColor="#333"
        textColor="#fff"
        buttons={buttons}
        onClick={handleLogout}
      />
      <div className="main_lead">
        <div className="poooo ">
          <div className="po">
            <label htmlFor="select-option">Technology - </label>
            <select
              value={selectedFolder1}
              className="leela"
              onChange={handleFolder1Change}
            >
              <option value="">Select Technology</option>
              {folderNames.map((folderName) => (
                <option key={folderName} value={folderName}>
                  {folderName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="poooo">
          <div className="po">
            <label htmlFor="select-option">Experience - </label>
            <select
              value={selectedFolder2}
              className="leela"
              onChange={handleFolder2Change}
            >
              <option value="">Select Experience</option>
              {subfolderNames.map((subfolderName) => (
                <option key={subfolderName} value={subfolderName}>
                  {subfolderName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="poooo ma">
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>SNo</th>
                  <th>Name</th>
                  <th>Developer Experience</th>
                  <th>Uploaded</th>
                  <th>Uploaded By</th>
                  <th>File Name</th>
                </tr>
              </thead>

              <tbody>
                {filesData.map((file, index) => (
                  <tr key={file.name}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.name)}
                        onChange={(e) => {
                          handleSelectFile(e, file.name);
                          console.log(selectedFiles.includes(file.name));
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>

                    <td>{file.metadata.customMetadata.name}</td>

                    <td>{selectedFolder2}</td>
                    <td>
                      {file.date === 0 ? "Today" : file.date + " Days Ago"}
                    </td>
                    <td>{file.metadata.customMetadata.uploadedBy}</td>
                    <td>
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-a"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {Linkgen === "" ? (
            <button
              onClick={() => {
                handleGenerateToken();
              }}
              disabled={selectedFolder1 === ""}
              className="genlink"
            >
              Generate Link
            </button>
          ) : (
            <button
              onClick={() => {
                handleCopy();
              }}
              className="genlink c"
            >
              {textxp}
            </button>
          )}
          <p>{Linkgen}</p>
        </div>
      </div>
    </div>
  );
}
