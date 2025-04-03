const fs = require('fs');
const path = require('path');

const projectStructure = {
  backend: {
    config: ['db.js'],
    controllers: ['authController.js', 'orderController.js', 'productController.js'],
    middleware: ['auth.js', 'error.js'],
    models: ['Order.js', 'Product.js', 'User.js'],
    routes: ['authRoutes.js', 'orderRoutes.js', 'productRoutes.js', 'userRoutes.js'],
    utils: ['generateToken.js'],
    files: ['.env', 'server.js']
  },
  frontend: {
    public: [],
    src: {
      assets: [],
      components: {
        auth: [],
        cart: [],
        checkout: [],
        common: [],
        product: [],
        user: []
      },
      pages: [
        'CartPage.jsx',
        'CheckoutPage.jsx',
        'HomePage.jsx',
        'LoginPage.jsx',
        'ProductPage.jsx',
        'ProfilePage.jsx',
        'RegisterPage.jsx',
        'ShopPage.jsx'
      ],
      redux: {
        actions: [],
        reducers: [],
        store: ['store.js']
      },
      files: ['App.js', 'index.css', 'index.js']
    },
    files: ['package.json', '.env']
  },
  rootFiles: ['.gitignore', 'package.json']
};

const createStructure = (basePath, structure) => {
  for (const [key, value] of Object.entries(structure)) {
    const dirPath = path.join(basePath, key);
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (Array.isArray(value)) {
      // Create files if not exist
      value.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (!fs.existsSync(filePath)) {
          console.log(`Creating file: ${filePath}`);
          fs.writeFileSync(filePath, '', 'utf8');
        }
      });
    } else {
      // Recursive call to handle nested structures
      createStructure(dirPath, value);
    }
  }
};

// Root directory where the project is located
const rootPath = path.join(__dirname, 'closet-cater');

// Create root files
createStructure(rootPath, { rootFiles: projectStructure.rootFiles });

// Create backend and frontend structure
createStructure(path.join(rootPath, 'backend'), projectStructure.backend);
createStructure(path.join(rootPath, 'frontend'), projectStructure.frontend);

console.log('Project structure is set up!');
