import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class NotificationsService {
    constructor(@InjectQueue('notificationQueue') private notificationQueue: Queue) {}

    async sendNotification(notificationData: any) {
        await this.notificationQueue.add('sendNotification', notificationData);

        // Bull은 자체적으로 redis 연결이 되었있기때문에 따로 초기화할 필요 X
        const userNotificationsKey = `user:${notificationData.name}:notifications`;
        await this.notificationQueue.client.lpush(userNotificationsKey, JSON.stringify(notificationData))
    }

    async getNotifications(name: string): Promise<any[]> {
        const userNotificationsKey = `user:${name}:notifications`;
        const notifications = await this.notificationQueue.client.lrange(userNotificationsKey, 0, -1);
        return notifications.map(notification => JSON.parse(notification));
    }
}