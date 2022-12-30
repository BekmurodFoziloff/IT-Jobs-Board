import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT as string || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} port`);
})