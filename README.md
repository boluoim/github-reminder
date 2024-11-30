# GitHub Commit Reminder

[![Deploy to Cloudflare Workers](https://github.com/boluoim/github-reminder/actions/workflows/deploy.yml/badge.svg)](https://github.com/boluoim/github-reminder/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/package-json/v/boluoim/github-reminder)](https://github.com/boluoim/github-reminder/releases)

An automated tool built on Cloudflare Workers that checks your daily GitHub commits and sends reminder emails.

![github-reminder](https://github.com/user-attachments/assets/d5811bc6-24e2-4c91-a9af-99e273e9e876)


## Features

- Automatically checks daily GitHub commit status
- Sends friendly reminder emails in the afternoon and evening
- HTTP endpoint to query today's commit status
- Serverless architecture using Cloudflare Workers
- CI/CD pipeline using GitHub Actions

## Tech Stack

- TypeScript
- Cloudflare Workers
- MailChannels API
- GitHub API

## Installation

1. Clone the repository:

```bash
# clone the repository
git clone https://github.com/boluoim/github-reminder.git

# navigate to the project directory
cd github-reminder
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
- `EMAIL_RECIPIENT`: Email address to receive reminders
- `SENDER_EMAIL`: Email address to send reminders from

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
2. Checks are performed at 2 PM and 10 PM
3. If no commits are detected for the current day, a reminder email is sent
4. Provides an HTTP endpoint to manually check commit status

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
