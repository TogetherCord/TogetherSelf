const
    Discord = require("discord.js-selfbot-v13"),
    dotenv = require("dotenv"),
    client = new Discord.Client({checkUpdate: false})
    Redis = require('ioredis');
    spoofcustomstatus = require('./data/statuschanger.json')
    redis = new Redis({
        host: '172.17.0.2',
        port: 6379,
    });
    fetch = require('node-fetch');
    fs = require('fs');
    path = require('path');
    FormData = require('form-data');

dotenv.config()

async function start(){
    await client.login(process.env.TOKEN)
}

start()

client.on("messageCreate", async message => {
    const regex = /(discord(app)?.com\/gifts\/|discord\.gift\/)([a-zA-Z0-9]+)?/g
    const matches = message.content.match(regex)
    if (!matches) {
        return
    }
    for (const match of matches) {
        const code = match.split("/").pop()
        const res = await fetch(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, {
            method: "GET",
            headers: {"Authorization": process.env.TOKEN}
        })
        const json = await res.json();
        if (json.message === "Unknown Gift Code") {
        } else {
            const res = await fetch(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}/redeem`, {
                method: "POST",
                headers: {"Authorization": process.env.TOKEN}
            })
            const json = await res.json();
            if (json.message === "You are being rate limited.") {
            }
        }
    }
})


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
        .addButton('👍 | Discord', 'https://discord.gg/z87dpzTUJV')

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
            case 'hypesquad-balance':
                client.user.setHypeSquad('HOUSE_BALANCE')
                break;

            case 'hypesquad-bravery':
                client.user.setHypeSquad('HOUSE_BRAVERY')
                break;

            case 'hypesquad-brilliance':
                client.user.setHypeSquad('HOUSE_BRILLIANCE')
                break;

            case 'hypesquad-none':
                client.user.setHypeSquad('LEAVE')
                break;

            case 'discord-light':
                client.settings.setTheme('light')
                break;

            case 'discord-dark':
                client.settings.setTheme('dark')
                break;

            case 'online':
                client.user.setStatus('online')
                break;

            case 'idle':
                client.user.setStatus('idle')
                break;

            case 'dnd':
                client.user.setStatus('dnd')
                break;

            case 'invisible':
                client.user.setStatus('offline')
                break;

            case 'backup-friends':
                fetch('https://discord.com/api/v9/users/@me/relationships', {
                    method: 'GET',
                    headers: {
                        'Authorization': process.env.TOKEN,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const dirPath = './data';
                        const filePath = path.join(dirPath, 'friends.json');

                        if (!fs.existsSync(dirPath)) {
                            fs.mkdirSync(dirPath, { recursive: true });
                        }

                        if (!fs.existsSync(filePath)) {
                            fs.writeFileSync(filePath, '[]', 'utf8');
                        }
                        const friends = data.filter(friend => friend.type === 1);

                        fs.writeFile(filePath, JSON.stringify(friends), function (err) {
                            if (err) throw err;

                            const formData = new FormData();
                            formData.append('file', fs.createReadStream('./data/friends.json'));

                            fetch('http://90.103.73.192:3333/files/upload', {
                                method: 'POST',
                                body: formData
                            })
                                .then(response => response.json())
                                .then(result => {
                                    console.log('Success:', result);
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        });
                    })
                break;


            case 'status-spoof':
            function getRandomItem(array, previousItem) {
                var randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * array.length);
                } while (array[randomIndex] === previousItem);

                return array[randomIndex];
            }

                setInterval(() => {
                    var randomStatus = getRandomItem(spoofcustomstatus.status, randomStatus);
                    var randomEmoji = getRandomItem(spoofcustomstatus.emoji, randomEmoji);

                    client.settings.setCustomStatus({
                        status: spoofcustomstatus.pointstatus,
                        text: randomStatus,
                        emoji: `${randomEmoji}`,
                        expires: null,
                    });
                }, 3000);
                break;


            default:
                console.log("No action found for " + message);
                break;
        }
    })
})
