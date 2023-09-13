# LIFE4 Messenger Bot
## What is this?
This is the bot that runs on the discord server and listens for specific activity. This is not the application that is reading and announcing updates!
The purpose of this application is to enable commands to control the backend logic for admins without having to make a manual database change.

## Commands
The following commands can be run from the #admin-bot channel:
### commands
Returns the list of currently usable commands in discord (basically, this list)
### status
Returns the status of the bot. Can be used to determine if things are running smoothly or in an error state
### get submissions
Return the number of submissions currently ready for review
### turn on
Enables the announcer bot
### turn off
Disables the announcer bot

## Roadmap/Wishlist

### Welcome Messaging
Update the logic so that the bot is listening to relevant channels and sending a welcome message when a new user joins the discord server
### "Role Me" Logic
Allow for a command that manually updates and syncs user roles based on a number of factors. This could include (but not limited to):
- Roles related to a user's LIFE4 rank
- Patreon roles
- Rank Royale or specific event roles 