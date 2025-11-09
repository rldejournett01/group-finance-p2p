import { useEffect, useState } from "react";


import EditNote from "./EditNote";

const ListNotes = () => {
  const [notes, setNotes] = useState([]);

  //delete note function
  const deleteNote = async (id) => {
    try {
      const deleteNode = await fetch(`http://localhost:5000/todo/${id}`, {
        method: "DELETE",
      });

      setNotes(notes.filter((note) => note.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/todo");
      const jsonData = await response.json();

      setNotes(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // console.log(notes)

  return (
    <>
      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          {notes.map((note) => (
            <tr key={note.todo_id}>
              <td>{note.description}</td>
              <td><EditNote note = {note} /></td>
              <td>
                <button
                  className="btn-danger"
                  onClick={() => deleteNote(note.todo_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListNotes;
