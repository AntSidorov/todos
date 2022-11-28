import Link from "next/link";
import { Label, Menu } from "semantic-ui-react";
import React, { useState } from "react";

const Header = ({ ...props }) => {
  return (
    <>
      <Menu style={{ marginTop: 10, fontSize: "15px" }}>
        <Link href="/">
          <Menu.Item active={props.path === "/"}>About</Menu.Item>
        </Link>
        <Link href="/todolist">
          <Menu.Item active={props.path === "/todolist"}>Todo list</Menu.Item>
        </Link>
      </Menu>
    </>
  );
};

export default Header;
