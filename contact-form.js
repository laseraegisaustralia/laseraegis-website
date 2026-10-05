(function () {
  "use strict";
  const form = document.getElementById("generalContactForm");
  if (!form) return;

  const fields = ["contactName", "contactEmail", "contactCompany", "contactMessage"];
  const validate = () => {
    let valid = true;
    fields.forEach((id) => {
      const input = document.getElementById(id);
      const error = input.parentElement.querySelector(".field-error");
      let message = "";
      if (!input.value.trim()) message = "This field is required.";
      else if (id === "contactEmail" && !input.validity.valid) message = "Enter a valid email address.";
      input.setAttribute("aria-invalid", message ? "true" : "false");
      error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  };

  fields.forEach((id) => document.getElementById(id).addEventListener("input", validate));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const button = document.getElementById("contactSubmitButton");
    const status = document.getElementById("contactFormStatus");
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "";
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");
      form.hidden = true;
      document.getElementById("contactSuccess").hidden = false;
      if (typeof window.gtag === "function") window.gtag("event", "contact_submit", { source_page: "contact.html" });
    } catch (error) {
      status.textContent = "We could not send your message. Please try again or email xander@laseraegis.dev.";
      button.disabled = false;
      button.innerHTML = 'Submit <span aria-hidden="true">&rarr;</span>';
    }
  });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const open = toggle.classList.toggle("open");
    links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    toggle.classList.remove("open");
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }), { threshold: 0.12 });
  document.querySelectorAll(".rise").forEach((element) => observer.observe(element));
}());
