import 'dotenv/config';
import { createApp } from './app.js';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = createApp();
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map