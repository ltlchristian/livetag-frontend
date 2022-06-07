import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import services from "../../services";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useEvent } from "../../EventInUse";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ParticipantsList({ listParticipants, fecthAndSetListParticipant }) {
  const { eventSelect } = useEvent();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { SearchBar } = Search;

  // DESCRIPTION DES COLONNES
  // #region
  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    { dataField: "updatedAt", text: "update", hidden: true },
    {
      dataField: "event._id",
      hidden: true,
    },
    {
      dataField: "role._id",
      hidden: true,
    },

    {
      dataField: "firstname",
      text: "Prénom *",
      sort: true,
      style: { verticalAlign: "middle", fontWeight: "bold" },
    },
    {
      dataField: "lastname",
      text: "Nom *",
      sort: true,
      style: { verticalAlign: "middle", fontWeight: "bold" },
    },
    {
      dataField: "email",
      text: "Email",
      align: "center",
      headerAlign: "center",
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "telephone",
      text: "Téléphone",
      align: "center",
      headerAlign: "center",
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "role.role_name",
      text: "Rôle *",
      align: "center",
      headerAlign: "center",
      style: { verticalAlign: "middle" },
      formatter: (cellContent, row) => {
        return (
          <Button
            className="btn btn-secondary" size="sm"
            onClick={() => navigate(`/roles/${row.role._id}`)}
          >
            {row.role.role_name}
          </Button>
        );
      },
      sort: true,
    },

    {
      dataField: "details",
      text: "",
      align: "center",
      style: { verticalAlign: "middle", width: "8%" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-warning btn-xs btn-block"
            onClick={() => navigate(`/participants/${row._id}`)}
          >
            Modifier
          </button>
        );
      },
    },
    {
      dataField: "qrcode",
      text: "",
      align: "center",
      style: { verticalAlign: "middle", width: "8%" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-info btn-xs btn-block"
            onClick={() => navigate(`/qrcode/${row._id}`)}
          >
            QRCode
          </button>
        );
      },
    },
    {
      dataField: "remove",
      text: "",
      align: "center",
      style: { verticalAlign: "middle", width: "8%" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-outline-danger btn-xs"
            onClick={() => deleteParticipant(row._id)}
          >
            Supprimer
          </button>
        );
      },
    },
  ];
  // #endregion
  // OPTION DU TABLEAU
  const defaultSorted = [
    {
      dataField: "updatedAt",
      order: "desc", // desc or asc
    },
  ];

  // RECUPERATION DES DONNEES
  // #region

  function deleteParticipant(idParticipant) {
    services
      .deleteParticipant(idParticipant)
      .then(() => {
        fecthAndSetListParticipant();
        setOpen(true);
      })
      .catch((error) => {
        console.log("Error delete participant", error);
        alert("La liste des participants ne peut être affichée");
      });
  }

  useEffect(() => {
    fecthAndSetListParticipant();
  }, []);
  // #endregion

  return (
    <ToolkitProvider
      keyField="_id"
      data={listParticipants}
      columns={columns}
      search
      bootstrap4={true}
    >
      {(props) => (
        <Container fluid="xl">
          <Row>
            <Col className="text-center">
              <SearchBar
                {...props.searchProps}
                className="mb-3"
                style={{ width: "500px" }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <BootstrapTable
                {...props.baseProps}
                keyField="_id"
                striped
                hover
                responsive
                condensed
                bordered={false}
                data={listParticipants}
                columns={columns}
                defaultSorted={defaultSorted}
                noDataIndication="Aucune donnée dans la liste"
                pagination={paginationFactory()}
              ></BootstrapTable>
            </Col>
          </Row>
          <Row>
            <Col className="h6 mb-4">* tri possible sur colonne</Col>
          </Row>
          <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
            <Alert variant="filled" severity="success">Participant supprimé</Alert>
          </Snackbar>
        </Container>
      )}
    </ToolkitProvider>
  );
}

export default ParticipantsList;
