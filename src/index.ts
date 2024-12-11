export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
	const currentTime = new Date();
	const userTime = new Date(currentTime.toLocaleString('en-US', { timeZone: env.TIMEZONE }));
	const hours = userTime.getHours();

	env.DEBUG && console.log('currentTime:', currentTime);
	env.DEBUG && console.log('userTime:', userTime);
	env.DEBUG && console.log('hours:', hours);

	if (+hours !== +env.REMINDER_HOUR) return;

	const message = await getTodaysCommitSummary(env);

	await sendTelegramMessage(env, message);
  },

  async fetch(request: Request, env: Env) {
	const message = await getTodaysCommitSummary(env);

	return new Response(message);
  }
};

async function sendTelegramMessage(env: Env, message: string): Promise<boolean> {
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

		return true;
	} catch (error) {
		console.error('Error sending telegram message:', error);
		return false;
	}
}

async function getTodaysCommitSummary(env: Env): Promise<string> {
	const now = new Date();
	const todayStart = new Date(now.toLocaleString('en-US', { timeZone: env.TIMEZONE }));
	todayStart.setHours(0, 0, 0, 0);

	env.DEBUG && console.log('todayStart:', todayStart);
	env.DEBUG && console.log('now:', now);

	try {
		const response = await fetch(
			`https://api.github.com/users/${env.GITHUB_USERNAME}/events`,
			{
				headers: {
					Authorization: `Bearer ${env.GITHUB_TOKEN}`,
					'Accept': 'application/vnd.github+json',
					'User-Agent': 'Github-Commit-Tracker'
				}
			}
		)

		const rateLimit = {
			remaining: response.headers.get('X-RateLimit-Remaining'),
			reset: response.headers.get('X-RateLimit-Reset')
		}

		if (response.status === 403 && rateLimit.remaining === '0') {
			return `🚨 GitHub rate limit exceeded. Please try again later. 🚨\n\n` +
				`Rate Limit: ${rateLimit.remaining} requests remaining. Reset at ${new Date(Number(rateLimit.reset) * 1000).toLocaleString()}.`;
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch GitHub events: ${response.statusText}`);
		}

		const events: any[] = await response.json();

		env.DEBUG && console.log('events:', events.slice(0, 3));

		const todaysPushEvents = events.filter(event => {
			const eventDate = new Date(event.created_at);
			env.DEBUG && console.log('event date:', eventDate, 'type:', event.type);
			return event.type === 'PushEvent' && eventDate >= todayStart;
		});

		if (todaysPushEvents.length === 0) {
			return 'No commits today. You can do it! 💪';
		}

		const repoStats = {} as Record<string, { commits: number, additions: number, deletions: number }>;
		
		// get commit details
		for (const event of todaysPushEvents) {
			const repoName = event.repo.name;
			if (!repoStats[repoName]) {
				repoStats[repoName] = { commits: 0, additions: 0, deletions: 0 };
			}
			
			for (const commit of event.payload.commits) {
				const commitDetails = await fetch(
					`https://api.github.com/repos/${repoName}/commits/${commit.sha}`,
					{
						headers: {
							Authorization: `Bearer ${env.GITHUB_TOKEN}`,
							'Accept': 'application/vnd.github+json',
							'User-Agent': 'Github-Commit-Tracker'
						}
					}
				).then(res => res.json()) as CommitDetails;
				
				repoStats[repoName].commits++;
				repoStats[repoName].additions += commitDetails.stats?.additions || 0;
				repoStats[repoName].deletions += commitDetails.stats?.deletions || 0;
			}
		}
		
		const totalStats = Object.values(repoStats).reduce(
			(acc, curr) => ({
				commits: acc.commits + curr.commits,
				additions: acc.additions + curr.additions,
				deletions: acc.deletions + curr.deletions
			}),
			{ commits: 0, additions: 0, deletions: 0 }
		);
		
		const repoList = Object.entries(repoStats)
			.map(([repo, stats]) => {
				const repoUrl = `https://github.com/${repo}`;
				return `• <a href="${repoUrl}">${repo}</a>: ${stats.commits} commits (+${stats.additions} -${stats.deletions})`;
			})
			.join('\n');
		
		return `📊 Today's Commit Summary:\n\n` +
			   `Total: ${totalStats.commits} commits (+${totalStats.additions} -${totalStats.deletions})\n\n` +
			   `Active Repositories:\n${repoList}\n\n` +
			   `Keep up the good work! 🎉`;
	} catch (error) {
		console.error('Error fetching GitHub events:', error);
		return 'Get commits summary failed ❌';
	}
}
