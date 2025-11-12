// Dynamic import for ESM backend
export default async function handler(req: any, res: any) {
  const { default: app } = await import('../../backend/dist/index.js');
  return app(req, res);
}
