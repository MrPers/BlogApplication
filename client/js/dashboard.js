import { api, clearToken, getToken } from './api.js';

const postForm = document.getElementById('post-form');
const myPostsElement = document.getElementById('my-posts');
const messageElement = document.getElementById('dashboard-message');
const formTitle = document.getElementById('form-title');
const cancelEditButton = document.getElementById('cancel-edit');
const logoutButton = document.getElementById('logout-button');

let editingPostId = null;

function showMessage(message) {
  messageElement.textContent = message;
}

function resetForm() {
  editingPostId = null;
  formTitle.textContent = 'Create Post';
  cancelEditButton.classList.add('hidden');
  postForm.reset();
}

function fillForm(post) {
  editingPostId = post.id;
  formTitle.textContent = 'Edit Post';
  cancelEditButton.classList.remove('hidden');
  postForm.elements.title.value = post.title;
  postForm.elements.category.value = post.category;
  postForm.elements.content.value = post.content;
}

function renderPosts(posts) {
  myPostsElement.innerHTML = posts.length
    ? posts
        .map(
          (post) => `
            <article class="post-card stack-md">
              <div class="simple-row wrap space-between">
                <h3>${post.title}</h3>
                <span class="chip">${post.category}</span>
              </div>
              <p>${post.content}</p>
              <div class="actions">
                <button data-action="edit" data-id="${post.id}" type="button">Edit</button>
                <button data-action="delete" data-id="${post.id}" class="secondary" type="button">Delete</button>
              </div>
            </article>
          `
        )
        .join('')
    : '<article class="post-card"><p>You have not created any posts yet.</p></article>';
}

async function loadMyPosts() {
  const posts = await api.getMyPosts();
  renderPosts(posts);

  posts.forEach((post) => {
    myPostsElement
      .querySelector(`[data-action="edit"][data-id="${post.id}"]`)
      ?.addEventListener('click', () => fillForm(post));

    myPostsElement
      .querySelector(`[data-action="delete"][data-id="${post.id}"]`)
      ?.addEventListener('click', async () => {
        try {
          await api.deletePost(post.id);
          showMessage('Post deleted successfully.');
          await loadMyPosts();
          resetForm();
        } catch (error) {
          showMessage(error.message);
        }
      });
  });
}

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(postForm).entries());

  try {
    if (editingPostId) {
      await api.updatePost(editingPostId, payload);
      showMessage('Post updated successfully.');
    } else {
      await api.createPost(payload);
      showMessage('Post created successfully.');
    }

    resetForm();
    await loadMyPosts();
  } catch (error) {
    showMessage(error.message);
  }
});

cancelEditButton.addEventListener('click', resetForm);

logoutButton.addEventListener('click', async () => {
  try {
    await api.logout();
  } catch (error) {
    showMessage(error.message);
  } finally {
    clearToken();
    window.location.href = './auth.html';
  }
});

if (!getToken()) {
  window.location.href = './auth.html';
} else {
  loadMyPosts().catch((error) => showMessage(error.message));
}

