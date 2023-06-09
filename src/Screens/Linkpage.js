import React from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config"; 
export default function MyLinks() {

  const [docData, setDocData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchDocumentData();
  }, []);

  async function fetchDocumentData() {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tokens"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocData(data);
    } catch (error) {
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(docId) {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "tokens", docId));
      setDocData((prevData) => prevData.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error(error);
  
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Generated Links</h1>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Link</th>
              <th>Technology</th>
              <th>Experience</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {docData.length
              ? docData.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>
                      <p className="link-container">
                        <a
                          href={`http://tempusermodule.netlify.app/table?token=${doc.id}`}
                        >{`http://tempusermodule.netlify.app/table?token=${doc.id}`}</a>
                      </p>
                    </td>

                    <td>{doc.tech}</td>
                    <td>{doc.exp===""?"All":doc.exp}</td>
                    <td>{doc.createdBy}</td>
                    <td>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="del-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : "No Generated Links"}
          </tbody>
        </table>
      )}
    </div>
  );
}
