const app = require('./app');
const { sequelize, User, Post } = require('./models');
const { findOrCreateUser, ensurePost } = require('./seed');

const PORT = Number(process.env.PORT || 3000);

async function seedIfEmpty() {
  const userCount = await User.count();
  const postCount = await Post.count();

  if (userCount > 0 || postCount > 0) {
    return;
  }

  process.stdout.write('Database is empty — running initial seed...\n');

  const anton = await findOrCreateUser({
    username: 'anton',
    email: 'anton@example.com',
    password: 'password123',
  });

  const maria = await findOrCreateUser({
    username: 'maria',
    email: 'maria@example.com',
    password: 'password123',
  });

  const alex = await findOrCreateUser({
    username: 'alex',
    email: 'alex@example.com',
    password: 'password123',
  });

  const olena = await findOrCreateUser({
    username: 'olena',
    email: 'olena@example.com',
    password: 'password123',
  });

  const posts = [
    { title: 'Welcome to the tech blog', content: 'This is a sample tech post created by the seed script. We cover the latest trends in software development, cloud computing, and open source.', category: 'tech', userId: anton.id },
    { title: 'Getting started with Node.js', content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. In this post we explore how to set up your first Express server and connect it to a database.", category: 'tech', userId: anton.id },
    { title: 'REST API best practices', content: 'Designing a clean REST API requires thoughtful resource naming, proper HTTP status codes, and consistent error handling. Here are the key principles to follow.', category: 'tech', userId: anton.id },
    { title: 'Travel notes from Kyiv', content: "Kyiv is a stunning city with a rich history, vibrant street art, and incredible food. From Andriyivskyy Descent to the golden domes of Pechersk Lavra — every corner tells a story.", category: 'travel', userId: maria.id },
    { title: 'Weekend in Lviv', content: "Lviv's cobblestone streets, cozy cafés, and baroque architecture make it one of Europe's hidden gems. A perfect destination for a slow weekend getaway.", category: 'travel', userId: maria.id },
    { title: 'My morning routine', content: 'Starting the day with 20 minutes of reading, a healthy breakfast, and a short walk before opening a laptop has completely transformed my productivity and mood.', category: 'lifestyle', userId: maria.id },
    { title: 'Introduction to databases', content: 'Understanding the difference between SQL and NoSQL databases is fundamental for any backend developer. We compare MySQL, PostgreSQL, MongoDB, and Redis with real-world use cases.', category: 'tech', userId: alex.id },
    { title: 'Road trip through the Carpathians', content: 'Three days, two mountain passes, and one broken headlight later — our road trip through the Ukrainian Carpathians turned out to be the adventure of a lifetime.', category: 'travel', userId: alex.id },
    { title: 'Book review: The Pragmatic Programmer', content: 'A timeless classic that every software developer should read at least once. The Pragmatic Programmer covers everything from code quality to career advice with practical wisdom.', category: 'books', userId: alex.id },
    { title: 'Healthy eating on a budget', content: 'Eating well does not have to be expensive. With a bit of planning and smart grocery choices you can prepare nutritious meals for the whole week under $30.', category: 'lifestyle', userId: olena.id },
    { title: 'Top 5 productivity apps in 2024', content: 'From Notion for note-taking to Toggl for time tracking, these five apps have become essential tools in my daily workflow and helped me stay focused and organised.', category: 'tech', userId: olena.id },
    { title: 'Discovering Odesa by foot', content: 'Walking the Potemkin Stairs, exploring the colourful streets of the old city, and ending the day with fresh seafood at the harbour — Odesa is a city best discovered on foot.', category: 'travel', userId: olena.id },
  ];

  for (const postData of posts) {
    await ensurePost(postData);
  }

  process.stdout.write('Initial seed completed.\n');
}

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedIfEmpty();
    app.listen(PORT, () => {
      process.stdout.write(`Server is running on http://localhost:${PORT}\n`);
    });
  } catch (error) {
    process.stderr.write(`Server startup failed: ${error.message}\n`);
    process.exit(1);
  }
}

startServer();
