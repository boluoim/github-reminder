export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
	const currentTime = new Date();
	const userTime = new Date(currentTime.toLocaleString('en-US', { timeZone: env.TIMEZONE }));
	const hours = userTime.getHours();
	const reminderHours = env.REMINDER_HOURS.split('|').map(Number);

	if (!reminderHours.includes(hours)) return;

	const hasCommitted = await checkTodaysCommits(env);

	if (!hasCommitted) {
	  await sendTelegramMessage(env, 'No commits today. You can do it! 💪');
	}
  },

  async fetch(request: Request, env: Env) {
	const hasCommitted = await checkTodaysCommits(env);

	return new Response(JSON.stringify({
	  hasCommitted,
	  message: hasCommitted
		? "You've committed today! 🎉"
		: "No commits today. You can do it! 💪"
	}));
  }
};

async function checkTodaysCommits(env: Env) {
  const now = new Date();
  const todayStart = new Date(now.toLocaleString('en-US', { timeZone: env.TIMEZONE }));
  todayStart.setHours(0, 0, 0, 0);

  const since = todayStart.toISOString();

  try {
	const response = await fetch(
	  `https://api.github.com/users/${env.GITHUB_USERNAME}/events`,
	  {
		headers: {
		  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		  'Accept': 'application/vnd.github.v3+json',
		  'User-Agent': 'Github-Commit-Reminder'
		}
	  }
	);

	if (!response.ok) {
	  throw new Error(`GitHub API request failed: ${response.statusText}`);
	}

	const events: any[] = await response.json();

	return events.some(event => event.type === 'PushEvent' && new Date(event.created_at) >= todayStart);
  } catch (error) {
	console.error('Error fetching GitHub events:', error);
	return false;
  }
}

async function sendTelegramMessage(env: Env, message: string) {
	try {
		const response = await fetch(
			`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: env.TELEGRAM_CHAT_ID,
					text: message,
					parse_mode: 'HTML'
				})
			}
		)

		if (!response.ok) {
			throw new Error(`Failed to send telegram message: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error sending telegram message:', error);
	}
}
