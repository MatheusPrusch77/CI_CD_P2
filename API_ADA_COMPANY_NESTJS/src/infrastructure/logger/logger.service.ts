import { createLogger, format, transports } from 'winston';
import { BetterStackTransport } from './betterstack-transport';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new BetterStackTransport({
      endpoint: process.env.BETTERSTACK_HTTP_ENDPOINT, // coloque seu endpoint aqui ou use variável de ambiente
    }),
  ],
});

export default logger;