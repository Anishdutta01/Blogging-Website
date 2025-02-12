# Blogging Website with REST Architecture

This is a blogging website built using a **RESTful** architecture with features like user authentication, blog creation, profile management, and more.

## Features

- **User Authentication**: 
  - Secure user and owner authentication using **bcrypt**. Passwords are hashed and salted for secure storage.
  - Login and logout features implemented using **cookie-parser** and **jsonwebtoken** to handle sessions and maintain user sessions securely.

- **Blog Management**:
  - Users can **create**, **edit**, and **like** blogs.
  - **Profile photo update** functionality for users using **MULTER** for handling file uploads.

- **Access Control**:
  - Restricted access to certain pages for users who are not logged in, ensuring that only authorized users can interact with specific features.

- **Flash Messages**:
  - Implemented **flash messages** for displaying real-time notifications and feedback to users (e.g., login success, errors).

