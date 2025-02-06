import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    sayHello(name: string): string{
        return`hello ${name}`
    }
}
