/**
 * @file sync-shared-files.js
 * @description Copies relevant shared files to the service directories.
 */

const fs = require("fs");
const path = require("path");

// Map interfaces by service needs
const interfaceMap = {
  cart: ["ICart.ts", "ICartItem.ts"],
  order: ["IOrder.ts"],
  product: ["IProduct.ts"],
  search: ["IOrder.ts", "IProduct.ts"],
  user: ["IUser.ts", "IAddress.ts", "IPaymentMethod.ts"],
};

// Directory containing the shared interface files
const interfacesDir = path.resolve(__dirname, "interfaces");

// Copy each interface file to each service's interfaces directory
Object.entries(interfaceMap).forEach(([service, files]) => {
  const targetDir = path.resolve(__dirname, `../services/${service}/src/interfaces`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  files.forEach(file => {
    const srcFile = path.join(interfacesDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(targetDir, file));
      console.log(`Copied ${file} to ${service}/src/interfaces`);
    }
  });
});