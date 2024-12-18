import React, { useEffect, useState } from "react";

import OrderModal from "./OrderModal";
import "../styles/OrdersPanel.css";

export default function OrdersPanel(orderId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   View selected order
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentJwt = localStorage.getItem("jwt");
        const response = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/order`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentJwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  //   Toggle the select order's modal
  const toggleModal = (order = null) => {
    setSelectedOrder(order);
    setIsModalOpen(!isModalOpen);
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="order-list-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>TABLE NO</th>
            <th>ORDER TIME</th>
            <th>COMPLETED TIME</th>
            <th>STATUS</th>
            <th>TOTAL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              {/* Order Code
              <td>{order._id}</td> */}

              {/* Table No */}
              <td>{order.tableNumber || "-"}</td>

              {/* Order Time */}
              <td>{new Date(order.createdAt).toLocaleString()}</td>

              {/* Completed Time */}
              <td>
                {order.orderStatus === "Completed"
                  ? new Date(order.updatedAt).toLocaleString()
                  : "-"}
              </td>

              {/* Status */}
              <td>
                {order.orderStatus === "Completed" ? (
                  <span className="action-complete">COMPLETE</span>
                ) : (
                  <span className="action-pending">PENDING</span>
                )}
              </td>

              {/* Total Price */}
              <td>${order.totalPrice.toFixed(2)}</td>

              {/* View Order Button */}
              <td>
                <button
                  onClick={() => toggleModal(order)}
                  className="view-details-btn"
                >
                  View Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OrderModal
        isOpen={isModalOpen}
        toggleModal={() => toggleModal(null)}
        order={selectedOrder}
      />
    </div>
  );
}
