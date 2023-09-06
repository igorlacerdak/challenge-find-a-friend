import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();

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
