import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Connection {
    getName(): string{
        return null
    }
}

@Injectable()
export class MySQLConnection extends Connection {
    getName(): string {
        return 'MySQL';
    }
}

@Injectable()
export class MongoConnection extends Connection {
    getName(): string {
        return 'MongoDB';
    }
}

export function createConnection(configService: ConfigService): Connection{
    if (configService.get('DATABASE') == 'mysql') {
        return new MySQLConnection();
    } else {
        return new MongoConnection
    }
}