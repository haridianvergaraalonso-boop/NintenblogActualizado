// scrollReveal.js

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // anima solo una vez
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.12}s`; // efecto cascada
    observer.observe(el);
  });
});

//burger button (im kinda hungry now...)
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("menu-btn");
  var sidebar = document.querySelector(".sidebar");

  if (!btn || !sidebar) return;

  btn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
  });
});