# GitHub Tracker

[![Deploy to Cloudflare Workers](https://github.com/boluoim/github-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/boluoim/github-tracker/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/package-json/v/boluoim/github-tracker)](https://github.com/boluoim/github-tracker/releases)

An automated tool built on Cloudflare Workers that checks your daily GitHub commits and sends reminders via Telegram.

![github-tracker](https://github.com/user-attachments/assets/d5811bc6-24e2-4c91-a9af-99e273e9e876)


## Features

- Automatically checks daily GitHub commit status
- Sends friendly reminders via Telegram at scheduled times
- HTTP endpoint to query today's commit status
- Serverless architecture using Cloudflare Workers
- CI/CD pipeline using GitHub Actions

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
- `REMINDER_HOURS`: Scheduled hours to send reminders (e.g., "14|22")

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
