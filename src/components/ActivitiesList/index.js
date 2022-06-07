import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import services from "../../services";

import dayjs from "dayjs";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Container, Row, Col } from "react-bootstrap";
import { useEvent } from "../../EventInUse";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function ActivitiesList({
  activities,
  fecthAndSetListActivities,
}) {
  const { eventSelect } = useEvent();
  const navigate = useNavigate();
  const { SearchBar } = Search;
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({});

  // DESCRIPTION DES COLONNES
  // #region
  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    { dataField: "updatedAt", text: "update", hidden: true },
    {
      dataField: "activity_name",
      text: "Nom *",
      sort: true,
      style: { verticalAlign: "middle", fontWeight: "bold" },
    },
    {
      dataField: "activity_date",
      text: "Date *",
      align: "center",
      headerAlign: "center",
      formatter: (cellContent, row) => {
        return dayjs(row.activity_date).format("DD/MM/YY");
      },
      sort: true,
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "description",
      text: "Description",
      style: { verticalAlign: "middle" },
    },

    {
      dataField: "price",
      text: "Tarif (€)*",
      sort: true,
      align: "right",
      headerAlign: "right",
      style: { verticalAlign: "middle" },
    },
    {
      dataField: "details",
      text: "",
      align: "center",
      style: { width: "8%", verticalAlign: "middle" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-warning btn-xs btn-block"
            onClick={() => navigate(`/activities/${row._id}`)}
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
      style: { width: "8%", verticalAlign: "middle" },
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-outline-danger btn-xs"
            onClick={() => deleteActivityAndRefresh(row._id)}
          >
            Supprimer
          </button>
        );
      },
    },
  ];
  // #endregion
  //OPTION DU TABLEAU
  const defaultSorted = [
    {
      dataField: "updatedAt",
      order: "desc", // desc or asc
    },
  ];

  // RECUPERATION DES DONNEES
  //supprimer l'activité et refresh la page
  function deleteActivityAndRefresh(idActivity) {
    //liste des activités via dB
    services
      .deleteActivity(idActivity)
      .then((response) => {
        if (response.status === 401) {
          setResponse(response);
          setOpen(true);
        }
        fecthAndSetListActivities();
      })
      .catch(console.log);
  }

  useEffect(() => {
    fecthAndSetListActivities();
  }, []);

  return (
    <ToolkitProvider
      keyField="_id"
      data={activities}
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
                data={activities}
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
          <Snackbar open={open} autoHideDuration={3000} onClose={()=> setOpen(false)}>
            <Alert variant="filled" severity="warning">{response.data}</Alert>
          </Snackbar> 
        </Container>
      )}
    </ToolkitProvider>
  );
}
