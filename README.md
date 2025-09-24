# Product Management System Template

A modern, responsive Product Management System built with Vite + React + TypeScript.

## Features

- ✅ **Modern Tech Stack**: Built with Vite, React 19, and TypeScript
- ✅ **Product CRUD Operations**: Create, Read, Update, and Delete products
- ✅ **Search & Filter**: Search products by name/description and filter by category
- ✅ **Responsive Design**: Works beautifully on desktop and mobile devices
- ✅ **Type Safety**: Full TypeScript support with proper type definitions
- ✅ **Beautiful UI**: Modern gradient design with hover effects and animations
- ✅ **Stock Management**: Track product availability with visual indicators
- ✅ **Category Management**: Organize products by categories
- ✅ **Real-time Updates**: Instant UI updates for all operations

## Demo Screenshots

### Main Product List
![Product Management System](https://github.com/user-attachments/assets/efc508f8-8ba4-4e4a-8848-420b23de7118)

### Add Product Form
![Add Product Form](https://github.com/user-attachments/assets/a90fbae3-1c1d-4500-9af5-5cecace25dd3)

### Updated Product List
![Updated Product List](https://github.com/user-attachments/assets/63fabab8-54bf-40bc-8837-13dbea773d15)

## Technologies Used

- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[React 19](https://react.dev/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
- **[ESLint](https://eslint.org/)** - Code linting and formatting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nloperena/Product-Mangement-System-Template.git
cd Product-Mangement-System-Template
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ProductCard.tsx  # Individual product card component
│   ├── ProductForm.tsx  # Product creation/editing form
│   └── ProductList.tsx  # Product listing component
├── types/               # TypeScript type definitions
│   └── Product.ts       # Product-related types
├── utils/               # Utility functions
│   └── productUtils.ts  # Product-related helper functions
├── App.tsx              # Main application component
├── App.css              # Application-specific styles
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Features Overview

### Product Management
- **Add Products**: Create new products with name, description, price, category, and stock status
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products with confirmation dialog
- **Stock Tracking**: Visual indicators for in-stock vs out-of-stock items

### Search and Filtering
- **Text Search**: Search products by name or description
- **Category Filter**: Filter products by category
- **Real-time Filtering**: Instant results as you type

### User Interface
- **Responsive Design**: Optimized for all screen sizes
- **Modern Styling**: Beautiful gradient backgrounds and hover effects
- **Intuitive Forms**: Easy-to-use modal forms with validation
- **Visual Feedback**: Clear status indicators and interactive elements

## Customization

You can easily customize this template by:

1. **Adding new product fields**: Update the `Product` type in `src/types/Product.ts`
2. **Modifying styles**: Edit `src/App.css` and `src/index.css`
3. **Adding new categories**: Update the category options in `ProductForm.tsx`
4. **Implementing persistence**: Add database integration or localStorage

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help with this template, please open an issue on GitHub.

---

**Happy coding! 🚀**