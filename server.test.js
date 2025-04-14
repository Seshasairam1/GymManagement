const request = require('supertest');
const app = require('./server');
const mongoose = require('mongoose');

let userId = ''; // Will hold user _id for update/delete tests
const testEmail = 'testuser@example.com';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/gymdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Clean test data
  await mongoose.connection.close();
});

// Test cases
describe('Gym Management System API', () => {

  // 1. Register new user
  it('should register a new user', async () => {
    const res = await request(app).post('/register').send({
      name: 'Test User',
      email: testEmail,
      phone: '1234567890',
      age: 25,
      health: 'None',
      membership: '5000 for 6 months',
      trainer: 'Trainer A'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Registration successful!');
  });

  // 2. Reject duplicate email
  it('should reject duplicate email registration', async () => {
    const res = await request(app).post('/register').send({
      name: 'Another User',
      email: testEmail,
      phone: '1111111111',
      age: 30,
      health: 'None',
      membership: '9000 for 1 year',
      trainer: 'Trainer B'
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Email already registered.');
  });

  // 3. Reject empty form
  it('should reject empty registration', async () => {
    const res = await request(app).post('/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please fill in all required fields.');
  });

  // 4. Get all users
  it('should fetch all registered users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    userId = res.body.find(u => u.email === testEmail)?._id;
    expect(userId).toBeDefined();
  });

  // 5. Get user by email
  it('should fetch user by email', async () => {
    const res = await request(app).get(`/user/${testEmail}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  // 6. Get non-existent user
  it('should return 404 for non-existent user', async () => {
    const res = await request(app).get('/user/notfound@example.com');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  // 7. Update user by ID
  it('should update user info', async () => {
    const res = await request(app).put(`/update/${userId}`).send({
      name: 'Updated User',
      age: 26
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated User');
  });

  // 8. Fail update with invalid ID
  it('should fail to update invalid user', async () => {
    const res = await request(app).put('/update/123456789012').send({
      name: 'Invalid'
    });

    expect(res.statusCode).toBe(500); // Mongoose throws CastError for invalid ID
  });

  // 9. Delete user by ID
  it('should delete user', async () => {
    const res = await request(app).delete(`/delete/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  // 10. Delete already deleted user
  it('should fail to delete nonexistent user', async () => {
    const res = await request(app).delete(`/delete/${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
