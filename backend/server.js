const express = require('express');
const cors = require('cors');
const connectDatabase = require('./db');

// Import controllers
const { registerUser, loginUser, updateProfile, getTechnicians } = require('./controllers/authController');
const { getActiveOutages, createOutageReport, deleteOutageReport, assignTechnician, deleteOutage, getAssignedTasks, resolveOutage, getAllOutages } = require('./controllers/outageController');
const { generateVerificationId, listVerificationIds, revokeVerificationId } = require('./controllers/verificationController');
const { getAllForumPosts, createForumPost, answerForumPost, updateForumPost, deleteForumPost, updateForumReply, deleteForumReply } = require('./controllers/forumController');

const app = express();

// --- APPLY NETWORKING MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- INITIALIZE DATABASE CONNECTIVITY ---
connectDatabase();

// --- USER AUTHENTICATION ROUTE ENDPOINTS ---
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/user/update', updateProfile);

// --- RESIDENT MAP ROUTE ENDPOINTS ---
app.get('/api/outages/active', getActiveOutages);
app.post('/api/outages/report', createOutageReport);
app.delete('/api/outages/delete/:id', deleteOutageReport);

// --- ADMIN ROUTE ENDPOINTS ---
app.get('/api/users/technicians', getTechnicians);
app.post('/api/outages/assign', assignTechnician);
app.delete('/api/outages/admin/delete/:id', deleteOutage);
app.get('/api/outages/all', getAllOutages);

// --- VERIFICATION ID ROUTE ENDPOINTS (admin only) ---
app.post('/api/verification/generate', generateVerificationId);
app.get('/api/verification/list', listVerificationIds);
app.delete('/api/verification/revoke/:id', revokeVerificationId);


//--- Technician Route Endpoints ---
app.get('/api/outages/assigned/:technicianId', getAssignedTasks);
app.post('/api/outages/resolve/:id', resolveOutage);


// --- TECHNICIAN FORUM ROUTE ENDPOINTS ---
app.get('/api/forum/all', getAllForumPosts);
app.post('/api/forum/create', createForumPost);
app.post('/api/forum/reply/:postId', answerForumPost);
app.put('/api/forum/update/:postId', updateForumPost);
app.delete('/api/forum/delete/:postId', deleteForumPost);
app.put('/api/forum/reply/update/:replyId', updateForumReply);
app.delete('/api/forum/reply/delete/:replyId', deleteForumReply);


// --- STARTUP BOUNDARY ROUTINE ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Utilix Secure Network Server active and executing on Port: ' + PORT);
});