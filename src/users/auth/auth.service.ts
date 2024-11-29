import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// This is done to avoid callback hell
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('email in use');

    //1. Hash users password
    //a. Generate a salt
    // randomBytes(8) -> 1 byte has two digtis so 8 bytes have 16 digits
    // toString('hex') -> translates bytes to hex number

    const salt = randomBytes(8).toString('hex');

    //2.Hash the salt and the password together
    // length of the hash here is 32 digits
    // Buffer type is a global class used to handle raw binary data.
    // Buffers are primarily designed to work with binary data streams,
    // such as files, network protocols, or other raw data.
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //3.Join the hashed result and the salt together
    const hashedAndSaltedPassword = salt + '.' + hash.toString('hex');

    //4.Create a new user and save it
    const user = await this.usersService.create(email, hashedAndSaltedPassword);

    //5.return the user
    return user;
  }

  async signin(email: string, password: string) {
    // Find a user with the given email in DB
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('user not found');
    // Split hash and salt from the password from DB
    const [saltStored, hashStored] = user.password.split('.');
    // salt the given password with the salt from DB and hash the result
    const hashCalculatedRaw = (await scrypt(
      password,
      saltStored,
      32,
    )) as Buffer;
    // compare the calculated hash with the hash in DB. If they match return true.
    if (hashStored !== hashCalculatedRaw.toString('hex'))
      throw new BadRequestException('bad password');

    return user;
  }
}
