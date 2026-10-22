export const JOB_TYPES = ["Internship", "Full-Time", "Other"];

const MAX_TEXT_LENGTH = 100;
const MAX_BRANCH_LENGTH = 200;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

function validateRequiredText(value, label) {
  if (typeof value !== "string" || value.trim() === "")
    return { error: `${label} is required` };

  const trimmed = value.trim();
  if (trimmed.length > MAX_TEXT_LENGTH)
    return { error: `${label} must not exceed ${MAX_TEXT_LENGTH} characters` };

  return { value: trimmed };
}

function validateDriveDate(value) {
  if (typeof value !== "string" || value.trim() === "")
    return { error: "Drive date is required" };

  const trimmed = value.trim();
  const match = DATE_PATTERN.exec(trimmed);
  if (!match) return { error: "Drive date must be in YYYY-MM-DD format" };

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return { error: "Drive date is invalid" };

  // reject impossible dates like 2026-02-31 (otherwise rolls over to March)
  const [, y, m, d] = match.map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  )
    return { error: "Drive date must be a real calendar date" };

  return { value: date };
}

function validateBranch(value) {
  if (typeof value !== "string")
    return { error: "Eligible branch is required" };

  const seen = new Set();
  const parts = [];
  for (const piece of value.split(",")) {
    const cleaned = piece.trim().toUpperCase();
    if (cleaned !== "" && !seen.has(cleaned)) {
      seen.add(cleaned);
      parts.push(cleaned);
    }
  }

  if (parts.length === 0) return { error: "Eligible branch is required" };

  const joined = parts.join(", ");
  if (joined.length > MAX_BRANCH_LENGTH)
    return { error: `Branches must not exceed ${MAX_BRANCH_LENGTH} characters` };

  return { value: joined };
}

function validateMinCGPA(value) {
  if (isBlank(value)) return { value: null };

  if (typeof value !== "number" && typeof value !== "string")
    return { error: "Minimum CGPA must be a number between 0 and 10" };

  const num = typeof value === "number" ? value : Number(value.trim());
  if (!Number.isFinite(num) || num < 0 || num > 10)
    return { error: "Minimum CGPA must be a number between 0 and 10" };

  return { value: num };
}

function validateJobType(value) {
  if (isBlank(value)) return { value: null };

  if (typeof value !== "string" || !JOB_TYPES.includes(value.trim()))
    return { error: `Job type must be one of: ${JOB_TYPES.join(", ")}` };

  return { value: value.trim() };
}

export function validateDrive(input) {
  if (!isPlainObject(input)) {
    return {
      valid: false,
      errors: { _body: "Input must be an object" },
      data: null,
    };
  }

  const errors = {};
  const data = {};

  const checks = [
    ["companyName", validateRequiredText(input.companyName, "Company name")],
    ["role", validateRequiredText(input.role, "Role")],
    ["driveDate", validateDriveDate(input.driveDate)],
    ["eligibleBranch", validateBranch(input.eligibleBranch)],
    ["minCGPA", validateMinCGPA(input.minCGPA)],
    ["jobType", validateJobType(input.jobType)],
  ];

  for (const [field, result] of checks) {
    if (result.error) errors[field] = result.error;
    else data[field] = result.value;
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors, data: valid ? data : null };
}