import { useEffect, useState } from "react";




const ListUsers = () => {
  const [users, setUsers] = useState([]);

//   //delete note function
//   const deleteNote = async (id) => {
//     try {
//       const deleteNode = await fetch(`http://localhost:5000/todo/${id}`, {
//         method: "DELETE",
//       });

//       setNotes(notes.filter((note) => note.todo_id !== id));
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const jsonData = await response.json();

      setUsers(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // console.log(notes)

  return (
    <>
    <h1 className="text-center mt-5">Users in PostgreSQL: </h1>
      <table class="table">
        <thead>
          <tr>
            <th>Users</th>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>Test</td>
              <td>
                <button
                  className="btn-danger"
                //   onClick={() => deleteNote(note.todo_id)}
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

export default ListUsers;
