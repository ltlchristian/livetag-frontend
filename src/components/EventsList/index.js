import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEvent } from "../../EventInUse";

import services from "../../services";

import dayjs from "dayjs";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Col, Container, Row } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Eventslist({ events, fecthAndSetListEvent, currentUser }) {
  const navigate = useNavigate();
  const { setEventChoice, setEventSelect, eventSelect } = useEvent();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({});

  const { SearchBar } = Search;
  // DESCRIPTION DES COLONNES
  // #region
  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    { dataField: "updatedAt", text: "update *", hidden: true },
    {
      dataField: "useEvent",
      text: "",
      align: "center",
      style: { verticalAlign: "middle", width: "10%" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-info btn-xs"
            onClick={() => selectEvent(row._id)}
          >
            selectionner
          </button>
        );
      },
    },
    {
      dataField: "code",
      text: "Code *",
      sort: true,
      align: "center",
      headerAlign: "center",
      style: {
        verticalAlign: "middle",
        fontStyle: "italic",
        fontSize: "12px",
      },
    },
    {
      dataField: "event_name",
      text: "Nom *",
      sort: true,
      style: { verticalAlign: "middle", width: "12%", fontWeight: "bold" },
      formatter: (cellContent, row) => {
        if (row.event_name === eventSelect.event_name)
          return (
            <Alert bg="info" className="m-0">
              {row.event_name}
            </Alert>
          );
        return <div>{row.event_name} </div>;
      },
    },
    {
      dataField: "description",
      text: "Description",
      align: "left",
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "place",
      text: "Lieu *",
      sort: true,
      align: "center",
      headerAlign: "center",
      style: { verticalAlign: "middle", width: "15%" },
    },
    {
      dataField: "start_date",
      text: "Début *",
      align: "center",
      headerAlign: "center",
      formatter: (cellContent, row) => {
        return dayjs(row.start_date).format("DD/MM/YY");
      },
      sort: true,
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "end_date",
      text: "Fin *",
      align: "center",
      headerAlign: "center",
      formatter: (cellContent, row) => {
        return dayjs(row.end_date).format("DD/MM/YY");
      },
      sort: true,
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "details",
      text: "",
      align: "center",
      style: { verticalAlign: "middle", width: "8%" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-warning btn-xs"
            onClick={() => navigate(`/events/${row._id}`)}
          >
            Modifier
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
            onClick={() => deleteEvent(row._id)}
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

  function deleteEvent(id) {
    services
      .deleteEventByID(id)
      .then((response) => {
        if (response.status === 401) {
          setResponse(response);
          setOpen(true);
        }
        if (eventSelect._id === id) {
          setEventChoice(false);
          setEventSelect({});
          localStorage.removeItem("idEvent");
        }
        fecthAndSetListEvent(currentUser._id);
      })
      .catch(console.log);
  }

  function selectEvent(id) {
    services
      .getEventById(id)
      .then((event) => {
        localStorage.setItem("idEvent", event._id);
        setEventSelect(event);
        setEventChoice(true);
        navigate("../activities/");
      })
      .catch((error) => {
        console.log("Error select events", error);
        alert("La liste des events ne peut être à affichée");
      });
  }

  useEffect(() => {
    fecthAndSetListEvent(currentUser._id);
  }, [currentUser]);

  // #endregion

  return (
    <ToolkitProvider
      keyField="_id"
      data={events}
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
                data={events}
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
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
          >
            <Alert variant="filled" severity="warning">
              {response.data}
            </Alert>
          </Snackbar>
        </Container>
      )}
    </ToolkitProvider>
  );
}

export default Eventslist;
