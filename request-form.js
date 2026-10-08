(function () {
  "use strict";

  const form = document.getElementById("productRequestForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const clean = (value, fallback, maxLength) => {
    const normalized = String(value || "").replace(/[<>]/g, "").trim();
    return (normalized || fallback).slice(0, maxLength);
  };

  const product = clean(params.get("product"), "General enquiry", 100);
  const series = clean(params.get("series"), "", 100);
  const requestType = clean(params.get("request_type"), "general enquiry", 40);
  const sourcePage = clean(params.get("source_page"), document.referrer || "request.html", 180);
  const selectedLabel = series && !product.toLowerCase().includes(series.toLowerCase())
    ? `${series} — ${product}`
    : product;

  document.getElementById("productInput").value = product;
  document.getElementById("seriesInput").value = series;
  document.getElementById("requestTypeInput").value = requestType;
  document.getElementById("sourcePageInput").value = sourcePage;
  document.getElementById("productDisplay").textContent = selectedLabel;
  document.getElementById("subjectInput").value = `${requestType === "datasheet" ? "Datasheet request" : "Website enquiry"} — ${selectedLabel}`;

  if (requestType === "datasheet") {
    document.getElementById("requestHeading").textContent = "Request a Datasheet";
    document.getElementById("requestIntro").textContent = "Confirm your contact details and our team will send the requested product information as soon as possible.";
  } else if (requestType === "quote") {
    document.getElementById("requestHeading").textContent = "Discuss Your Requirement";
    document.getElementById("requestIntro").textContent = "Tell us which product you are considering. Additional requirements are optional and our engineering team will follow up directly.";
  }

  const isTechnical = requestType === "technical";
  if (isTechnical) {
    document.getElementById("requestHeading").textContent = "Discuss Your RF Amplifier Requirements";
    document.getElementById("requestIntro").textContent = "Start with the band, output power and waveform you have in mind. Include duty cycle, cooling or control requirements if known.";
    document.querySelector('label[for="company"]').textContent = "Company (optional)";
    document.getElementById("company").required = false;
    document.querySelector('label[for="message"]').textContent = "Describe your RF requirements *";
    const message = document.getElementById("message");
    message.required = true;
    message.placeholder = "Frequency band, output power, waveform and duty cycle. Add any questions or constraints.";
    message.setAttribute("aria-describedby", "messageError");
    const error = document.createElement("span");
    error.className = "field-error";
    error.id = "messageError";
    error.setAttribute("aria-live", "polite");
    message.after(error);
    document.getElementById("changeProductLink").textContent = "Back to the article";
    document.getElementById("changeProductLink").href = "insights/adjustable-bias-rf-power-amplifier-class-a-ab/index.html";
  }

  if (product === "General enquiry") {
    document.getElementById("selectedProductPanel").classList.add("general-enquiry");
    document.getElementById("changeProductLink").textContent = "Browse products";
  }

  const requiredFields = isTechnical ? ["name", "email", "message"] : ["name", "company", "email"];
  const validate = () => {
    let valid = true;
    requiredFields.forEach((id) => {
      const input = document.getElementById(id);
      const error = input.parentElement.querySelector(".field-error");
      let message = "";
      if (!input.value.trim()) message = "This field is required.";
      else if (id === "email" && !input.validity.valid) message = "Enter a valid email address.";
      input.setAttribute("aria-invalid", message ? "true" : "false");
      error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  };

  requiredFields.forEach((id) => {
    document.getElementById(id).addEventListener("input", validate);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const button = document.getElementById("submitButton");
    const status = document.getElementById("formStatus");
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");

      form.hidden = true;
      document.getElementById("requestSuccess").hidden = false;
      if (typeof window.gtag === "function") {
        window.gtag("event", requestType === "datasheet" ? "datasheet_submit" : "enquiry_submit", {
          product_id: product,
          product_series: series,
          source_page: sourcePage
        });
      }
    } catch (error) {
      status.textContent = "We could not send your request. Please try again or email xander@laseraegis.dev.";
      button.disabled = false;
      button.textContent = "Submit Request";
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
