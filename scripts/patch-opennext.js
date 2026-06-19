import fs from 'fs';
import path from 'path';

const targetFile = path.resolve('node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/wrangler-external.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (!content.includes('filter: /^cloudflare:/')) {
    const targetString = 'setup: async (build) => {';
    const replacement = `${targetString}\n            build.onResolve({ filter: /^cloudflare:/ }, ({ path }) => ({ path, external: true }));`;
    content = content.replace(targetString, replacement);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('Successfully patched opennextjs-cloudflare wrangler-external plugin for cloudflare:* imports');
  } else {
    console.log('opennextjs-cloudflare wrangler-external plugin is already patched');
  }
} else {
  console.warn('opennextjs-cloudflare wrangler-external.js not found');
}
