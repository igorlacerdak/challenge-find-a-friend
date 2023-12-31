import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { organizationsRoutes } from './http/controllers/organizations/routes';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { petsRoutes } from './http/controllers/pets/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(organizationsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error.',
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
});
