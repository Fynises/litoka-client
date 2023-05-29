export default function getDescription(prefix: string): string {
  switch (prefix) {
    case '!litoka': return 'Prints a summary of the litoka project with links to GitHub repository';
    case '!so': return 'Shout out your fellow streamers with or without a clip';
    case '!game': return 'Changes the current game of your stream';
    case '!title': return 'Changes the current title of your stream';
    case '!timezone': return 'Prints the current time of the specified timezone';
    case '!uptime': return 'Prints the stream uptime';
    case '!roll': return 'Roll a dice';
    case '!8ball': return 'Ask the magic 8-ball a question';
    default: return 'error';
  }
}
