(function () {
  "use strict";
  document.querySelectorAll("a[data-request-type]").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.dataset.product === "RTM") return; // RTM uses the intent-specific shared tracker.
      if (typeof window.gtag !== "function") return;
      const requestType = link.dataset.requestType || "enquiry";
      window.gtag("event", requestType === "datasheet" ? "datasheet_click" : "quote_click", {
        product_id: link.dataset.product || "",
        request_type: requestType,
        source_page: window.location.pathname
      });
    });
  });
}());
