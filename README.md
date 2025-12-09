# Expense Tracker

**English | [繁體中文](README.tw.md)**

A lightweight personal budgeting application that helps users record daily income and expenses, track spending categories, and view financial reports. All data is stored locally in the browser, supporting various views and analytics features.

[Demo](https://expense.cg01app.app/overview)

## Features

### Core Functionality

-   **Transaction Management**: Record income and expense transactions with amount, category, date, and description
-   **Category System**: 15 default categories (10 expense + 5 income) with custom category support
-   **Smart Filtering**: Filter transactions by type, category, date range, and amount range
-   **Real-time Search**: Quickly search transaction descriptions
-   **Financial Overview**: Dashboard displaying monthly income/expense, current balance, today's spending, and key metrics
-   **Data Analytics**:
    -   Income vs. expense trend charts
    -   Category expense pie charts
    -   6-month spending trend line charts
    -   Detailed category statistics table

### Multi-language Support

-   **Bilingual System**: Full support for English and Traditional Chinese
-   **Dynamic Switching**: Instantly switch languages without page reload
-   **Smart Translation**: Default category names automatically translate with language changes
-   **Persistent Localization**: Language preference automatically saved to local storage

### Themes & Appearance

-   **Dark/Light Mode**: Support for bright and dark themes
-   **System Follow**: Automatically follow system theme settings
-   **Responsive Design**: Perfect adaptation for desktop, tablet, and mobile screens
-   **Modern UI**: Beautiful interface based on Radix UI and Tailwind CSS

### Data Management

-   **Local Storage**: All data stored in browser localStorage, no backend service required
-   **Data Export**: Export data to CSV format
-   **Data Cleanup**: One-click delete all data functionality
-   **Category Management**:
    -   Add custom categories (icon, color, name)
    -   Edit and delete custom categories
    -   Reset to default categories

## Technology Stack

### Frontend Framework

-   **React 19.2.0**: Built with the latest React version
-   **TypeScript 5.9.3**: Complete type safety
-   **Vite 7.2.4**: Fast development build tool

### UI Component Library

-   **Radix UI**: Accessible, customizable headless components
    -   Complete components including Dialog, Select, Popover, Tabs, etc.
-   **Tailwind CSS 4.1.17**: Utility-first CSS framework
-   **Lucide React**: Beautiful icon library
-   **Recharts 2.15.4**: Powerful data visualization charts

### State Management & Routing

-   **React Context API**: Global state management (transactions, categories, language, theme)
-   **React Router 7.9.6**: Single page application routing system
-   **React Hook Form 7.66.1**: High-performance form handling
-   **Zod 4.1.13**: Type-safe form validation

### Internationalization

-   **i18next 25.7.1**: Powerful internationalization framework
-   **react-i18next 16.4.0**: React-specific i18n hooks
-   **Dynamic Category Translation**: Category name dynamic translation using Template Pattern

### Tools & Utilities

-   **date-fns 4.1.0**: Modern date handling library
-   **next-themes 0.4.6**: Theme switching management
-   **clsx + tailwind-merge**: Conditional style class management
-   **Sonner 2.0.7**: Elegant Toast notification system

## Project Structure

```
expense-tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Common components (icons, navigation, etc.)
│   │   ├── features/    # Feature components (transaction form, filters, stat cards, etc.)
│   │   └── ui/          # Base UI components (buttons, inputs, dialogs, etc.)
│   ├── context/         # React Context state management
│   │   ├── CategoriesContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── TransactionContext.tsx
│   ├── data/            # Static data
│   │   └── defaultCategories.ts
│   ├── hooks/           # Custom React Hooks
│   │   ├── useCategories.ts
│   │   └── useLocalStorage.ts
│   ├── i18n/            # Internationalization configuration
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── zh-TW.json
│   ├── pages/           # Page components
│   │   ├── AddTransaction.tsx
│   │   ├── Analytics.tsx
│   │   ├── Overview.tsx
│   │   ├── Settings.tsx
│   │   └── Transactions.tsx
│   ├── types/           # TypeScript type definitions
│   │   ├── category.ts
│   │   └── transaction.ts
│   ├── utils/           # Utility functions
│   │   ├── calculateStats.ts
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── validation.ts
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## Quick Start

### Requirements

-   Node.js 18.0.0 or higher
-   npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/wefor/expense-tracker
cd expense-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The application will start at `http://localhost:5173`

4. **Build for production**

```bash
npm run build
```

Build output will be in the `dist/` directory

5. **Preview production build**

```bash
npm run preview
```

### Available Commands

-   `npm run dev` - Start development server (with hot reload)
-   `npm run build` - Build for production (TypeScript compilation + Vite bundling)
-   `npm run lint` - Run ESLint code checks
-   `npm run preview` - Preview production build

## User Guide

### Adding Transactions

1. Click the **"+ Add Transaction"** button in the top right
2. Select transaction type (income or expense)
3. Enter amount
4. Select category
5. Select date
6. Optionally enter description
7. Click "Save Transaction"

### Filtering Transactions

1. Go to the "Transactions" page
2. Use the search box to quickly search transaction descriptions
3. Click the "Filters" button to expand advanced filtering
4. Set filter criteria:
    - Type: All / Expense / Income
    - Categories: Multi-select categories
    - Date Range: Select start and end dates
    - Amount Range: Drag slider to set amount range
5. Click "Apply" to view results

### Managing Categories

1. Go to the "Settings" page
2. Find the "Category Management" section
3. **Add Category**:
    - Click "Add Category" button
    - Select icon and color
    - Enter category name
    - Select type (income or expense)
    - Click "Save"
4. **Edit Category**: Click the edit icon on the category card
5. **Delete Category**: Click the delete icon on the category card
6. **Reset to Default**: Click "Reset to Default" button to restore original categories

### Switching Languages

1. Go to the "Settings" page
2. Find the "Language" settings section
3. Select language from dropdown:
    - English
    - 繁體中文 (Traditional Chinese)
4. Language will switch immediately, updating all UI text and default category names

### Switching Themes

1. Go to the "Settings" page
2. Find the "Appearance" settings section
3. Select theme:
    - Light Mode
    - Dark Mode
    - Follow System

### Exporting Data

1. Go to the "Settings" page
2. Find the "Data Management" section
3. Click "Export Data" button
4. System will download a CSV file containing all transactions

## Core Design Features

### Multi-language Architecture

The project uses an advanced internationalization architecture:

1. **Separation of Structure and Content**: Uses `CategoryTemplate` interface to separate category structure (ID, icon, color) from translated content (nameKey)
2. **Dynamic Generation**: Default categories are dynamically generated at runtime based on current language, optimized with `useMemo`
3. **Two-tier Category System**:
    - Default categories: Dynamically translated based on templates, cannot be edited or deleted
    - Custom categories: User-created, stored only in localStorage
4. **Complete Coverage**: 170+ translation keys covering all UI text, form validation messages, and category names

### Responsive Design

-   Uses Tailwind CSS responsive utility classes
-   Desktop: Multi-column layout with spacious card spacing
-   Tablet: Flexible grid system
-   Mobile: Single column layout with touch-friendly button sizes

### Performance Optimization

-   Uses `useMemo` and `useCallback` to avoid unnecessary recalculations
-   Lazy loading of large components
-   Virtualized long lists (transaction list)
-   Code splitting and tree shaking optimization

## Browser Support

-   Chrome/Edge 90+
-   Firefox 88+
-   Safari 14+
-   Supports all modern browser features

## Development Standards

### Code Style

-   ESLint for code checking
-   Follow React Hooks rules
-   TypeScript strict mode
-   Prettier auto-formatting (recommended configuration)

### Component Design Principles

-   Single Responsibility Principle
-   Props type safety
-   Reusability first
-   Appropriate state lifting

### Naming Conventions

-   Components: PascalCase (e.g., `TransactionForm`)
-   Files: kebab-case or PascalCase (e.g., `transaction-form.tsx` or `TransactionForm.tsx`)
-   Functions: camelCase (e.g., `formatCurrency`)
-   Constants: UPPER_SNAKE_CASE (e.g., `CATEGORY_TEMPLATES`)

## License

This project is developed for personal learning and use.

## Contributing

Issues and Pull Requests are welcome!

## Contact

For any questions or suggestions, please contact via GitHub Issues.
