import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SampleService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async save(test: string) {
        await this.cacheManager.set('test', test);
        return true;
    }

    async find() {
        const test = await this.cacheManager.get('test');
        return test;
    }
}