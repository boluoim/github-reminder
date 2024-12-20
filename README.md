# GitHub Tracker

[![Deploy to Cloudflare Workers](https://github.com/boluoim/github-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/boluoim/github-tracker/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/package-json/v/boluoim/github-tracker)](https://github.com/boluoim/github-tracker/releases)

An automated tool built on Cloudflare Workers that checks your daily GitHub commits and sends reminders via Telegram.

![github-tracker](https://github.com/user-attachments/assets/50476ba7-c001-48a5-a160-d8656187cabd)


## Features

- 🔄 Automatically checks daily GitHub commit status
- 📱 Sends friendly reminders via Telegram at scheduled times
- 🌐 HTTP endpoint to query today's commit status
- ☁️ Serverless architecture using Cloudflare Workers
- 🚀 CI/CD pipeline using GitHub Actions

## Tech Stack

- TypeScript
- Cloudflare Workers
- Telegram Bot API
- GitHub API

## Installation

1. Clone the repository:

```bash
# clone the repository
git clone https://github.com/boluoim/github-tracker.git

# navigate to the project directory
cd github-tracker
```

2. Install dependencies:

```bash
npm install
```

## Configuration

You need to set the following environment variables in Cloudflare Workers:

- `TIMEZONE`: Your timezone (e.g., "America/New_York")
- `GITHUB_USERNAME`: Your GitHub username
- `GITHUB_TOKEN`: GitHub Personal Access Token
- `TELEGRAM_BOT_TOKEN`: Telegram Bot Token
- `TELEGRAM_CHAT_ID`: Telegram Chat ID
- `REMINDER_HOUR`: Hour to send daily reminder (24-hour format) (e.g., 23)
- `DEBUG`: Enable debug logging (optional, default: false)
  - Set to `true` to enable detailed logging of:
    - Today's start time
    - Current time
    - GitHub events data
    - Event dates and types

### GitHub Token Setup

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with the following scopes:
   - `read:user`
   - `repo`
3. Copy the token and save it as `GITHUB_TOKEN`

## Telegram Bot Setup

### 1. Create Bot
1. Find @BotFather on Telegram
2. Send `/newbot` command
3. Set bot name
4. Save the bot token

### 2. Create Private Group
1. Click "New Group" in Telegram
2. Name the group (e.g., "GitHub Reminder")
3. Add only your newly created bot
4. Set bot as administrator with following permissions:
   - Delete Messages
   - Pin Messages (optional)

### 3. Get Group ID
1. Start a private chat with your bot, send `/start`
2. Go back to group, send a message mentioning your bot
3. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find the "id" value in the "chat" object from returned JSON
5. This number is your `TELEGRAM_CHAT_ID`

### 4. Security Settings
Find @BotFather and configure:
1. `/setprivacy` - Choose Enable
2. `/setjoingroups` - Choose Disable (Prevents bot from being added to other groups)

After setup:
- ✅ Only you can see bot messages
- ✅ Bot cannot be added to other groups
- ✅ Messages are secure in private group
- ✅ You can check reminder history anytime

## Development

Local development:

```bash
npm run dev
```

Deploy to Cloudflare workers:

```bash
npm run deploy
```

## How It Works

1. The worker runs on a scheduled basis (see cron configuration in wrangler.toml)
2. Checks are performed at configured times (default: 2 PM and 10 PM)
3. If no commits are detected for the current day, a reminder is sent via Telegram
4. Provides an HTTP endpoint to manually check commit status

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

If you want to donate or sponsor this project, it will be greatly appreciated.

<a href="https://www.buymeacoffee.com/ryanliu"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ryanliu&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
