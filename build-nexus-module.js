const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// Function to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to copy file
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Function to create the module zip
function createModuleZip() {
  console.log('🚀 Creating Nexus Module...');
  
  const moduleDir = path.join(__dirname, 'nexus-module');
  const distDir = path.join(moduleDir, 'dist');
  const jsDir = path.join(distDir, 'js');
  
  // Clean and create directories
  if (fs.existsSync(moduleDir)) {
    fs.rmSync(moduleDir, { recursive: true, force: true });
  }
  ensureDir(jsDir);
  
  console.log('📁 Setting up module structure...');
  
  // Copy built app.js
  copyFile(
    path.join(__dirname, 'dist', 'js', 'app.js'),
    path.join(jsDir, 'app.js')
  );
  
  // Copy index.html
  copyFile(
    path.join(__dirname, 'dist', 'index.html'),
    path.join(distDir, 'index.html')
  );
  
  // Copy react.svg
  copyFile(
    path.join(__dirname, 'dist', 'react.svg'),
    path.join(distDir, 'react.svg')
  );
  
  // Copy nxs_package.json
  copyFile(
    path.join(__dirname, 'nxs_package.json'),
    path.join(moduleDir, 'nxs_package.json')
  );
  
  // Create repo_info.json
  const repoInfo = {
    "name": "Enhanced P2P Marketplace with Simplified Token Browser",
    "description": "Advanced Nexus Wallet module featuring a comprehensive P2P marketplace with token pairs trading and simplified token discovery browser",
    "version": "1.0.0",
    "author": "Nexus Module Developer",
    "features": [
      "P2P Marketplace with Token Pairs",
      "Simplified Token Browser",
      "Market Data Refresh",
      "Trading Pair Creation",
      "Direct Trading Links",
      "Pagination and Filtering"
    ],
    "created": new Date().toISOString(),
    "build_info": {
      "webpack_version": "5.99.9",
      "bundle_size": "169 KiB",
      "modules": "426 KiB"
    }
  };
  
  fs.writeFileSync(
    path.join(moduleDir, 'repo_info.json'),
    JSON.stringify(repoInfo, null, 2)
  );
  
  console.log('📦 Creating zip file...');
  
  // Create zip
  const zipPath = path.join(__dirname, 'Nexus-p2p-marketplace.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✅ Module created successfully: ${zipPath}`);
      console.log(`📊 Total size: ${archive.pointer()} bytes`);
      
      // List contents
      console.log('\n📋 Module structure:');
      console.log('├── dist/');
      console.log('│   ├── js/');
      console.log('│   │   └── app.js');
      console.log('│   ├── index.html');
      console.log('│   └── react.svg');
      console.log('├── nxs_package.json');
      console.log('└── repo_info.json');
      
      // Clean up temporary directory
      fs.rmSync(moduleDir, { recursive: true, force: true });
      
      resolve(zipPath);
    });
    
    output.on('error', reject);
    archive.on('error', reject);
    
    archive.pipe(output);
    archive.directory(moduleDir, false);
    archive.finalize();
  });
}

// Main execution
if (require.main === module) {
  createModuleZip()
    .then((zipPath) => {
      console.log(`\n🎉 Nexus module ready for deployment: ${path.basename(zipPath)}`);
    })
    .catch((error) => {
      console.error('❌ Error creating module:', error);
      process.exit(1);
    });
}

module.exports = { createModuleZip };