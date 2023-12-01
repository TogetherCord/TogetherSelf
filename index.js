const
    { Client } = require("discord.js-selfbot-v13"),
    dotenv = require("dotenv"),
    client = new Client({checkUpdate: false}),
    rpc = require("discord-rpc"),
    rpcClient = new rpc.Client({ transport: "ipc" })


dotenv.config()

async function start(){
    await client.login(process.env.TOKEN)
}
start()

client.on("ready", () => {
    console.log("Ready!")
    rpcClient.on("ready", () => {
        rpcClient.request("SET_ACTIVITY", {
            pid: process.pid,
            activity: {
                state: `TogetherCord the best Discord Manager`,
                details: `Come join us !`,
                assets: {
                    large_image: `https://www.gifcen.com/wp-content/uploads/2022/06/anime-girl-gif-9.gif`,
                    large_text: `Welcome to the #1 Discord Tool`,
                },
                buttons: [
                    { label: `❤️ | Github`, url: "https://github.com/TogetherCord" },
                    { label: "📧 | Discord", url: "https://test.fr" },
                ],
            },
        });
    });
    rpcClient.login({ clientId: "1180282303503675533" }).catch(console.error);
})