declare module './prisma.js' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}
