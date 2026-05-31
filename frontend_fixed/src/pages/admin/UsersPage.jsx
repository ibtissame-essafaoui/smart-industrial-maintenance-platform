import React, {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import Sidebar
from "../../components/Sidebar";

import {
  FaUsers,
  FaTrash,
  FaUserPlus
} from "react-icons/fa";

import "../../styles/Admin/users.css";

function UsersPage() {

  // =====================
  // STATES
  // =====================

  const [users,
    setUsers] =
    useState([]);

  const [form,
    setForm] =
    useState({

      username:"",
      password:"",
      role:"TECHNICIEN",
      domain:"MECANIQUE"

    });

  // =====================
  // LOAD USERS
  // =====================

  useEffect(() => {

    loadUsers();

  }, []);

  const loadUsers =
    async () => {

      try {

        const res =
          await API.get(
            "/users"
          );

        setUsers(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch(err){

        console.log(err);
      }
    };

  // =====================
  // ADD USER
  // =====================

  const addUser =
    async () => {

      try {

        await API.post(

          "/users",

          form

        );

        setForm({

          username:"",
          password:"",
          role:"TECHNICIEN",
          domain:"MECANIQUE"

        });

        loadUsers();

      } catch(err){

        console.log(err);
      }
    };

  // =====================
  // DELETE USER
  // =====================

  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Supprimer utilisateur ?"
        );

      if(!confirmDelete)
        return;

      try {

        await API.delete(
          `/users/${id}`
        );

        loadUsers();

      } catch(err){

        console.log(err);
      }
    };

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* PAGE */}

      <div className="users-page">

        {/* HEADER */}

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
            onChange={(e)=>

              setForm({

                ...form,

                username:
                e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>

              setForm({

                ...form,

                password:
                e.target.value
              })
            }
          />

          <select
            value={form.role}
            onChange={(e)=>

              setForm({

                ...form,

                role:
                e.target.value
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
            onChange={(e)=>

              setForm({

                ...form,

                domain:
                e.target.value
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

          <button
            onClick={addUser}
          >

            <FaUserPlus />

            Ajouter

          </button>

        </div>

        {/* TABLE */}

        <div className="users-table">

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>Username</th>

                <th>Role</th>

                <th>Domain</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                users.map((u)=>(

                  <tr key={u.id}>

                    <td>
                      #{u.id}
                    </td>

                    <td>
                      {u.username}
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
                        className="delete-btn"
                        onClick={()=>
                          deleteUser(
                            u.id
                          )
                        }
                      >

                        <FaTrash />

                      </button>

                    </td>

                  </tr>
                ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UsersPage;