# 🚀 Space Launch Explorer

A React-based web application for exploring space launch data using the [SpaceX API](https://github.com/r-spacex/SpaceX-API). This project includes authentication, protected routes, dynamic search/sort/pagination, and enriched detail views with deep linking—all styled with [Mantine UI](https://mantine.dev/).

---

## ✨ Features

- 🔒 **Authentication** with persisted login state using Zustand
- 🔐 **Protected Routes** (public/private pages via `AuthRoute`)
- 📃 **Launch List** with:
  - Search
  - Sorting (by name and date)
  - Pagination
- 📄 **Launch Detail Page** with enriched data
- 🌐 **Deep Linking** to launch detail via route params
- 🚫 **404 Not Found** page
- ⚡ **Loading States** using `Suspense` and React Query
- 💅 Styled entirely with Mantine UI

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query)
- [Mantine](https://mantine.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/space-launch-explorer.git
cd space-launch-explorer
