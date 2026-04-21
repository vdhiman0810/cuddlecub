const FORM_ENDPOINT = "https://formsubmit.co/ajax/rosydhiman2@gmail.com";

const form = document.querySelector("#enquiryForm");
const statusMessage = document.querySelector("#formStatus");
const emailInput = form.elements.email;
const phoneInput = form.elements.phone;
const emailError = document.querySelector("#emailError");
const phoneError = document.querySelector("#phoneError");

const phonePattern = /^(?:\+?1[\s.-]?)?(?:\(?[2-9][0-9]{2}\)?[\s.-]?)[2-9][0-9]{2}[\s.-]?[0-9]{4}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function getFormPayload(formElement) {
  const data = new FormData(formElement);
  return {
    ...Object.fromEntries(data.entries()),
    _cc: "varundhiman08@gmail.com",
    _subject: "New Cuddle Cub Day Care enquiry",
    _template: "table",
  };
}

function setFieldError(input, errorElement, message) {
  input.classList.toggle("field-invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  errorElement.textContent = message;
}

function validateEmail() {
  const email = emailInput.value.trim();

  if (!email) {
    setFieldError(emailInput, emailError, "Please enter your email address.");
    return false;
  }

  if (!emailPattern.test(email)) {
    setFieldError(emailInput, emailError, "Please enter a valid email address, like name@example.com.");
    return false;
  }

  setFieldError(emailInput, emailError, "");
  return true;
}

function validatePhone() {
  const phone = phoneInput.value.trim();

  if (!phone) {
    setFieldError(phoneInput, phoneError, "Please enter your phone number.");
    return false;
  }

  if (!phonePattern.test(phone)) {
    setFieldError(phoneInput, phoneError, "Please enter a valid Canadian phone number, like 519-555-1234.");
    return false;
  }

  setFieldError(phoneInput, phoneError, "");
  return true;
}

function validateRequiredFields() {
  const requiredFields = Array.from(form.querySelectorAll("[required]"));

  for (const field of requiredFields) {
    if (field.type === "checkbox" && !field.checked) {
      field.focus();
      setStatus("Please agree to be contacted before sending.", true);
      return false;
    }

    if (field.type !== "checkbox" && !field.value.trim()) {
      field.focus();
      setStatus("Please complete all required fields before sending.", true);
      return false;
    }
  }

  return true;
}

async function readResponseMessage(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

function getSubmissionErrorMessage(result) {
  if (result.message?.includes("web server")) {
    return "Please test from http://localhost:8000 or the live site at https://cuddlecubdaycare.ca. FormSubmit does not accept file:// previews.";
  }

  if (result.message?.toLowerCase().includes("activation")) {
    return "The enquiry form needs one-time email activation. Please open the FormSubmit activation email and click Activate Form.";
  }

  return result.message || "Something went wrong. Please try again or email us directly.";
}

function isSuccessfulSubmission(result) {
  return result.success === true || result.success === "true";
}

function clearFieldErrors() {
  setFieldError(emailInput, emailError, "");
  setFieldError(phoneInput, phoneError, "");
}

function validateEmailAndPhone() {
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  if (!isEmailValid) {
    emailInput.focus();
    return false;
  }

  if (!isPhoneValid) {
    phoneInput.focus();
    return false;
  }

  return true;
}

function validateFormFields() {
  if (!validateRequiredFields()) {
    return false;
  }

  if (!validateEmailAndPhone()) {
    setStatus("Please fix the highlighted field before sending.", true);
    return false;
  }

  setStatus("");
  return true;
}

emailInput.addEventListener("input", () => {
  if (emailInput.classList.contains("field-invalid")) {
    validateEmail();
  } else {
    setStatus("");
  }
});
emailInput.addEventListener("blur", validateEmail);
phoneInput.addEventListener("input", () => {
  if (phoneInput.classList.contains("field-invalid")) {
    validatePhone();
  } else {
    setStatus("");
  }
});
phoneInput.addEventListener("blur", validatePhone);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateFormFields()) {
    return;
  }

  const button = form.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Sending...";
  setStatus("");

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getFormPayload(form)),
    });
    const result = await readResponseMessage(response);

    if (!response.ok || !isSuccessfulSubmission(result)) {
      throw new Error(getSubmissionErrorMessage(result));
    }

    form.reset();
    clearFieldErrors();
    setStatus("Thanks. Your enquiry has been sent.");
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again or email us directly.", true);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
