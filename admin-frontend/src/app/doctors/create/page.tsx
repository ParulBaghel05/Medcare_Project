"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateDoctor() {
  const [isLoading, setisLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleCreateDoctor = async (formData: FormData) => {
    try {
      setisLoading(true);
      const treatmentsArray = formData.get("treatments")?.toString().split(",");
    const disease: Record<string, string> = {};
    treatmentsArray?.forEach((treatment) => {
      disease[treatment.trim()] = "Treatment"; 
    });
      const doctor_details = {
        name: formData.get("name"),
        email: formData.get("email"),
        speciality: formData.get("speciality"),
        rating: formData.get("rating"),
        experience: formData.get("experience"),
        disease: disease,
        photo_url: imageUrl,
        location: formData.get("location"),
        gender: formData.get("gender"),
      };
      const res:{data:{success:boolean}} = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/create`,
        {
          doctor_details: doctor_details,
        }
      );

      console.log(res);
      
      if (!res.data.success) {
        throw new Error("Error in creating doctor");
      }
      toast.success("Doctor Added Successfully");
      setisLoading(false);
    } catch (error) {
      console.log("Error in creating a doctor", error);
      toast.error("Something went wrong");
      setisLoading(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setisLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        toast.error("No file selected");
        return;
      }
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const result:any = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!result.data.success) {
        throw new Error("Error in uploading the file");
      }
      setImageUrl(result.data.url);
      toast.success("Image Uploaded Successfully");
      setisLoading(false);
    } catch (error) {
      toast.error("Error in uploading the image");
      console.log("Error in  uploading the image", error);
    }
  };

  return (
    <div className={styles.createDoctorContainer}>
      <h1 className={styles.pageTitle}>Add New Doctor</h1>
      <form action={handleCreateDoctor} className={styles.doctorForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className={styles.input}
              placeholder="Dr. Amrita Rai"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className={styles.input}
              placeholder="doctor@medcare.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="specialty" className={styles.label}>
              Specialty
            </label>
            <input
              type="text"
              name="speciality"
              required
              className={styles.input}
              placeholder="Cardiologist"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rating" className={styles.label}>
              Ratings(out of 5)
            </label>
            <input
              type="number"
              name="rating"
              required
              max={5}
              className={styles.input}
              placeholder="5"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="experience" className={styles.label}>
              Experience in years
            </label>
            <input
              type="number"
              name="experience"
              required
              className={styles.input}
              placeholder="10"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="treatments" className={styles.label}>
              Treatments
            </label>
            <input
              type="text"
              name="treatments"
              required
              className={styles.input}
              placeholder="diabetes,thyroid"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <input
              type="text"
              name="location"
              required
              className={styles.input}
              placeholder="Delhi, India"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender" className={styles.label}>
              Gender
            </label>
            <select className={styles.input} name="gender" id="">
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="treatments" className={styles.label}>
              Profile Image
            </label>
            <input
              onChange={uploadImage}
              type="file"
              accept="image/*"
              name="treatments"
              required
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button
            disabled={isLoading}
            type="submit"
            className={styles.submitButton}
          >
            Create Doctor Profile
          </button>
        </div>
      </form>
    </div>
  );
}