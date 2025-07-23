import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>POS Loyalty Extension</h1>
        <p className={styles.text}>
          Manage customer loyalty points and registrations directly from your
          Shopify POS.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Install App
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Customer Registration</strong>. Allow customers to register
            for your loyalty program directly at the POS.
          </li>
          <li>
            <strong>Points Management</strong>. View, add, and redeem loyalty
            points from the customer details screen.
          </li>
          <li>
            <strong>Automatic Discounts</strong>. Apply loyalty discounts
            automatically when customers redeem points.
          </li>
        </ul>
      </div>
    </div>
  );
}
