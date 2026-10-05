(function () {
  "use strict";
  document.querySelectorAll("a[data-request-type]").forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof window.gtag !== "function") return;
      const requestType = link.dataset.requestType || "enquiry";
      window.gtag("event", requestType === "datasheet" ? "datasheet_click" : "quote_click", {
        product_id: link.dataset.product || "",
        source_page: window.location.pathname
      });
    });
  });
}());
