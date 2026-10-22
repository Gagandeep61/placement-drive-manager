"use client";

import { useState } from "react";
import { JOB_TYPES } from "../lib/validators/driveValidator.js";

const emptyForm = {
  companyName: "",
  role: "",
  driveDate: "",
  eligibleBranch: "",
  minCGPA: "",
  jobType: "",
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

// one label + input + error text
function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function DriveForm({ onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // error can be text or a list of texts
  function errorFor(name) {
    const value = fieldErrors[name];
    if (!value) return "";
    return Array.isArray(value) ? value.join(", ") : value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = {
        companyName: form.companyName,
        role: form.role,
        driveDate: form.driveDate ? new Date(form.driveDate).toISOString() : "",
        eligibleBranch: form.eligibleBranch,
        minCGPA: form.minCGPA === "" ? null : Number(form.minCGPA),
        jobType: form.jobType === "" ? null : form.jobType,
      };

      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // response may not be JSON at all
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        if (res.status === 400 && data && data.details) {
          setFieldErrors(data.details);
        } else {
          setFormError("Something went wrong. Please try again.");
        }
        return;
      }

      // success only
      setForm(emptyForm);
      setSuccessMessage("Drive added successfully.");
      onSuccess();
    } catch {
      setFormError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold">Add a drive</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Field id="companyName" label="Company name" error={errorFor("companyName")}>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={form.companyName}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field id="role" label="Job role" error={errorFor("role")}>
          <input
            id="role"
            name="role"
            type="text"
            required
            value={form.role}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field id="driveDate" label="Drive date" error={errorFor("driveDate")}>
          <input
            id="driveDate"
            name="driveDate"
            type="datetime-local"
            required
            value={form.driveDate}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field id="eligibleBranch" label="Eligible branches" error={errorFor("eligibleBranch")}>
          <input
            id="eligibleBranch"
            name="eligibleBranch"
            type="text"
            required
            placeholder="CSE, IT, ECE"
            value={form.eligibleBranch}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field id="minCGPA" label="Minimum CGPA" error={errorFor("minCGPA")}>
          <input
            id="minCGPA"
            name="minCGPA"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.minCGPA}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field id="jobType" label="Job type" error={errorFor("jobType")}>
          <select
            id="jobType"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Not specified</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {formError && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</p>
      )}
      {successMessage && (
        <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Add drive"}
      </button>
    </form>
  );
}
