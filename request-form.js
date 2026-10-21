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

  const isRTM = product === "RTM";
  if (isRTM) {
    document.body.classList.add("rtm-request-page");
    const variants = {
      resource: {
        heading: "Get the Free Radar Case Pack",
        intro: "See how RTM helps reduce supplier follow-up, trace change impacts and find evidence gaps. Enter your email for the 10-page radar case, review checklist and Excel / CSV references. RTM updates are optional.",
        label: "Your question (optional)",
        placeholder: "Anything you would like us to know about your engineering workflow?",
        button: "Get My Free Case Pack",
        confirmation: "Thank you. Read the engineering case PDF below, or download the complete pack. RTM updates are sent only if you opted in."
      },
      demo: {
        heading: "Arrange a Guided RTM Demo",
        intro: "See how RTM could fit your project. We’ll walk through a complete engineering workflow, then focus on the supplier responses, changes or review evidence that matter most to your team. Bring your questions—no installation or project files needed. If useful, we can discuss hands-on access or a tailored pilot afterwards.",
        label: "What would you like to see? (optional)",
        placeholder: "Supplier responses, requirement changes or verification evidence. Add a preferred time or time zone.",
        button: "Request a Demo Session",
        confirmation: "We will contact you to arrange a guided demonstration and confirm the workflow you want to see."
      },
      evaluation: {
        heading: "Request Hands-on RTM Evaluation Access",
        intro: "Try RTM on your own computer with a three-day evaluation licence. We will confirm your assessment window and activation steps before you start.",
        label: "Your evaluation task (optional)",
        placeholder: "What would you like to try? Add your operating system and preferred start date if known. Do not send project files at this stage.",
        button: "Request Evaluation Access",
        confirmation: "We will follow up to confirm the evaluation task, dates and activation steps. A licence has not yet been issued."
      },
      pilot: {
        heading: "Discuss a Project-specific RTM Pilot",
        intro: "If your project needs a different assessment window, discuss a tailored pilot. We will agree the duration, tasks, licence and service scope with you.",
        label: "Your pilot scope (optional)",
        placeholder: "Team size, assessment tasks, desired duration and project timing. Do not send project files at this stage.",
        button: "Discuss Pilot Terms",
        confirmation: "We will contact you to discuss a suitable pilot duration, scope and terms."
      },
      quote: {
        heading: "Request an RTM Quote",
        intro: "Tell us your project goal, team size, preferred duration and budget. We can shape a short-term pilot or a longer licence around your team, with the software, setup and support scope agreed before you start.",
        label: "Licence and deployment needs (optional)",
        placeholder: "Your project goal, expected computers, preferred licence term or pilot duration, and any setup or support needs.",
        button: "Request a Licence Quote",
        confirmation: "We will review your device count, preferred term and deployment needs before providing your quotation."
      }
    };
    const v = variants[requestType] || variants.demo;
    document.title = v.heading + " | LaserAegis Australia";
    document.getElementById("requestHeading").textContent = v.heading;
    document.getElementById("requestIntro").textContent = v.intro;
    document.getElementById("productDisplay").textContent = "RTM — Requirements Traceability Manager";
    document.getElementById("subjectInput").value = v.heading + " — LaserAegis Australia";
    document.querySelector('label[for="message"]').textContent = v.label;
    document.getElementById("message").placeholder = v.placeholder;
    document.getElementById("submitButton").textContent = v.button;
    document.querySelector("#requestSuccess p").textContent = v.confirmation;
    const back = document.getElementById("changeProductLink");
    back.textContent = "Back to RTM";
    back.href = "rtm.html";
    const successLink = document.querySelector("#requestSuccess a");
    successLink.href = "rtm.html";
    successLink.textContent = "Back to RTM";
  }

  const isResource = isRTM && requestType === "resource";
  const isEvaluation = isRTM && (requestType === "evaluation" || requestType === "quote" || requestType === "pilot");
  if (isResource) {
    ["name", "company"].forEach(id => {
      document.getElementById(id).required = false;
      document.querySelector(`label[for="${id}"]`).textContent = id === "name" ? "Name (optional)" : "Company (optional)";
    });
    const consent = document.createElement("div");
    consent.className = "form-field form-field-wide rtm-resource-consent";
    consent.innerHTML = '<label for="resourceConsent"><input type="checkbox" id="resourceConsent" name="rtm_follow_up_consent" value="yes"> Optional: send me occasional RTM updates and relevant engineering resources. I can unsubscribe at any time.</label><span class="field-error" aria-live="polite"></span>';
    form.querySelector(".form-grid").append(consent);
    form.querySelector(".form-privacy").textContent = "We use these details to process your resource request. RTM updates are optional. To withdraw your subscription, email xander@laseraegis.dev.";
    const asset = document.createElement("input"); asset.type = "hidden"; asset.name = "requested_resource"; asset.value = "radar_engineering_case_final_20261021"; form.append(asset);

  }
  if (isEvaluation) {
    const extra = document.createElement("div"); extra.className = "form-field form-field-wide rtm-setup-fields";
    extra.innerHTML = '<label for="rtmDevices">Expected computers (optional)</label><input type="number" id="rtmDevices" name="expected_devices" min="1" max="10000" placeholder="For example, 5"><span class="field-error" id="rtmDevicesError" aria-live="polite"></span><label for="rtmOS">Operating system (optional)</label><select id="rtmOS" name="operating_system"><option value="">Not yet decided</option><option>Windows</option><option>Ubuntu / Linux</option><option>macOS</option><option>Mixed environment</option></select>';
    form.querySelector(".form-grid").append(extra);
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

  const requiredFields = isResource ? ["email"] : isTechnical ? ["name", "email", "message"] : ["name", "company", "email"];
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
    const devices = document.getElementById("rtmDevices");
    if (devices && devices.value && !devices.validity.valid) {
      devices.setAttribute("aria-invalid", "true"); document.getElementById("rtmDevicesError").textContent = "Enter a whole number from 1 to 10,000, or leave blank."; valid = false;
    } else if (devices) { devices.setAttribute("aria-invalid", "false"); document.getElementById("rtmDevicesError").textContent = ""; }
    return valid;
  };

  requiredFields.forEach((id) => {
    document.getElementById(id).addEventListener("input", validate);
  });

  const initialButtonText = document.getElementById("submitButton").textContent;
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
      window.LaserAegisAttribution?.fillForm(form);
      const submissionData = new FormData(form);
      if (isResource) {
        submissionData.set("rtm_follow_up_consent", document.getElementById("resourceConsent").checked ? "yes" : "no");
        submissionData.set("consent_text_version", "rtm_optional_updates_20261021");
        submissionData.set("requested_at", new Date().toISOString());
      }
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");

      form.hidden = true;
      document.getElementById("requestSuccess").hidden = false;
      if (isResource) {
        const panel = document.createElement("div"); panel.className = "rtm-download-links";
        const assets = [
          ["assets/rtm/resources/rtm-radar-example-walkthrough.pdf", "Read the Engineering Case (PDF)"],
          ["assets/rtm/resources/rtm-radar-example-pack.zip", "Download the Complete Pack (ZIP)"]
        ];
        assets.forEach(([href, label]) => {
          const a = document.createElement("a"); a.href = href; if (href.endsWith(".zip")) a.download = ""; else { a.target = "_blank"; a.rel = "noopener"; } a.className = "btn"; a.textContent = label;
          a.addEventListener("click", () => { if (typeof window.gtag === "function") window.gtag("event", href.endsWith(".zip") ? "resource_download" : "resource_open", { product_id: "RTM", request_type: "resource", resource_id: "radar_engineering_case_final_20261021", file_format: href.endsWith("zip") ? "zip" : "pdf", ...window.LaserAegisAttribution?.eventFields() }); });
          panel.append(a);
        });
        document.getElementById("requestSuccess").append(panel);
        panel.querySelector("a").focus();
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", requestType === "datasheet" ? "datasheet_submit" : "enquiry_submit", {
          product_id: product,
          product_series: series,
          source_page: window.LaserAegisAttribution?.clean(sourcePage) || sourcePage,
          request_type: requestType,
          ...window.LaserAegisAttribution?.eventFields()
        });
        if (isRTM) window.gtag("event", "generate_lead", {
          product_id: "RTM", request_type: requestType, lead_type: isResource ? "resource" : "sales_enquiry",
          source_page: window.LaserAegisAttribution?.clean(sourcePage) || "request.html",
          ...window.LaserAegisAttribution?.eventFields()
        });
      }
    } catch (error) {
      status.textContent = "We could not send your request. Please try again or email xander@laseraegis.dev.";
      button.disabled = false;
      button.textContent = initialButtonText;
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
