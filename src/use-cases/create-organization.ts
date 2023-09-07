import { OrganizationsRepository } from '@/repositories/interface/organizations-repository';
import { Organization } from '@prisma/client';
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error';
import { hash } from 'bcryptjs';

interface CreateOrganizationUseCaseRequest {
  name: string;
  adminName: string;
  email: string;
  password: string;
  cep: string;
  addressName: string;
  phone: string;
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization;
}

export class CreateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationsRepository) {}

  public async execute({
    name,
    adminName,
    email,
    password,
    cep,
    addressName,
    phone,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const organizationWithSameEmail = await this.organizationRepository.findByEmail(email);

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError();
    }

    const passwordHash = await hash(password, 8);

    const organization = await this.organizationRepository.create({
      org_name: name,
      admin_name: adminName,
      email,
      password_hash: passwordHash,
      cep,
      address_name: addressName,
      phone,
    });

    return { organization };
  }
}
