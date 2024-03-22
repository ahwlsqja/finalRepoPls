import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class NotificationsService {
    constructor(@InjectQueue('notificationQueue') private notificationQueue: Queue) {}

    async sendNotification(notificationData: any) {
        await this.notificationQueue.add('sendNotification', notificationData);
    }
}