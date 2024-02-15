import React, { useState, useEffect, useMemo } from "react";
import { API_URL } from "../../config";
import isAuth from "../../auth/AuthService";
import Layout from "../../core/partials/Layout";
import sidebar from "../layouts/sidebar";
import moment from "moment";
import ModalDelete from "../../core/partials/ModalDelete";
import { deleteItem } from "../../core/api/apiCore";
import { useNavigate } from "react-router-dom";

export default function Users() {

  const navigate = useNavigate()
  
  const [open, setOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState({})
  const [idUserToDelete, setIdUserToDelete] = useState(null)
  const [users, setUsers] = useState([]);
  
    // list d'utilisateurs
    const usersList = () => {
      fetch(`${API_URL}api/user`, {
        headers: {
          Accept: "application/json",
          ContenType: "application/json",
          Authorization: `Bearer ${isAuth().token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => setUsers(result.users))
        .catch((err) => console.log(err));
    };
  
  useMemo(() => usersList(), []);

  useEffect(() => {
    const userById = user => {
      return user._id === idUserToDelete
    }
    const user = users.find((userById))
    setUserToDelete(user)
  }, [idUserToDelete])
  
  const showModal = (e) => {
    setIdUserToDelete(e.target.getAttribute('data-id'))
    setOpen(!open)
  }

  const leModal = () => {
    if(open) return (<ModalDelete 
      item={userToDelete} 
      open={open} 
      closeClick={() => setOpen(false)} 
      deleteAction={() => deleteItem('api/user/remove/', isAuth().token, userToDelete, navigate(0), setOpen(!open))} 
      className="border-0 rounded position-fixed bottom-50 start-0 z-1"/>)
  }

  return (
    <Layout
      title="Les Utilisateurs"
      description="Tous les utilisateurs"
      className="container-fluid"
    >
        <div className="row">
        <div className="col-md-3 mx-auto p-0">{sidebar()}</div>
          <div className="col-md-9 px-1">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-uppercase mb-0">Gestion Des Utilisateurs</h5>
              </div>
              <div className="table-responsive">
                <table className="table no-wrap user-table mb-0">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium pl-4"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium"
                      >
                        Nom
                      </th>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium"
                      >
                        Inscrit Le
                      </th>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="border-0 text-uppercase font-medium"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map((user, i) => (
                        <tr key={i} data-id={user._id} >
                          <td className="pl-4">
                            {i + 1}
                          </td>
                          <td>
                            <h5 className="font-small mb-0">{user.name}</h5>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{user.email}</span>
                            <br />
                          </td>
                          <td>
                            <span className="text-muted">{moment(user.createdAt).locale('FR').format('DD/MM/YYYY')}</span>
                            <br />
                          </td>
                          <td>
                            <select
                              className="form-control category-select"
                              id="exampleFormControlSelect1"
                            >
                              <option value={user.role}>{user.role === 1 ? "ADMIN" : "CLIENT"}</option>
                              <option value={user.role === 1 ? 0 : 1}>{user.role === 1 ? "CLIENT" : "ADMIN"}</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-circle btn-ms"
                            >
                              <i className="fa fa-key"></i>{" "}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-circle btn-ms ml-1"
                              onClick={(e) => showModal(e)}
                              data-id={user._id}
                            >
                              <i className="fa fa-trash"></i>{" "}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-circle btn-ms ml-1"
                            >
                              <i className="fa fa-edit"></i>{" "}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-circle btn-ms ml-1"
                            >
                              <i className="fa fa-upload"></i>{" "}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            {userToDelete && leModal()}
            </div>
          </div>
        </div>
    </Layout>
  );
}