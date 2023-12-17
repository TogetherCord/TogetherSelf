const
    Discord = require("discord.js-selfbot-v13"),
    dotenv = require("dotenv"),
    client = new Discord.Client({checkUpdate: false})
    Redis = require('ioredis');
    redis = new Redis({
        host: '172.17.0.2',
        port: 6379,
    });

dotenv.config()

async function start(){
    await client.login(process.env.TOKEN)
}

start()

client.on("ready", async () => {
    const r = new Discord.RichPresence()
        .setApplicationId('1180282303503675533')
        .setType('PLAYING')
        .setState('Come join Us !')
        .setName('❤️ • TogetherCord')
        .setDetails('The #1 Discord Tool')
        .setAssetsLargeImage('https://cdn.discordapp.com/attachments/1097939771390697653/1180313600078917632/anime.gif?ex=657cf7b3&is=656a82b3&hm=98e792237d351f38964e7bce03bb0b364d7eeacc58bccdd4a810c2ba60be4cb4&')
        .setAssetsLargeText('TogetherCord - The #1 Discord Tool')
        .addButton('❤️ | Github', 'https://github.com/TogetherCord')
        .addButton('👍 | Discord (Soon)', 'https://link.com/')

    client.user.setActivity(r);

    redis.subscribe('channel-' + process.env.DISCORDID, (err, count) => {
        if (err) {
            console.error('Failed to subscribe', err);
            return;
        }
        console.log(`Subscribed to ${count} channel. Listening for updates on the ${'channel-' + process.env.DISCORDID} channel.`);
    });

    redis.on('message', (channel, message) => {
        switch(message) {
            case 'test':
                console.log("test with docker api")
                break;
            case 'stop':
                break;
            default:
                console.log("default")
                break;
        }
    })
})
