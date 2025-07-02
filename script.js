// Theme toggling
const themeBtns = {
  ds: document.getElementById('theme-ds'),
  da: document.getElementById('theme-da'),
  pbi: document.getElementById('theme-pbi'),
  dark: document.getElementById('theme-dark'),
  light: document.getElementById('theme-light'),
};
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
Object.entries(themeBtns).forEach(([theme, btn]) => {
  btn.onclick = () => setTheme(theme);
});
// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);

// Animate cards on scroll (viewport reveal)
function revealOnScroll() {
  const cards = document.querySelectorAll('.card');
  const trigger = window.innerHeight * 0.91;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top <= trigger) card.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Project fetching from GitHub
const username = 'Gshelar1122'; // Change to your account if needed
const featuredProjects = [
  'GayatriPatil', // highlight this portfolio repo
  // add more repo names here to feature
];
function makeProjectCard(repo) {
  const isFeatured = featuredProjects.includes(repo.name);
  return `
    <a href="${repo.html_url}" class="project-card${isFeatured ? ' featured' : ''}" target="_blank">
      <h3>${repo.name} ${isFeatured ? '<span class="featured-badge">⭐ Featured</span>' : ''}</h3>
      <div class="project-desc">${repo.description ? repo.description : 'No description provided.'}</div>
      <div class="project-meta">
        <span>📝 ${repo.language || 'N/A'}</span> &nbsp;|&nbsp;
        <span>⭐ ${repo.stargazers_count}</span>
      </div>
    </a>
  `;
}
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = `<div>Loading projects...</div>`;
  try {
    const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const data = await resp.json();
    if (!Array.isArray(data)) throw new Error('No repos found');
    // Filter out forks, sort to put featured on top
    let repos = data.filter(r => !r.fork);
    repos = repos.sort((a, b) => {
      const aFeat = featuredProjects.includes(a.name) ? -1 : 0;
      const bFeat = featuredProjects.includes(b.name) ? -1 : 0;
      if (aFeat !== bFeat) return aFeat - bFeat;
      return b.stargazers_count - a.stargazers_count;
    });
    grid.innerHTML = repos.slice(0, 6).map(makeProjectCard).join('');
  } catch (e) {
    grid.innerHTML = `<div>Could not load projects. Try again later.</div>`;
  }
}
window.addEventListener('DOMContentLoaded', loadProjects);

// Animate hero on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero').classList.add('animate-fade-in');
  setTimeout(() => {
    document.querySelectorAll('.card').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 400 + i * 180);
    });
  }, 400);
});
