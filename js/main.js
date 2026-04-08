// ==============================
// Mobile Hamburger Menu Toggle
// ==============================
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

if(hamburger && menu){
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}