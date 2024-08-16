require("dotenv").config({ path: "./config/.env" });
const config = require("./config/config.json");

const TelegramBot = require("node-telegram-bot-api");
const telegram_bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const cron = require("node-cron");

async function start() {
    let current_time_object = new Date();
    let current_time = `${current_time_object.getHours()}:${current_time_object.getMinutes()}`;

    console.log("🎉 Server is running")
    console.log(`❗ This is how your date looks like: ${current_time}`)
    console.log("❗ Make sure your schedule is correct with the time object above")
}

async function mainLoop() {
	const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

	let current_time_object = new Date();

	let current_day = weekdays[current_time_object.getDay()];
	let current_time = `${current_time_object.getHours()}:${current_time_object.getMinutes()}`;
	let future_time = `${current_time_object.getHours()}:${current_time_object.getMinutes() + 5}`;

	if (config[current_day][current_time]) {
		let subject = config[current_day][current_time].subject;
		telegram_bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `${subject} is ending now`);
	}

	if (config[current_day][future_time]) {
		let subject = config[current_day][future_time].subject;
		telegram_bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `5 minutes remaining in ${subject}`);
	}
}

start()

cron.schedule(`*/1 * * * *`, () => {
	mainLoop();
});
