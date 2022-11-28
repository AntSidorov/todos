import { Button, Container, Header, Icon, Table } from "semantic-ui-react";
import TableRow from "./TableRow";
import styles from "../styles/index.module.css";

const DataTable = ({
  records,
  handlerDelete,
  selectedItems,
  handlerCheckbox,
  handlerEditClick,
  handlerToggle,
  currentID,
  pending,
  pendingDelete,
}) => {
  return (
    <>
      <Table celled striped>
        <Table.Header>
          <Table.Row key="header">
            <Table.HeaderCell width="1" />
            <Table.HeaderCell width="1">Number</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Desc</Table.HeaderCell>
            <Table.HeaderCell width="1">DONE</Table.HeaderCell>
            <Table.HeaderCell width="1">CHANGE</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {records.map((record) => (
            <TableRow
              record={record}
              pending={pending}
              handlerCheckbox={handlerCheckbox}
              handlerEditClick={handlerEditClick}
              handlerToggle={handlerToggle}
            ></TableRow>
          ))}
        </Table.Body>
      </Table>
      {currentID === null && (
        <Container>
          <h1 className={styles.header3}>Delete exist</h1>
          <Button
            onClick={handlerDelete}
            loading={pendingDelete}
            icon
            color="red"
            labelPosition="right"
            style={{ width: 180 }}
            disabled={!selectedItems.length}
          >
            <Icon name="trash" />
            {buttonTitle(selectedItems)}
          </Button>
        </Container>
      )}
    </>
  );
};

function buttonTitle(selectedItems) {
  if (selectedItems.length == 1) {
    return "Delete selected item";
  }
  if (selectedItems.length > 1) {
    return "Delete selected " + selectedItems.length + " items";
  }
  return "Delete";
}

export default DataTable;
