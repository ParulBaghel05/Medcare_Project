"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import styles from "./page.module.css";

interface Disease {
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url: string;
  rating: number;
  location: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  disease: Disease[];
}

const UpdateDoctorPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({});
  const [disease, setDisease] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res:any = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/${id}`
        );
        const doctorData = res.data.doctor;

        const diseaseArray = doctorData.disease
          ? Object.keys(doctorData.disease).map((key) => ({ name: key }))
          : [];

        setDoctor(doctorData);
        setFormData({
          ...doctorData,
          disease: diseaseArray,
        });
        setPreviewUrl(doctorData.photo_url);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setError("Failed to load doctor data");
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData({
        ...formData,
        photo_url: url,
      });
    }
  };

  const addDisease = () => {
    if (disease.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        disease: [...(prevData.disease || []), { name: disease }],
      }));
      setDisease("");
    }
  };

  const removeDisease = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      disease: prevData.disease?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const diseaseObject = (formData.disease || []).reduce(
        (acc, curr) => ({ ...acc, [curr.name]: "Treatment" }), 
        {}
      );

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/update/${id}`,
        { ...formData, disease: diseaseObject }
      );

      alert("Doctor profile updated successfully!");
      router.push("/doctors");
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("Failed to update doctor profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor profile?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/doctor/delete/${id}`);
        alert("Doctor profile deleted successfully!");
        router.push("/doctors");
      } catch (error) {
        console.error("Error deleting doctor:", error);
        setError("Failed to delete doctor profile");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading doctor profile...</div>;
  }

  if (error && !doctor) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Update Doctor Profile</h1>
        <button className={styles.backButton} onClick={() => router.push("/doctors")}>
          Back to Doctors
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Doctor Photo"
                  width={200}
                  height={200}
                  className={styles.doctorImage}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
            <div className={styles.uploadContainer}>
              <label htmlFor="photo_upload" className={styles.uploadLabel}>
                Change Photo
              </label>
              <input
                type="file"
                id="photo_upload"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="speciality">Speciality</label>
              <input
                type="text"
                id="speciality"
                name="speciality"
                value={formData.speciality || ""}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Experience (years)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                min="0"
                step="1"
                value={formData.experience || 0}
                onChange={handleNumberChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Diseases Treated</label>
              <div className={styles.diseaseInput}>
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Add disease treated"
                  className={styles.input}
                />
                <button type="button" onClick={addDisease} className={styles.addButton}>
                  Add
                </button>
              </div>
              <div className={styles.diseaseList}>
                {formData.disease?.map((item, index) => (
                  <div key={index} className={styles.diseaseTag}>
                    <span>{item.name}</span>
                    <button type="button" onClick={() => removeDisease(index)} className={styles.removeButton}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.actions}>
          <button type="button" onClick={() => router.push("/doctors")} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={styles.saveButton}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDoctorPage;
