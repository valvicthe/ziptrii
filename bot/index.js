// /bot/index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(' ');
  const command = args[0].toLowerCase();

  // !balance
  if (command === '!balance') {
    const res = await pool.query('SELECT robux FROM users WHERE discord_id = $1', [message.author.id]);
    if (res.rows.length === 0) return message.reply("Link your account on the Ziptrii website first!");
    message.reply(`Your current balance: **${res.rows[0].robux} R$**.`);
  }

  // !coinflip [amount]
  if (command === '!coinflip') {
    const betAmount = parseInt(args[1]);
    if (!betAmount || betAmount <= 0) return message.reply("Enter a valid amount to flip.");

    const res = await pool.query('SELECT robux FROM users WHERE discord_id = $1', [message.author.id]);
    const user = res.rows[0];

    if (!user || user.robux < betAmount) return message.reply("Insufficient funds.");

    const isWin = Math.random() > 0.5;
    const newBalance = isWin ? user.robux + betAmount : user.robux - betAmount;

    await pool.query('UPDATE users SET robux = $1 WHERE discord_id = $2', [newBalance, message.author.id]);
    message.reply(isWin ? `🎉 You won! Balance: ${newBalance} R$.` : `💸 You lost! Balance: ${newBalance} R$.`);
  }
});

client.login(process.env.DISCORD_TOKEN);
