/**
 * Entry point
 * @authors Moritz Tim W.
 * @version 0.1.0
 */

import robot from 'robotjs';

/** Represents an instance of Minecraft */
class Minecraft {
    /**
     * Create a new Minecraft instance
     * @param {string} version version name
     * @param {object} options configuration options from options.txt
     * @param {Chat} chat Instance of Chat
     * @param {Command[]} commands available commands
     */
    constructor(version, options, chat, commands) {
        this.version = version;
        this.config = options;
        this.chat = chat;
        this.commands = commands;
    }
}

/** Represents the chat within an instance of Minecraft */
class Chat {
    /**
     * Create a new Chat instance
     * @param {string} key the key to open the chat
     * @param {string} commandKey the key to open the chat with the command prefix already typed
     * @param {string} commandPrefix the command prefix
     * @param {Command[]} commands available commands
     */
    constructor(key, commandKey, commandPrefix) {
        this.key = key;
        this.commandKey = commandKey;
        this.commandPrefix = commandPrefix;
    }
}

/** Represents a command within an instance of Minecraft */
class Command {
    /**
     * Create a new Command instance
     * @param {string|string[]} names the name and aliases of the command
     */
    constructor(...names) {
        this.names = names;
    }
}