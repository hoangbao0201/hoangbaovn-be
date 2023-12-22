import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
    constructor(private readonly configService: ConfigService) {
        super();
    }
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
        try {
            // const pubClient = createClient({ url: `redis://:I4PYpDkmr6Eh8TeRM0a9Oe3cQUZroioc@redis-19513.c274.us-east-1-3.ec2.cloud.redislabs.com:19513` });
            const pubClient = createClient({ url: this.configService.get("URL_REDIS") });
            const subClient = pubClient.duplicate();

            await Promise.all([pubClient.connect(), subClient.connect()]);

            this.adapterConstructor = createAdapter(pubClient, subClient);
            console.log('Connected to Redis successfully!');
        } catch (error) {
            console.error('Failed to connect to Redis:', error.message);
            throw error;
        }
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        if (this.adapterConstructor) {
            server.adapter(this.adapterConstructor);
        } else {
            console.error(
                'Redis adapter not initialized. Make sure to call connectToRedis() before creating the server.',
            );
        }

        return server;
    }
}
