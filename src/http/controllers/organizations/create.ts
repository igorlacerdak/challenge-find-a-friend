import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists-error';
import { makeCreateOrganizationUseCase } from '@/use-cases/factories/make-create-organization-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationBodySchema = z.object({
    name: z.string(),
    adminName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string().regex(/^\d{5}-\d{3}$/, 'Insert valid format for CEP'),
    addressName: z.string(),
    phone: z.string().regex(/^\(?\d{2}\)? ?(?:\d{4,5}-?\d{4})$/, 'Insert valid phone number'),
  });

  const { name, adminName, email, password, addressName, cep, phone } = createOrganizationBodySchema.parse(
    request.body,
  );

  try {
    const createOrganizationUseCase = makeCreateOrganizationUseCase();

    await createOrganizationUseCase.execute({
      name,
      addressName,
      adminName,
      cep,
      email,
      password,
      phone,
    });

    reply.status(201).send({ message: 'Organization created!' });
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}
