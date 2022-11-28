import React from "react";
import { Button, Checkbox, Table } from "semantic-ui-react";

const TableRow = ({
  record,
  handlerCheckbox,
  handlerEditClick,
  handlerToggle,
  pending,
}) => {
  return (
    <Table.Row key={record.id}>
      <Table.Cell textAlign="center">
        <input
          type="checkbox"
          style={{
            width: 15,
            height: 15,
          }}
          onChange={(e) => handlerCheckbox(e.target.checked, record.id)}
        />
      </Table.Cell>
      <Table.Cell>{record.index + 1}</Table.Cell>
      <Table.Cell>{record.title}</Table.Cell>
      <Table.Cell>{record.desc}</Table.Cell>
      <Table.Cell>
        <Checkbox
          toggle
          disabled={pending}
          checked={record.completed}
          onChange={(e) => handlerToggle(e, record)}
        />
      </Table.Cell>
      <Table.Cell>
        <Button onClick={(event) => handlerEditClick(event, record)}>
          EDIT
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableRow;
