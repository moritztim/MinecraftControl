/**
 * Entry point
 * @authors Moritz Tim W.
 * @version 0.1.0
 */

import robot from 'robotjs';
import os from 'os';
import path from 'path';
import fs from 'fs';

const defaultPrefix = '/';
const optionsFilePath = path.sep + 'options.txt';

/** Represents an instance of Minecraft */
class Minecraft {
	root?: string;
	options: { [x: string]: string; };
	chat?: Chat;
	version?: string;

    /**
     * Create a new Minecraft instance
     * @param root `.minecraft` dir location
     * @param chat Instance of Chat
	 * @param version version name
	 * @param options options or path to options.txt
     */
    constructor(root?: string, chat?: Chat, version?: string, options?: { [x: string]: string; } | string) {
        if (root != undefined) {
            this.root = root;
        } else {
            /** root path as array of dirs without the string 'minecraft' */
            let preRoot;
            switch (os.platform()) {
                case 'win32': // Windows
                    preRoot = ['%AppData%', 'Roaming', '.'];
                    break;
                case 'darwin': // MacOS
                    preRoot = ['~', 'Library', 'Application Support'];
                    break;
                case 'linux':
                    preRoot = ['~', '.'];
                    break;
                default:
                    throw new Error('Unsupported OS');
            }
            this.root = preRoot.join(path.sep) + 'minecraft';
        }
        this.options = Minecraft.getOptions(root + optionsFilePath);
        if (version != undefined) this.version = version;
        this.chat = chat ?? new Chat(this.options['key_key.chat'], this.options['key_key.command'], defaultPrefix);
    }

    /**
     * Get options from options.txt
     * @param optionsFilePath path to options.txt
     * @returns options object
     */
    static getOptions(optionsFilePath: string) {
        let options: { [x: string]: string; } = {};
        let optionsFile = fs.readFileSync(optionsFilePath, 'utf8'); // key:value\nkey:value\n...
        let pairs = optionsFile.split('\n'); // key:value
        pairs.forEach((pair: string) => {
            let pairArray = pair.split(':');
            options[pairArray[0]] = pairArray[1];
        });
        return options;
    }
}

/** Represents the chat within an instance of Minecraft */
class Chat {
	key: string;
	private commandKey: string;
	private commandPrefix: string;
	commands?: Command[];
    /**
     * Create a new Chat instance
     * @param key the key to open the chat
     * @param commandKey the key to open the chat with the command prefix already typed
     * @param commandPrefix the command prefix
     * @param commands available commands
     */
    constructor(key: string, commandKey: string, commandPrefix: string = '/', commands?: Command[]) {
        let defaultOptions = Minecraft.getOptions('./default.options.txt');
        this.key = key ?? defaultOptions['key_key.chat'];
        this.commandKey = commandKey ?? defaultOptions['key_key.command'];
        this.commandPrefix = commandPrefix;
        this.commands = commands;
    }

    /**
     * Open the chat input field
     * CAUTION: only works if the chat is not already open
     */
    async open() {
        return new Promise<void>((resolve, reject) => {
            robot.keyTap(this.key);
            setTimeout(() => { resolve(); }, 100); // wait for the chat to open
        });
    }

    /** Add a message to the chat input field
     * CAUTION: only works if the chat is already open
     * @param message the string to add
     */
    add(message: string) {
        robot.typeString(message);
    }

    /**
     * Open the chat and type the given message
     * CAUTION: only works if the chat is not already open
     * @param message the string to type
     */
    async send(message: string) {
        await this.open();
        this.add(message);
    }

    /** Open the chat input field with the command prefix */
    async openCommand() {
        return new Promise<void>((resolve, reject) => {
            robot.keyTap(this.commandKey);
            setTimeout(() => { resolve(); }, 100); // wait for the command to open
        });
    }

    /** Close the chat input field
     * CAUTION: only works if the chat is open
     */
    close() {
        robot.keyTap("escape")
    }
}

/** Represents a command within an instance of Minecraft */
class Command {
	names: string | string[];
	params: Parameter[];
    /**
     * Create a new Command instance
     * @param names name and aliases
     * @param params parameters
     */
    constructor(names: string | string[], ...params: Parameter[]) {
        this.names = names;
        this.params = params;
    }
}

/** Represents a parameter for a command within an instance of Minecraft */
class Parameter {
	name: string;
	type: string;
	required: boolean;
    /**
     * Create a new Parameter instance
     * string name name
     * string type value type
     * boolean required required
     */
    constructor(name: string, type: string, required: boolean = false) {
        this.name = name;
        this.type = type;
        this.required = required;
    }
}