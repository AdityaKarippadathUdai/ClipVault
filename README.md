<div align="center">

# 📋 ClipVault

### A Modern Offline Clipboard & Code Snippet Manager built with Electron, React, TypeScript, and SQLite

Store, organize, search, and manage clipboard history and code snippets in a beautiful desktop application.

---

![Electron](https://img.shields.io/badge/Electron-38.x-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Electron Builder](https://img.shields.io/badge/Electron_Builder-Latest-2E8B57?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-764ABC?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue?style=for-the-badge)

</div>

---

# 📖 Overview

ClipVault is a modern desktop clipboard manager designed for developers, students, system administrators, and power users.

Instead of losing copied text forever, ClipVault continuously stores clipboard history locally on your computer and allows you to organize snippets into folders, search instantly, tag them, pin favorites, and manage everything through an intuitive desktop interface.

Unlike cloud clipboard tools, ClipVault is completely offline. Your data never leaves your machine.

---

# ✨ Features

## 📋 Clipboard History

- Automatic clipboard monitoring
- Stores clipboard history locally
- Unlimited history (configurable)
- Text snippets
- Multi-line clipboard support
- Duplicate detection
- Clipboard persistence
- Clipboard preview
- Clipboard statistics

---

## 💻 Code Snippets

- Save reusable code snippets
- Multiple programming languages
- Syntax highlighting
- Favorite snippets
- Tags
- Notes
- Rich metadata
- One-click copy

Supported languages include:

- JavaScript
- TypeScript
- Python
- Java
- C
- C++
- Go
- Rust
- SQL
- HTML
- CSS
- Shell
- Dockerfile
- JSON
- YAML
- Markdown

---

## 📁 Folder Organization

Organize snippets into folders.

Example:

```
Ubuntu
├── Docker
├── Git
├── Networking

React
├── Hooks
├── Components

Python
├── FastAPI
├── Django
```

Supports:

- Nested folders
- Unlimited depth
- Drag & drop organization
- Folder rename
- Folder deletion

---

## ⭐ Favorites

Mark frequently used snippets as favorites.

Quick access without searching.

---

## 🔍 Instant Search

Powerful search supports:

- Snippet title
- Code
- Tags
- Folder
- Language
- Notes

Search updates instantly.

---

## 🏷 Tags

Assign custom tags.

Examples:

```
#docker
#linux
#ubuntu
#react
#typescript
#git
#python
#networking
```

---

## 🎨 Beautiful UI

Modern dark interface inspired by:

- VS Code
- GitHub
- Notion
- Obsidian

Includes:

- Glassmorphism
- Rounded cards
- Smooth animations
- Responsive layouts
- Modern typography

---

## ⚡ Fast Performance

- SQLite database
- Zustand state management
- Instant search
- Local caching
- Lazy loading

Handles thousands of snippets smoothly.

---

## 💾 Local Database

Everything is stored locally.

No cloud.

No account.

No server.

No internet required.

---

## 🔐 Privacy First

ClipVault never uploads your clipboard.

Everything stays on your computer.

No telemetry.

No analytics.

No tracking.

---

# 🖼 Screenshots

Create a folder:

```
screenshots/
```

Recommended images:

```
screenshots/dashboard.png

screenshots/editor.png

screenshots/search.png

screenshots/folders.png

screenshots/settings.png
```

Example:

```markdown
## Dashboard

![Dashboard](screenshots/dashboard.png)

## Snippet Editor

![Editor](screenshots/editor.png)

## Search

![Search](screenshots/search.png)
```

---

# 🏗 Architecture

```
Electron
        │
        ▼
Main Process
        │
        ▼
IPC
        │
        ▼
Preload
        │
        ▼
React Renderer
        │
        ▼
Zustand Stores
        │
        ▼
SQLite Database
```

---

# 📂 Project Structure

```
electron/
│
├── database/
├── ipc/
├── repositories/
├── preload.ts
├── main.ts

src/
│
├── components/
├── pages/
├── layouts/
├── store/
├── hooks/
├── utils/
├── services/
├── constants/
├── types/

assets/

dist/

dist-electron/
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite

## Desktop

- Electron

## Database

- SQLite

## State Management

- Zustand

## Styling

- CSS
- Modern UI Components

---

# 🚀 Installation

Clone repository

```bash
git clone https://github.com/AdityaKarippadathUdai/ClipVault.git

cd ClipVault
```

Install dependencies

```bash
npm install
```

Start development

```bash
npm run dev
```

Run Electron

```bash
npm run electron
```

---

# 📦 Build

Build application

```bash
npm run build
```

Package application

```bash
npm run dist
```

---

# 📦 Generated Packages

Electron Builder creates

Windows

```
.exe
portable.exe
```

Linux

```
.AppImage

.deb

.rpm
```

macOS

```
.dmg

.zip
```

---

# ⚙ Development

Useful commands

```bash
npm run dev

npm run electron

npm run build

npm run dist

npm run lint
```

---

# 💾 Database

Uses SQLite.

Automatically:

- Creates database
- Creates tables
- Runs migrations
- Initializes repositories

No manual setup required.

---

# 🔒 Security

- Context Isolation
- IPC Bridge
- Secure Preload
- No Remote Module
- Local Database
- Offline Storage

---

# 📈 Performance

Optimized for

- Thousands of snippets
- Large clipboard history
- Fast startup
- Fast search

---

# 🧪 Testing Checklist

Verify:

- Clipboard monitoring
- Search
- Folder creation
- Snippet editing
- Favorites
- Tags
- Database persistence
- Theme switching
- Window state
- Copy functionality

---

# 🛣 Roadmap

## Version 1.1

- Clipboard images
- Better search
- Import/export
- Keyboard shortcuts

## Version 1.2

- Markdown preview
- AI search
- Duplicate finder

## Version 2.0

- Plugin system
- GitHub Gists
- Cloud sync
- Workspace support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork repository

2. Create branch

```
git checkout -b feature/new-feature
```

3. Commit

```
git commit -m "Add new feature"
```

4. Push

```
git push origin feature/new-feature
```

5. Open Pull Request

---

# 📝 License

Licensed under the MIT License.

See LICENSE for details.

---

# 👨‍💻 Author

**Aditya Karippadath Udai**

GitHub:

https://github.com/AdityaKarippadathUdai

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

<div align="center">

Made with ❤️ using Electron + React + TypeScript

</div>