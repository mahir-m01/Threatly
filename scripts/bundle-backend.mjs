import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bundle the backend
await build({
  entryPoints: [join(__dirname, '../backend/src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: join(__dirname, '../frontend/api/server.cjs'),
  // Externalize all node_modules EXCEPT Prisma generated client
  external: ['@prisma/client/runtime/*'],
  packages: 'external',
  minify: false,
  mainFields: ['module', 'main'],
  sourcemap: false,
});

// Copy Prisma query engine binary
const generatedDir = join(__dirname, '../backend/src/generated');
const apiDir = join(__dirname, '../frontend/api');
const generatedApiDir = join(apiDir, 'generated');

// Create generated directory in api folder
if (!existsSync(generatedApiDir)) {
  mkdirSync(generatedApiDir, { recursive: true });
}

// Find and copy all .node files (Prisma engines) recursively
function copyNodeFiles(srcDir, destDir) {
  if (!existsSync(srcDir)) {
    console.log('⚠️  Generated directory not found, skipping engine copy');
    return;
  }
  
  const files = readdirSync(srcDir, { withFileTypes: true });
  
  for (const file of files) {
    const srcPath = join(srcDir, file.name);
    const destPath = join(destDir, file.name);
    
    if (file.isDirectory()) {
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }
      copyNodeFiles(srcPath, destPath);
    } else if (file.name.endsWith('.node')) {
      copyFileSync(srcPath, destPath);
      console.log(`📦 Copied Prisma engine: ${file.name}`);
    }
  }
}

copyNodeFiles(generatedDir, generatedApiDir);

console.log('✅ Backend bundled for Vercel serverless');
