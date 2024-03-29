import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    description: "",
    priority: "",
    date: "",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      const response = await fetch(`http://localhost:5000/record/${params.id?.toString()}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value: object) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const editedTodo = {
      description: form.description,
      priority: form.priority,
      date: form.date,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedTodo),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority: </label>
          <input
            type="text"
            className="form-control"
            id="priority"
            value={form.priority}
            onChange={(e) => updateForm({ priority: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date: </label>
          <input
            type="text"
            className="form-control"
            id="date"
            value={form.date}
            onChange={(e) => updateForm({ date: e.target.value })}
          />
        </div>
        <br />
        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}