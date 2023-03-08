import sha1 from 'sha1';
import DBClient from '../utils/db';

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
}

module.exports = UsersController;
