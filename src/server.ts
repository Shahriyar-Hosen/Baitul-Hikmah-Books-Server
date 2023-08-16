import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { Server } from 'http';

let server: Server;

process.on('uncaughtException', error => {
  console.log('uncouth Exception server error');
  console.log(error);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`server listening on port in the-bookshelf ${config.port}`);
    });

    console.log(`database connect successful in the-bookshelf ${config.port}`);
  } catch (error) {
    console.log('something is wrong');
  }

  process.on('unhandledRejection', error => {
    console.log('unhandledRejection is detected, we are closing our server...');
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'my name is mitaly' });
});
