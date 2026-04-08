// Language switcher logic
document.addEventListener("DOMContentLoaded", () => {
  const langSwitch = document.getElementById("lang-switch");

  if (langSwitch) {
    langSwitch.addEventListener("change", (event) => {
      const lang = event.target.value;

      // Redirect to localized version of the current page
      const currentPage = window.location.pathname.split("/").pop();
      const baseName = currentPage.replace(".html", "");

      // Example: index -> index.en.html / index.pt.html / index.es.html
      let newPage = `${baseName}.${lang}.html`;

      window.location.href = newPage;
    });
  }
});