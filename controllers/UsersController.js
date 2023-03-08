import ObjectId from 'mongodb';
import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class UsersController {
  static async postUsers(request, response) {
    const uEmail = request.body.email;
    if (!uEmail) {
      return response.status(400).send({ error: 'Missing email' });
    }

    const uPassword = request.body.password;
    if (!uPassword) {
      return response.status(400).send({ error: 'Missing password' });
    }

    const existingUserEmail = await DBClient.db.collection('users').findOne({ email: uEmail });
    if (existingUserEmail) {
      return response.status(400).send({ error: 'Already exist' });
    }

    const shaUserPassword = sha1(uPassword);
    const result = await DBClient.db.collection('users').insertOne({ email: uEmail, password: shaUserPassword });
    return response.status(201).send({ id: result.insertedId, email: uEmail });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token') || null;
    if (!token) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
    if (!user) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    delete user.password;

    return response.status(200).send({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
