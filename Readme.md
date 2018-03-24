# Moderation Bot
## Installation:

### Acquire a discord token as shown here:
	https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

### Fill in the config.yml
	- Bot prefix
	- Owner ID
	- botToken
	- Server ID (in dev mod, right click the server and copy ID)
	- moderation log channel name (You should only set this once)

### Create the bot:
	https://discordapp.com/developers/applications/
    - Make it a bot user
    - Not public bot

### Finish Installation
Open the folder preferably with Visual Studio Code Integrated terminal or git bash.
In the opened terminal:
  Make sure you have npm installed:
  - node -v
  Install the required node modules:
  - npm install --save request
  - npm install --save discord.js
  - npm install --save util
  - npm install --save fs
  - npm install --save path

When in the same folder as the index.js, run the bot with the command `node .`
The bot should be running.

## Add the bot to your server as shown here:
	https://github.com/jagrosh/MusicBot/wiki/Adding-Your-Bot-To-Your-Server

### Give administrative permissions to the bot

## How to use

Let the bot setup it's channels on first launch and configure them as you wish, do not change the name.
In any channel you can execute the following commands (default prefix: !):

### Command: ! clear <number> <userName>#<discriminator>
	The bot will clear the <number> of past messages of that user.

### Command: ! warn <userName>#<discriminator> <reason>
	The bot will warn the user with the message that follows in it's reason.
