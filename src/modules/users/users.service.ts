import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}
  // async create() {
  //   const user = this.em.create(User, {
  //     name,
  //     email,
  //     onboarding: false,
  //     verified: false,
  //     profilePicture: null,
  //   });
  //   await this.em.persistAndFlush(user);
  //   return user;
  // }

  // async findOneByEmail(email: string) {
  //   return this.em.findOne(User, { email });
  // }

  // async findOneById(id: number) {
  //   try {
  //     return this.em.findOne(User, id);
  //   } catch (err) {
  //     throw new GraphQLError('Server Error', {
  //       extensions: { code: ERROR_CODES.INTERNAL_SERVER_ERROR },
  //     });
  //   }
  // }
}
