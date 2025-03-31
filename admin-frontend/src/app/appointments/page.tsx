"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { Appointment } from "@/lib/types";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    async function getAppointments() {
      try {
        const appointment: any = await axios.get(
          `http://localhost:8000/api/v1/appointment`
        );
        console.log(appointment.data.appointments);
        setAppointments(appointment.data.appointments);
      } catch (error) {
        console.log("Error in getting appointment", error);
      }
    }
    getAppointments();
  }, []);

  const handleAppointmentAction = async (
    id: number,
    action: "approve" | "decline"
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/appointment/${id}/status`,
        {
          status: action,
        }
      );

      //@ts-ignore
      if (response.data.success) {
        // Update the local state to reflect the status change
        //@ts-ignore
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            //@ts-ignore
            appointment.id === id
              ? { ...appointment, status: action }
              : appointment
          )
        );
      } else {
        console.log("Failed to update appointment status");
      }
    } catch (error) {
      console.log("Error updating appointment status:", error);
    }
  };

  return (
    <div className={styles.appointmentsContainer}>
      <h1 className={styles.pageTitle}>Appointment Requests</h1>
      <div className={styles.appointmentTable}>
        <div className={styles.tableHeader}>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Date</div>
          <div>Time</div>
          <div>Type</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {appointments.map((appointment: Appointment) => (
          <div key={appointment.id} className={styles.tableRow}>
            <div>{appointment.patient}</div>
            <div>{appointment.doctor}</div>
            <div>{appointment.date.split("T")[0]}</div>
            <div>{appointment.time}</div>
            <div>In Person</div>
            <div className={styles[`status-${appointment.status}`]}>
              {appointment.status}
            </div>
            <div className={styles.actionButtons}>
              <button
                onClick={() =>
                  //@ts-ignore
                  handleAppointmentAction(appointment.id, "approved")
                }
                className={styles.approveButton}
              >
                Approve
              </button>
              <button
                onClick={() =>
                  //@ts-ignore
                  handleAppointmentAction(appointment.id, "declined")
                }
                className={styles.declineButton}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
