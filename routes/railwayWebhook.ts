import express from 'express';
const router = express.Router();
import { Webhook, MessageBuilder } from 'discord-webhook-node';
import dotenv from 'dotenv';
dotenv.config();
const hook = new Webhook(process.env.WEBHOOK_URL);

router.post('/', async (req, res) => {
    if (req.query.key !== process.env.WEBHOOK_KEY) return res.status(401).send('401 Unauthorized');

    try {
        const payload = req.body;
        const statusTitle = {
            BUILDING: { title: `:bricks: Building... :bricks:`, color: '#ff3482' },
            DEPLOYING: { title: `:rocket: Deploying... :rocket:`, color: '#5319ff' },
            SUCCESS: { title: `:tada: Success! :tada:`, color: '#b3ef27' },
        };
        const deploymentUrl = `https://railway.app/project/${payload.project.id}/service/${payload.service.id}?id=${payload.deployment.id}`;
        const embed = new MessageBuilder()
            .setAuthor(`${payload.deployment.creator.name} triggered a new event on ${payload.project.name}!`, payload.deployment.creator.avatar, deploymentUrl)
            .setTitle(statusTitle[payload.status].title)
            .setURL(deploymentUrl)
            .setColor(statusTitle[payload.status].color)
            .setTimestamp(new Date(payload.timestamp))
            .setDescription(`Triggered via ${payload.deployment.meta.repo ? '***GitHub***' : '***Railway CLI***'}.`);

        if (payload.deployment.meta.repo) {
            embed.addField('Repo:', payload.deployment.meta.repo, true);
            embed.addField('Branch:', payload.deployment.meta.branch, true);
            embed.addField('Commit message:', payload.deployment.meta.commitMessage);
        }

        await hook.send(embed);
        res.status(200).send('Successfuly sent webhook!');
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});

export default router;
