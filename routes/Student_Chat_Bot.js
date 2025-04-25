const express = require('express');
const app = express();
const router = express.Router();
const { route } = require('./auth');
// Middleware to parse JSON requests
app.use(express.json());  // Only this line is necessary.


const schedule = {
  monday: "Math - 9 AM",
  tuesday: "English - 10 AM",
  wednesday: "Physics - 11 AM",
  thursday: "Chemistry - 2 PM",
  friday: "Computer Science - 3 PM",
};


router.get('/get-schedule', (req, res) => {
  res.json(schedule);
});

router.post('/webhook', (req, res) => {
  const action = req.body.queryResult.action;

  if (action === 'get_schedule') {
    res.json({
      fulfillmentText: `Here is your class schedule:
        Monday: ${schedule.monday}
        Tuesday: ${schedule.tuesday}
        Wednesday: ${schedule.wednesday}
        Thursday: ${schedule.thursday}
        Friday: ${schedule.friday}`
    });
  } else {
    res.json({
      fulfillmentText: 'Sorry, I couldn\'t understand your request.'
    });
  }
});


app.use('/api', router); 

module.exports = router;