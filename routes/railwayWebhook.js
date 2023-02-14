const router = require('express').Router();
const bodyParser = require('body-parser');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
require('dotenv').config();
const hook = new Webhook(process.env.WEBHOOK_URL);

router.use(bodyParser.json());
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
        return res.status(400).send('Bad Request');
    }
});

module.exports = router;
