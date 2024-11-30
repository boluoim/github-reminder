export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
	const currentTime = new Date();
	const userTime = new Date(currentTime.toLocaleString('en-US', { timeZone: env.TIMEZONE }));
	const hours = userTime.getHours();

	if (![14, 22].includes(hours)) return;

	const hasCommitted = await checkTodaysCommits(env);

	if (!hasCommitted) {
	  await sendReminderEmail(hours, env);
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

async function sendReminderEmail(hours: number, env: Env) {
  const isEvening = hours === 22;
  const subject = isEvening 
    ? "🚨 Last call for GitHub commits today!" 
    : "💻 Afternoon GitHub commit reminder";
  
  const body = isEvening
    ? "Hey! Just a final reminder that you haven't made any GitHub commits today. There's still time to keep that streak going! 🏃‍♂️"
    : "Hi there! Just checking in - you haven't made any GitHub commits today yet. Keep that coding streak alive! 💪";

  try {
	const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		personalizations: [{
		  to: [{ email: env.EMAIL_RECIPIENT }]
		}],
		from: {
			email: env.SENDER_EMAIL,
			name: 'GitHub Commit Reminder'
		},
		subject,
		content: [{ type: 'text/plain', value: body }]
	  })
	});

	if (!response.ok) {
	  throw new Error(`Failed to send email: ${response.statusText}`);
	}
  } catch (error) {
	console.error('Error sending reminder email:', error);
  }
}
