const LogLevel = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	FATAL: 4,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface LogEntry {
	timestamp: Date;
	level: LogLevel;
	title?: string;
	message: any;
	stack?: string;
	context?: Record<string, any>;
}

export interface LoggerConfig {
	level: LogLevel;
	enableConsole: boolean;
	enableStorage: boolean;
	maxStorageEntries: number;
	dateFormat: string;
	enableStackTrace: boolean;
}

class Logger {
	private config: LoggerConfig;
	private logs: LogEntry[] = [];

	constructor(config: Partial<LoggerConfig> = {}) {
		this.config = {
			level: LogLevel.INFO,
			enableConsole: true,
			enableStorage: true,
			maxStorageEntries: 1000,
			dateFormat: 'YYYY-MM-DD HH:mm:ss',
			enableStackTrace: true,
			...config,
		};
	}

	private formatDate(date: Date): string {
		return date.toISOString().replace('T', ' ').substring(0, 19);
	}

	private getStackTrace(): string | undefined {
		if (!this.config.enableStackTrace) return undefined;

		const stack = new Error().stack;
		if (!stack) return undefined;

		return stack.split('\n').slice(3).join('\n');
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.config.level;
	}

	private log(
		level: LogLevel,
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		if (!this.shouldLog(level)) return;

		let actualTitle: string | undefined;
		let actualMessage: any;
		let actualContext: Record<string, any> | undefined;

		if (message === undefined && typeof title !== 'string') {
			actualMessage = title;
			actualTitle = undefined;
			actualContext = context;
		} else if (typeof title === 'string' && message !== undefined) {
			actualTitle = title;
			actualMessage = message;
			actualContext = context;
		} else {
			actualMessage = title;
			actualTitle = undefined;
			actualContext = context;
		}

		const entry: LogEntry = {
			timestamp: new Date(),
			level,
			title: actualTitle,
			message: actualMessage,
			stack: level >= LogLevel.ERROR ? this.getStackTrace() : undefined,
			context: actualContext,
		};

		if (this.config.enableStorage) {
			this.logs.push(entry);
			if (this.logs.length > this.config.maxStorageEntries) {
				this.logs.shift();
			}
		}

		if (this.config.enableConsole) {
			this.outputToConsole(entry);
		}
	}

	private outputToConsole(entry: LogEntry): void {
		const time = this.formatDate(entry.timestamp);
		const levelName = this.getLevelName(entry.level);

		const consoleMethod = this.getConsoleMethod(entry.level);

		if (entry.title) {
			consoleMethod(`[${time}] ${levelName} ${entry.title}:`, entry.message);
		} else {
			consoleMethod(`[${time}] ${levelName}`, entry.message);
		}

		if (entry.context) {
			console.log('Context:', entry.context);
		}

		if (entry.stack && entry.level >= LogLevel.ERROR) {
			console.groupCollapsed('Stack trace');
			console.log(entry.stack);
			console.groupEnd();
		}
	}

	private getLevelName(level: LogLevel): string {
		const levelNames = {
			[LogLevel.DEBUG]: 'DEBUG',
			[LogLevel.INFO]: 'INFO',
			[LogLevel.WARN]: 'WARN',
			[LogLevel.ERROR]: 'ERROR',
			[LogLevel.FATAL]: 'FATAL',
		} as const;

		return levelNames[level] || 'UNKNOWN';
	}

	private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
		switch (level) {
			case LogLevel.DEBUG:
				return console.debug || console.log;
			case LogLevel.INFO:
				return console.info || console.log;
			case LogLevel.WARN:
				return console.warn || console.log;
			case LogLevel.ERROR:
			case LogLevel.FATAL:
				return console.error || console.log;
			default:
				return console.log;
		}
	}

	debug(title: string, message?: any, context?: Record<string, any>): void;
	debug(message: any, context?: Record<string, any>): void;
	debug(
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		this.log(LogLevel.DEBUG, title, message, context);
	}

	info(title: string, message?: any, context?: Record<string, any>): void;
	info(message: any, context?: Record<string, any>): void;
	info(
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		this.log(LogLevel.INFO, title, message, context);
	}

	warn(title: string, message?: any, context?: Record<string, any>): void;
	warn(message: any, context?: Record<string, any>): void;
	warn(
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		this.log(LogLevel.WARN, title, message, context);
	}

	error(title: string, message?: any, context?: Record<string, any>): void;
	error(message: any, context?: Record<string, any>): void;
	error(
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		this.log(LogLevel.ERROR, title, message, context);
	}

	fatal(title: string, message?: any, context?: Record<string, any>): void;
	fatal(message: any, context?: Record<string, any>): void;
	fatal(
		title: string | any,
		message?: any,
		context?: Record<string, any>,
	): void {
		this.log(LogLevel.FATAL, title, message, context);
	}

	setLevel(level: LogLevel): void {
		this.config.level = level;
	}

	clear(): void {
		this.logs = [];
	}

	getLogs(): LogEntry[] {
		return [...this.logs];
	}

	getLogsByLevel(level: LogLevel): LogEntry[] {
		return this.logs.filter((log) => log.level === level);
	}

	exportLogs(): string {
		return this.logs
			.map((log) => {
				const time = this.formatDate(log.timestamp);
				const levelName = this.getLevelName(log.level);
				const title = log.title ? `${log.title}: ` : '';
				const message =
					typeof log.message === 'object'
						? JSON.stringify(log.message)
						: log.message;

				return `[${time}] ${levelName} ${title}${message}`;
			})
			.join('\n');
	}

	test(): void {
		console.log('=== Logger Test ===');
		this.debug('Debug message');
		this.info('Info message');
		this.warn('Warning message');
		this.error('Error message');
		this.info('Title test', 'Message with title');
		this.error('API Error', new Error('Test error'));
		console.log('=== End Test ===');
	}
}

export const logger = new Logger();

export { Logger, LogLevel };
