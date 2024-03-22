import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('notificationQueue')
export class NotificationsProcessor {
    @Process('sendNotification')
    async handleSendNotification(job: Job) {
        const notificationData = job.data;
        console.log(`알림: ${notificationData.message}`)
    }
}