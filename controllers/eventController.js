const Event = require('../models/event');
const Club =require('../models/clubs');
exports.createEvent = async (req, res) => {
  const { club, title, date, time, location, description, attendees } = req.body;
  console.log(req.body);

  try {
    const newEvent = new Event({
      club,
      title,
      date,
      time,
      location,
      description,
      attendees: attendees || 0 
    });

    await newEvent.save();

    res.status(201).json({ success: true, message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};
exports.getEventsByClubId = async (req, res) => {
    try {
        const { clubId } = req.params;
        const club = await Club.findById(clubId);
        const events = await Event.find({ club: club.name }); 
        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found for this club' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEvents = async (req, res) => {
  try {
          const events = await Event.find();  
          res.status(200).json({ success: true, events});
        } catch (error) {
          console.error("Error fetching error:", error);
          res.status(500).json({ success: false, message: "Error fetching error" });
        }
};