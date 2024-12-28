const Club = require('../models/clubs');
const Message =require('../models/Messages')
const User=require('../models/user')
exports.createClub = async (req, res) => {
  const { name, description, president,username} = req.body;
  console.log(req.body)
  try {
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ success: false, message: "Club with this name already exists" });
    }
    const newClub = new Club({
      name,
      description,
      president,
      username,
      members: [],
      memberCount:0 
    });
    await newClub.save();

    res.status(201).json({ success: true, message: "Club created successfully", club: newClub });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ success: false, message: "Error creating club" });
  }
};
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.find();  
        res.status(200).json({ success: true, clubs });
      } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ success: false, message: "Error fetching clubs" });
      }
    
};  
exports.getyourclubs = async (req, res) => {
    try {
        const { username } = req.query; 
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }
        const clubs = await Club.find({ username: username });
        
        res.status(200).json({ success: true, clubs });
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ success: false, message: "Error fetching clubs" });
    }
};  
exports.getClubById = async (req, res) => {
    try {
        const { clubId } = req.params;
        const club = await Club.findById(clubId); 
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ clubId: req.params.clubId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Error fetching messages" });
  }
};  
exports.saveMessages=async(req,res)=>{
  try {
    const { sender, text } = req.body;
    console.log(req.body)
    const newMessage = new Message({ clubId: req.params.clubId, sender, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Error saving message" });
  }
}
exports.JoinClub = async (req, res) => {
  try {
    const { userName, clubId } = req.body;
    const user = await User.findOne({name: userName });
    const club = await Club.findById(clubId);

    if (!user || !club) {
      return res.status(404).json({ error: `${user} or ${club} not found`});
    }
    if (user.joinedClubs.includes(clubId)) {
      return res.status(400).json({ error: "User already joined this club" });
    }
    if (!user.joinedClubs) {
      user.joinedClubs = [];
    }
    if (!club.members) {
      club.members = [];
    }
    user.joinedClubs.push(clubId);
    await user.save();
    club.members.push(user._id);
    club.memberCount += 1;
    await club.save();

    res.status(200).json({ message: "Club joined successfully", club });
  } catch (err) {
    console.error("Error joining club:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getJoinedclubs = async (req, res) => {
  try {
    const { username } = req.query;
    console.log(username)
    const user = await User.findOne({name: username }).populate('joinedClubs');;
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ joinedClubs: user.joinedClubs });
  } catch (err) {
    console.error("error fetching clubs",err);
    res.status(500).json({ error: "Internal server error" });
  }
};