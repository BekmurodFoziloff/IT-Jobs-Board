import 'dotenv/config';
import app from './app';
import logger from './lib/logger';

const PORT = process.env.PORT as string || 3000;

app.listen(PORT, () => {
    logger.debug(`Server listening on ${PORT} port`);
})