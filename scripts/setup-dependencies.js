// @ts-nocheck - This is a Node.js script using CommonJS
const fs = require("fs");
const path = require("path");

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENV === "production";

const rootDir = path.join(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const packageProdJsonPath = path.join(rootDir, "package.prod.json");

if (isProduction) {
  // In production, use the production package.json
  if (fs.existsSync(packageProdJsonPath)) {
    const prodPackageJson = JSON.parse(fs.readFileSync(packageProdJsonPath, "utf8"));
    fs.writeFileSync(packageJsonPath, JSON.stringify(prodPackageJson, null, 2));
    console.log("✅ Production dependencies configured");
  } else {
    console.log("⚠️  package.prod.json not found, using development dependencies");
  }
} else {
  // In development, ensure we're using yalc
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  if (
    packageJson.dependencies["@ozdemircibaris/react-image-editor"] !== "file:.yalc/@ozdemircibaris/react-image-editor"
  ) {
    packageJson.dependencies["@ozdemircibaris/react-image-editor"] = "file:.yalc/@ozdemircibaris/react-image-editor";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Development dependencies configured (yalc)");
  }
}
