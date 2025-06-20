// const request = require('supertest');  // For making requests to your app
// const app = require('../app');         // Import your app (change the path if needed)
// const sendCustomEmail = require('../utils/sendCustomEmail');  // Path to your sendCustomEmail function

// // Mock the sendCustomEmail function for testing
// jest.mock('../utils/sendCustomEmail');  // Mocking the email sending logic

// describe('POST /Admin/Save-User-info', () => {
//   it('should send an email after saving a teacher', async () => {
//     // Mock the successful email sending
//     sendCustomEmail.mockResolvedValueOnce('Email sent successfully');

//     // Make a POST request to your route
//     const response = await request(app)
//       .post('/Admin/Save-User-info')  // Your route path
//       .send({
//         name: 'John Doe',
//         Teacher_ID: 'T12345',
//         father_name: 'James Doe',
//         email: 'johndoe@example.com',
//         dob: '1980-01-01',
//         department: 'Computer Science',
//         subject: 'Programming',
//         role: 'teacher',
//         qualification: 'PhD in Computer Science',
//         experience: '5 years',
//         address: '123 Main St.',
//         about: 'Passionate about teaching programming.',
//         class: 'CS101'
//       });

//     // Check that the response status is a redirect (e.g., 302)
//     expect(response.status).toBe(302);  // Assuming your route redirects after success

//     // Check that the sendCustomEmail function was called with the correct data
//     expect(sendCustomEmail).toHaveBeenCalledWith({
//       to: 'johndoe@example.com',
//       name: 'John Doe',
//       id: 'T12345',
//       role: 'teacher'
//     });
//   });

//   it('should send an email after saving a student', async () => {
//     // Mock the successful email sending
//     sendCustomEmail.mockResolvedValueOnce('Email sent successfully');

//     // Make a POST request to your route with student data
//     const response = await request(app)
//       .post('/Admin/Save-User-info')  // Your route path
//       .send({
//         name: 'Jane Smith',
//         Student_ID: 'S12345',
//         Father_name: 'Robert Smith',
//         email: 'janesmith@example.com',
//         d_o_b: '1999-05-05',
//         class: 'CS101',
//         bio: 'A dedicated student in computer science.',
//         role: 'student'
//       });

//     // Check that the response status is a redirect (e.g., 302)
//     expect(response.status).toBe(302);  // Assuming your route redirects after success

//     // Check that the sendCustomEmail function was called with the correct data
//     expect(sendCustomEmail).toHaveBeenCalledWith({
//       to: 'janesmith@example.com',
//       name: 'Jane Smith',
//       id: 'S12345',
//       role: 'student'
//     });
//   });
// });
