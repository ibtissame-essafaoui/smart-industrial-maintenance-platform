import React, { useEffect, useState } from "react";

import API from "../../services/api";
import Sidebar from "../../components/Sidebar";

import {
  FaUsers,
  FaTrash,
  FaUserPlus,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

import "../../styles/Admin/users.css";

function UsersPage() {

  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "TECHNICIEN",
    domain: "MECANIQUE"
  });

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const res =
        await API.get("/users");

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // ======================
  // ADD USER
  // ======================

  const addUser = async () => {

    if (
      !form.email
        .toLowerCase()
        .endsWith("@ocpgroupe.ma")
    ) {

      alert(
        "Email doit terminer par @ocpgroupe.ma"
      );

      return;
    }

    try {

      await API.post(
        "/users",
        form
      );

      setForm({
        username: "",
        password: "",
        email: "",
        role: "TECHNICIEN",
        domain: "MECANIQUE"
      });

      loadUsers();

    } catch (err) {

      console.log(err);

    }
  };

  // ======================
  // DELETE
  // ======================

  const deleteUser = async (id) => {

    if (
      !window.confirm(
        "Supprimer cet utilisateur ?"
      )
    )
      return;

    try {

      await API.delete(
        `/users/${id}`
      );

      loadUsers();

    } catch (err) {

      console.log(err);

    }
  };

  // ======================
  // EDIT
  // ======================

  const startEdit = (user) => {

    setEditingId(user.id);

    setForm({
      username: user.username,
      password: "",
      email: user.email || "",
      role: user.role,
      domain: user.domain
    });
  };

  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      username: "",
      password: "",
      email: "",
      role: "TECHNICIEN",
      domain: "MECANIQUE"
    });
  };

  const updateUser = async () => {

    if (
      !form.email
        .toLowerCase()
        .endsWith("@ocpgroupe.ma")
    ) {

      alert(
        "Email doit terminer par @ocpgroupe.ma"
      );

      return;
    }

    try {

      await API.put(
        `/users/${editingId}`,
        form
      );

      setEditingId(null);

      setForm({
        username: "",
        password: "",
        email: "",
        role: "TECHNICIEN",
        domain: "MECANIQUE"
      });

      loadUsers();

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="admin-layout">

      <Sidebar />

      <div className="users-page">

        <div className="users-header">

          <FaUsers />

          <div>

            <h1>
              Users Management
            </h1>

            <p>
              Gestion des utilisateurs
            </p>

          </div>

        </div>

        {/* FORM */}

        <div className="user-form">

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder={
              editingId
                ? "Nouveau mot de passe (optionnel)"
                : "Password"
            }
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Email @ocpgroupe.ma"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value
              })
            }
          >
            <option value="ADMIN">
              ADMIN
            </option>

            <option value="TECHNICIEN">
              TECHNICIEN
            </option>
          </select>

          <select
            value={form.domain}
            onChange={(e) =>
              setForm({
                ...form,
                domain: e.target.value
              })
            }
          >
            <option value="MECANIQUE">
              MECANIQUE
            </option>

            <option value="ELECTRIQUE">
              ELECTRIQUE
            </option>

            <option value="HYDRAULIQUE">
              HYDRAULIQUE
            </option>

            <option value="PROCESS">
              PROCESS
            </option>

            <option value="AUTOMATISME">
              AUTOMATISME
            </option>

            <option value="ENERGIE">
              ENERGIE
            </option>

            <option value="POMPE">
              POMPE
            </option>

            <option value="COMPRESSEUR">
              COMPRESSEUR
            </option>
          </select>

          {editingId ? (

            <>
              <button
                onClick={updateUser}
              >
                <FaSave />
                Modifier
              </button>

              <button
                className="cancel-btn"
                onClick={cancelEdit}
              >
                <FaTimes />
                Annuler
              </button>
            </>

          ) : (

            <button
              onClick={addUser}
            >
              <FaUserPlus />
              Ajouter
            </button>

          )}

        </div>

        {/* TABLE */}

        <div className="users-table">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Domain</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {users.map((u) => (

                <tr key={u.id}>

                  <td>
                    #{u.id}
                  </td>

                  <td>
                    {u.username}
                  </td>

                  <td>
                    {u.email}
                  </td>

                  <td>

                    <span
                      className={`role-badge ${u.role}`}
                    >
                      {u.role}
                    </span>

                  </td>

                  <td>
                    {u.domain}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEdit(u)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(u.id)
                      }
                    >
                      <FaTrash />
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

export default UsersPage;