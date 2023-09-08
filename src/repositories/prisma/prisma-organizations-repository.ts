import { Organization, Prisma } from '@prisma/client';
import { OrganizationsRepository } from '../interface/organizations-repository';
import { prisma } from '@/db/prisma';

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  public async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization = await prisma.organization.create({ data });

    return organization;
  }

  public async findByEmail(email: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({ where: { email } });

    return organization;
  }

  public async findById(id: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({ where: { id } });

    return organization;
  }
}
