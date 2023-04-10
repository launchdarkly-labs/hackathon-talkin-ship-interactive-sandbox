import * as React from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { styled } from "@stitches/react";
import {
  violet,
  mauve,
  indigo,
  purple,
  blackA,
  blue,
  gray,
  whiteA,
  green,
  blueDark,
  grayDark,
  orange,
} from "@radix-ui/colors";
import { Table } from "@nextui-org/react";
import DatabaseState from "@/components/database-status";
import Image from "next/image";
import product from "@/config/products";
import { useFlags } from "launchdarkly-react-client-sdk";
import NavigationMenuDemo from "@/components/menu";



type inventory = {
  id: number;
  toggle_name: string;
  price: string;
  description: string;
};

type orders = {
  name: string;
  email: string;
};

type product = {
  name: string;
  table_price: string;
  inventory: number;
};

const InventoryPage = () => {
  const { dbTesting } = useFlags();
  // retrieve data from postgres
  const [inventory, setInventory] = React.useState<any>([]);
  const getInventory = async () => {
    try {
      const response = await fetch("/api/inventory");
      const jsonData = await response.json();
      setInventory(jsonData);
    } catch (error) {
      console.log("there was an error");
    }
  };

  React.useEffect(() => {
    getInventory();
  }, [dbTesting]);

  const [orders, setOrders] = React.useState<any>([]);
  const getOrders = async () => {
    try {
      const response = await fetch("/api/form");
      const jsonData = await response.json();
      setOrders(jsonData);
    } catch (error) {
      console.log("there was an error");
    }
  };

  React.useEffect(() => {
    getOrders();
  }, [dbTesting]);

  return (
    <>
      <Head>
        <title>Toggle Outfitters</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/osmo.png" />
      </Head>
      <header className={styles.header}>
          <NavigationMenuDemo />
        </header>
      <main className={styles.main}>
      <DatabaseState />
        <h1 style={{ padding: "10px", color: "white" }}>Current Inventory</h1>
        {dbTesting == "postgres" ? (
          <Table
            css={{
              height: "auto",
              width: "1250px",
              backgroundColor: "white",
              alignContent: "right",
            }}
            selectionMode="single"
          >
            <Table.Header>
              <Table.Column>TOGGLE NAME</Table.Column>
              <Table.Column>PRICE</Table.Column>
              <Table.Column>DESCRIPTION</Table.Column>
              <Table.Column>CURRENT INVENTORY</Table.Column>
              <Table.Column>OUTSTANDING ORDERS</Table.Column>
            </Table.Header>
            <Table.Body>
              {inventory.map((inventory: inventory) => (
                <Table.Row key="1">
                  <Table.Cell>{inventory.toggle_name}</Table.Cell>
                  <Table.Cell>{inventory.price}</Table.Cell>
                  <Table.Cell>{inventory.description}</Table.Cell>
                  <Table.Cell>{Math.floor(Math.random() * 100)}</Table.Cell>
                  <Table.Cell>{Math.floor(Math.random() * 10)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Table
            css={{
              height: "auto",
              width: "500px",
              backgroundColor: "white",
              alignContent: "center",
            }}
            selectionMode="single"
          >
            <Table.Header>
              <Table.Column>TOGGLE NAME</Table.Column>
              <Table.Column>PRICE</Table.Column>
              <Table.Column>CURRENT INVENTORY</Table.Column>
            </Table.Header>
            <Table.Body>
              {product.map((product: product) => (
                <Table.Row key="1">
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.table_price}</Table.Cell>
                  <Table.Cell>{product.inventory}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        <h1 style={{ padding: "10px", color: "white" }}>Current Orders</h1>
        <Table
          css={{
            height: "auto",
            width: "500px",
            backgroundColor: "white",
            alignContent: "center",
          }}
          selectionMode="single"
        >
          <Table.Header>
            <Table.Column>NAME</Table.Column>
            <Table.Column>EMAIL</Table.Column>
          </Table.Header>
          <Table.Body>
            {orders.map((orders: orders) => (
              <Table.Row key="1">
                <Table.Cell>{orders.name}</Table.Cell>
                <Table.Cell>{orders.email}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </main>
    </>
  );
};

export default InventoryPage;
