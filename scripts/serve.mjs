import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = normalize(join(root, relative));
  if (!target.startsWith(root)) { response.writeHead(403).end('Forbidden'); return; }
  try { const info = await stat(target); if (!info.isFile()) throw new Error('Not a file'); response.writeHead(200, { 'content-type': types[extname(target)] || 'application/octet-stream' }).end(await readFile(target)); }
  catch { response.writeHead(404).end('Not found'); }
});
server.listen(port, () => console.log(`Vale Fight Manager em http://localhost:${port}`));
