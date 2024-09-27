# Blog Site

A dynamic and vibrant blog platform where users can create, view, and manage their posts. Built with Node.js, Express, MongoDB, and EJS, this blog website offers seamless post management, session handling, and user authentication.

## Features

- **User Authentication**: Users can securely sign up, log in, and log out.
- **Session Management**: Persistent sessions enable users to manage their posts without having to re-login.
- **Create & Manage Posts**: Users can create new blog posts, view their own posts, and browse posts from others.
- **Randomized Backgrounds**: The blog post creation page includes dynamic, randomized background images for a personalized experience.
- **Favicon Support**: Includes a favicon for improved branding and user interface.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: EJS (Embedded JavaScript templates), CSS, JavaScript
- **Session Management**: Express Session with MongoDB as the session store
- **Authentication**: Custom authentication using `bcryptjs` for password hashing

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blog-site.git
   ```

2. Navigate to the project directory:

   ```bash
   cd blog-site
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   ADSENSE_CLIENT=your_google_adsense_client_id
   ADSENSE_SLOT=your_google_adsense_slot_id
   API_KEY=your_mews_api_key
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

5. Start the MongoDB server (if not already running):

   ```bash
   mongod
   ```

6. Start the development server:

   ```bash
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`.

### Folder Structure

```bash
blog-site/
├── public/              # Static files like CSS, images, and client-side JavaScript
├── routes/              # Application routes (auth, posts, news)
├── views/               # EJS templates for frontend rendering
├── .env                 # Environment variables (excluded from version control)
├── app.js               # Main application entry point
├── package.json         # Node.js package dependencies
└── README.md            # Project documentation
```

## Key Routes

- `/`: Home page with a list of blog posts.
- `/login`: User login page.
- `/signup`: User registration page.
- `/create`: Create a new blog post.
- `/about`: About page with team information.

## Future Enhancements

- **Comment System**: Enable users to comment on blog posts.
- **Post Categories**: Organize posts into categories for easier navigation.
- **Post Editing**: Allow users to edit their existing blog posts.
- **Post Likes**: Add a like system to engage users further.

## Contributing

To contribute to this project, follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

**Note**: Make sure the `.env` file is included in your `.gitignore` file to prevent sensitive information from being uploaded to GitHub. 

```bash
# .gitignore
.env
node_modules/
``