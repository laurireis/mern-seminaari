import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props: any) => (
  <tr>
    <td>{props.record.description}</td>
    <td>{props.record.priority}</td>
    <td>{props.record.date}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

interface RecordListProps {
  _id: string;
  description: string;
  priority: string;
  date: string;
}

export default function RecordList() {
  const [records, setRecords] = useState<RecordListProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = records.filter((record) => {
    return record.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id: string) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return filteredTodos.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>To-Do List</h3>
      <input
        placeholder="Search..."
        type="text"
        className="form-control"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Priority</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
}