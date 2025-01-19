"use client";
import React, { useState } from "react";

const EvaluateModal = ({ onSubmit, onClose }) => {
  const [essay, setEssay] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [feedback, setFeedback] = useState(""); // To store feedback response

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!essay || !criteria) {
      alert("Please upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append("essay", essay);
    formData.append("rubric", criteria);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setFeedback(data.feedback); // Store feedback response
      console.log(data.feedback)
      onSubmit({ feedback: data.feedback }); // Pass feedback to parent component
    } catch (error) {
      console.error("Error submitting files:", error);
      alert("An error occurred while submitting the files.");
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
        <h2 style={styles.header}>Evaluate Unfairness</h2>
        <p style={styles.subHeader}>Upload Files</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.uploadSection}>
            <label style={styles.label}>Upload your essay</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange(setEssay)}
              style={styles.fileInput}
            />
          </div>

          <div style={styles.uploadSection}>
            <label style={styles.label}>Upload the evaluation criteria</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange(setCriteria)}
              style={styles.fileInput}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>

        {feedback && (
          <div style={{ marginTop: "20px", color: "#333" }}>
            <h3>Feedback:</h3>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#f8f4ee",
    padding: "30px",
    borderRadius: "12px",
    width: "450px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#e74c3c",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subHeader: {
    fontSize: "1rem",
    marginBottom: "20px",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  uploadSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  fileInput: {
    display: "block",
    width: "100%",
    padding: "12px",
    border: "2px dashed #aaa",
    borderRadius: "8px",
    textAlign: "center",
    background: "#fafafa",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "12px",
    padding: "15px 30px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default EvaluateModal;
