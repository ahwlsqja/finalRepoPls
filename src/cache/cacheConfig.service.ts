import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-yet";
import { ENV_REDIS_HOST_KEY, ENV_REDIS_PASSWORD, ENV_REDIS_PORT } from "src/common/const/env-keys.const";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {

    createCacheOptions(): CacheModuleOptions {
        const config: CacheModuleOptions = {
            store: redisStore,
            host: process.env[ENV_REDIS_HOST_KEY],
            password: process.env[ENV_REDIS_PASSWORD],
            port: parseInt(process.env[ENV_REDIS_PORT]),
            ttl :60,
        };
        return config
    }
}