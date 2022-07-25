/**
 * Entry point
 * @authors Moritz Tim W.
 * @version 0.1.0
 */

import robot from 'robotjs';

const defaultPrefix = '/';
const optionsFilePath = '/options.txt';

/** Represents an instance of Minecraft */
class Minecraft {

	/**
	 * Create a new Minecraft instance
	 * @param {string} root `.minecraft` dir location
	 * @param {string} [version] version name
	 * @param {Chat} [chat] Instance of Chat
	 * @param {Command[]} [commands] available commands
	 */
	constructor(root, version, chat, commands) {
		this(this.getOptions(root + optionsFilePath), version, chat, commands);
    }

    /**
     * Create a new Minecraft instance
     * @param {string} options contents of options.txt parsed using {@link getOptions()} 
     * @param {string} [version] version name
     * @param {Chat} [chat] Instance of Chat
     * @param {Command[]} [commands] available commands
     */
    constructor(options, version, chat, commands) {
        this.options = options;
		if (version != undefined) this.version = version;
		this.chat = chat ?? new Chat(this.options['key_key.chat'], this.options['key_key.command'], defaultPrefix);
        if (commands != undefined) this.commands = commands;
    }

    /**
     * Get options from options.txt
     * @param {string} optionsFilePath path to options.txt
     * @returns options object
     */
    getOptions(optionsFilePath) {
        options = {};
        let optionsFile = fs.readFileSync(optionsFilePath, 'utf8'); // key:value\nkey:value\n...
        let pairs = optionsFile.split('\n'); // key:value
        pairs.forEach(pair => {
            let pair = pair.split(':');
            options[pair[0]] = pair[1];
        });
        return options;
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
    constructor(key, commandKey, commandPrefix, commands) {
        this.key = key;
        this.commandKey = commandKey;
        this.commandPrefix = commandPrefix;
		this.commands = commands;
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