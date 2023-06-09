import {
  getDownloadURL,
  listAll,
  ref,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import React, { useEffect, useState } from "react";

import { storage } from "../config";
import "./Table.css";
import Skill from "../Components/skills";

function DeleteTable(props) {
  console.log(props.data);

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const { name, quantity } = props.data;
        const storageRef = ref(storage, `files/${name}/${quantity}`);
        const { items } = await listAll(storageRef);

        const downloadURLsPromises = items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          const metadata = await getMetadata(item);

          const uploadTime = metadata.timeCreated;
          const skill = metadata.customMetadata;
          console.log(skill);
          const date = new Date(uploadTime.replace("Z", ""));
          const daysAgo = Math.round((new Date() - date) / 86400000);
          return {
            name: item.name,
            downloadURL,
            uploadTime: `${daysAgo} days ago`,
            skill,
          };
        });

        const downloadURLs = await Promise.all(downloadURLsPromises);
        setFiles(downloadURLs);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching files");
        setIsLoading(false);
      }
    }

    if (props.data) {
      fetchFiles();
    }
  }, [props.data]);

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  async function handleDeleteClick(item) {
    setIsLoading(true);
    try {
      const { name, quantity } = props.data;
      const storageRef = ref(storage, `files/${name}/${quantity}/${item.name}`);
      await deleteObject(storageRef);
      setFiles(files.filter((file) => file.name !== item.name));
    } catch (error) {
      console.error(error);
      setError("Error deleting file");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="Main-table">
      <div className="wrapper-table">
        <div className="Table-con">
          <table>
            <thead>
              <tr>
              <th>S.no</th>
                <th>File name</th>
             
                <th>Developer Skills</th>
                <th>Uploaded</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.name}>
                    <td>{index + 1}</td>
                  <td>{file.name}</td>
                
                  <td>
                    <Skill skill={file.skill?.skills} />
                  </td>

                  <td>{file.uploadTime}</td>
                  <td>
                
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(file)}
                    >
                  <span className="pdf-icon"></span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeleteTable;
