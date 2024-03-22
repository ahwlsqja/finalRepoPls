import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

export class NotificationsProducer {
    constructor(
        @InjectQueue('notificationQueue') 
        private readonly queue: Queue) {}

        async sendNotification(notificationData: any) {
            await this.queue.add('sendNotification', notificationData);
        }
}