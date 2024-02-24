const
    Discord = require("discord.js-selfbot-v13"),
    dotenv = require("dotenv"),
    client = new Discord.Client({checkUpdate: false})
    Redis = require('ioredis');
    spoofcustomstatus = require('./data/statuschanger.json')
    redis = new Redis({
        host: '172.17.0.4',
        port: 6379,
    });
    fetch = require('node-fetch');
    fs = require('fs');
    path = require('path');
    FormData = require('form-data');
    version = require('./data/version.json')

dotenv.config()

async function start(){
    await client.login(process.env.TOKEN)
}

start()



const localVersionPath = path.join(__dirname, 'data', 'version.json');
const remoteVersionUrl = 'http://togethercord.unknownandev.me:3333/update/version';
const remoteIndexUrl = 'http://togethercord.unknownandev.me:3333/update/get';

const fetchWithApiKey = (url, options = {}) => {
    const headers = {
        ...options.headers,
        "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
    };

    return fetch(url, { ...options, headers });
};

async function checkForUpdates() {
    const localVersion = JSON.parse(fs.readFileSync(localVersionPath, 'utf-8')).version;

    const response = await fetchWithApiKey(remoteVersionUrl);
    const data = await response.json();
    const remoteVersion = data.version;

    if (remoteVersion !== localVersion) {
        console.log('Une nouvelle version est disponible. Mise à jour en cours...');

        const file = fs.createWriteStream(path.join(__dirname, 'index.js'));
        fs.writeFileSync(localVersionPath, JSON.stringify({ version: remoteVersion }));

        const responseIndex = await fetchWithApiKey(remoteIndexUrl);
        const fileStream = fs.createWriteStream(path.join(__dirname, 'index.js'));
        responseIndex.body.pipe(fileStream);
        fileStream.on('finish', function () {
            fileStream.close();
        });

        fetchWithApiKey('http://togethercord.unknownandev.me:3333/instance/containers/restart', {
            method: 'POST',
            body: JSON.stringify({
                discordId: process.env.DISCORDID,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
            })
            .catch(error => {
            });
    } else {
    }
}

setInterval(checkForUpdates, 60 * 1000);

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
        .setType('COMPETING')
        .setState('Come join Us !')
        .setName('❤️ • TogetherCord')
        .setDetails('The #1 Discord Tool')
        .setAssetsLargeImage('https://cdn.discordapp.com/attachments/1185999438947299328/1210735375048249344/41001-1663083626_1.gif?ex=65eba42f&is=65d92f2f&hm=d59a04eb09fe2295b3d63a16457097a80b535cfbc8fbe07187ffc9f28016f414&')
        .setAssetsLargeText('TogetherCord - The #1 Discord Tool')
        .addButton('❤️ • Github', 'https://github.com/TogetherCord')
        .addButton('👍 • Discord', 'https://discord.gg/z87dpzTUJV')

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
            /*
            Hypesquad Badge

            Here you can change your hypesquad badge
             */
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

                /*
                Theme only here
                 */
            case 'discord-light':
                client.settings.setTheme('light')
                break;

            case 'discord-dark':
                client.settings.setTheme('dark')
                break;

                /*
                Status only here
                 */

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

                /*
                Backup commands here
                 */
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

                            fetch('http://togethercord.unknownandev.me:3333/files/upload', {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                                }
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

             /*
             Welcome to the Samsung
             RPC
              */

            case 'honkaiimpact':
                client.user.setSamsungActivity('com.miHoYo.bh3global', 'START')
                break

            case 'honkaistarrail':
                client.user.setSamsungActivity('com.miHoYo.bh3oversea', 'START')
                break

            case 'clashofclans':
                client.user.setSamsungActivity('com.supercell.clashofclans', 'START')
                break

            case 'clashroyale':
                client.user.setSamsungActivity('com.supercell.clashroyale', 'START')
                break

            case 'genshinimpact':
                client.user.setSamsungActivity('com.miHoYo.GenshinImpact', 'START')
                break

            case 'brawlstars':
                client.user.setSamsungActivity('com.supercell.brawlstars', 'START')
                break

            case 'amongus':
                client.user.setSamsungActivity('com.innersloth.spacemafia', 'START')
                break

            case 'minecraft':
                client.user.setSamsungActivity('com.mojang.minecraftpe', 'START')
                break

            case 'roblox':
                client.user.setSamsungActivity('com.roblox.client', 'START')
                break

            case 'fortnite':
                client.user.setSamsungActivity('com.epicgames.fortnite', 'START')
                break

            case 'stoprpc':
                client.user.setSamsungActivity('com.epicgames.fortnite', 'STOP')
                break


            default:
                console.log("No action found for " + message);
                break;
        }
    })
})
