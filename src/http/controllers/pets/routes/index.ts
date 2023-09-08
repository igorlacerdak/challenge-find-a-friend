import { FastifyInstance } from 'fastify';
import { create } from '../create';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { fetchProfilePet } from '../fetch-profile-pet';
import { fetchPetByParams } from '../fetch-pet-by-params';

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, create);
  app.get('/pets/:id', fetchProfilePet);
  app.get('/pets', fetchPetByParams);
}
