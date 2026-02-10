
# Almanac

## Project Overview

**Almanac** is a modern, full-stack collaborative calendar and productivity platform. It enables users to create, join, and manage both personal and group calendars, with robust role-based access and a clean, responsive UI. Designed for teams and individuals, Almanac supports seamless event planning, member management, and secure authentication.

## Tech Stack

- **Frontend:** React (with TypeScript), Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based, secure session management
- **State Management:** React Context, custom hooks
- **Other:** Modern ESLint/Prettier setup, RESTful API, modular folder structure

## Key Features

- Personal and group calendars with member roles (Owner, Editor, Viewer)
- Secure authentication and session management
- Responsive, accessible UI with modern design
- Invite, add, and manage calendar members
- Role-based permissions for calendar actions
- Event and calendar CRUD operations
- Profile management and account details
- Modular, scalable codebase for easy maintenance

---

## Database Diagram

**Description:**

This model illustrates the core data relationships in Almanac:

- **Users** can own or join multiple calendars (personal or group).
- **Calendars** can have any number of members and events.
- **Members** represent a user's role (Owner, Editor, Viewer) within a specific calendar. Each user can only have one membership per calendar.
- **Events** are linked to calendars; each calendar can contain many events.

Key points:
- A user can create unlimited calendars and join others by invitation.
- Membership is unique per user/calendar pair (no duplicates).
- Member roles control permissions for calendar management and event editing.

The main control mechanism for managing calendars is the member role:\
- **Owners** can manage members and calendars.\
- **Editors** can manage the calendar with the same permissions as the
owner.\
- **Viewers** can only observe calendar events.

**Diagram:**

![Database Diagram](https://imgur.com/PZFRppW.jpeg)

---

## Database Model Manipulation & Management

This section explains how each core database model is manipulated and managed throughout the Almanac application, both in the backend (API, business logic) and frontend (user actions, API calls).

### User
- **Backend:**
    - User accounts are created, authenticated, and managed via secure endpoints (register, login, password reset, email verification).
    - Passwords are hashed with bcrypt. User preferences and calendar counts are updated on relevant actions (e.g., joining/leaving calendars).
- **Frontend:**
    - User registration, login, and profile management are handled via forms and context providers. State is synced with backend via REST API.

### Calendar
- **Backend:**
    - Calendars are created, updated, and deleted via RESTful endpoints. Each calendar is linked to an owner and can be either personal or group type.
    - On creation, an owner membership is created. Deletion cascades to remove all related members.
- **Frontend:**
    - Users can create, edit, and delete calendars through UI forms. All actions trigger API calls and update local state/context for live feedback.

### Member
- **Backend:**
    - Members represent a user's relationship to a calendar, including their role (owner, editor, viewer) and invitation status.
    - Adding/removing members updates both the Member collection and the user's calendar count. Role changes are validated for permissions.
- **Frontend:**
    - Users can invite, accept, decline, or remove members from calendars. Member lists and roles are managed via dedicated forms and modals, with all changes sent to the backend.

### PendingUser
- **Backend:**
    - Handles users who have registered but not yet verified their email. Stores verification codes and expiry.
- **Frontend:**
    - Registration flow includes email verification step, with UI feedback and API polling.

### RefreshToken
- **Backend:**
    - Stores refresh tokens for JWT-based authentication, supporting secure session management and token revocation.
- **Frontend:**
    - Token refresh is handled automatically by the auth client, keeping users logged in seamlessly.

---

## Copilot Usage

Almanac development leverages GitHub Copilot for:
- Line/File completion and code suggestions
- File management and organization
- Bug fixes and refactoring
- General planning for integration order and feature rollout

Copilot is used as a productivity tool to streamline development, assist with repetitive tasks, and help maintain code quality. I believe it is a very useful tool and would love to keep using it as it is now part of the future of development.
