export type Logger = {
  out(msg: string): void;
  err(msg: string): void;
};

export type ColorFunc = (msg: string) => string;

// Logger utility that prefixes logs and removes terminal clear commands
export function createLogger(prefix: string = ''): Logger {
  const write = (stream: NodeJS.WriteStream, msg: string) => {
    if (msg.startsWith('\x1b\x63')) {
      msg = msg.slice(2);
    }
    const str = msg.trimRight().replace(/^/gm, prefix) + '\n';
    stream.write(str, 'utf8');
  };

  return {
    out(msg: string) {
      write(process.stdout, msg);
    },
    err(msg: string) {
      write(process.stderr, msg);
    },
  };
}

// A factory for creating loggers that rotate between different coloring functions
export function createLoggerFactory(colorFuncs: ColorFunc[]) {
  let colorIndex = 0;

  return (name: string) => {
    const colorFunc = colorFuncs[colorIndex];

    colorIndex = (colorIndex + 1) % colorFuncs.length;

    const prefix = `${colorFunc(name)}: `;
    return createLogger(prefix);
  };
}
