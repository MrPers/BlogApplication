import { api, getToken } from './api.js';

const postsElement = document.getElementById('posts');
const filtersElement = document.getElementById('filter-buttons');
const sessionBadge = document.getElementById('session-badge');

function postTemplate(post) {
  return `
    <article class="post-card stack-md">
      <div class="stack-md">
        <div class="simple-row wrap space-between">
          <h3>${post.title}</h3>
          <span class="chip">${post.category}</span>
        </div>
        <p>${post.content}</p>
        <p class="meta">By ${post.author?.username || 'Unknown author'}</p>
      </div>
    </article>
  `;
}

function renderPosts(posts) {
  postsElement.innerHTML = posts.length
    ? posts.map(postTemplate).join('')
    : '<article class="post-card"><p>No posts found.</p></article>';
}

function renderFilters(posts) {
  const categories = ['all', ...new Set(posts.map((post) => post.category))];

  filtersElement.innerHTML = categories
    .map(
      (category, index) => `
        <button class="chip ${index === 0 ? 'active' : ''}" data-category="${category}" type="button">
          ${category === 'all' ? 'All categories' : category}
        </button>
      `
    )
    .join('');

  filtersElement.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', async () => {
      filtersElement.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const category = button.dataset.category;
      const posts = await api.getPosts(category === 'all' ? '' : category);
      renderPosts(posts);
    });
  });
}

async function init() {
  const posts = await api.getPosts();
  renderPosts(posts);
  renderFilters(posts);

  if (getToken()) {
    sessionBadge.classList.remove('hidden');
  }
}

init().catch((error) => {
  postsElement.innerHTML = `<article class="post-card"><p>${error.message}</p></article>`;
});

