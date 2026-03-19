const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },

    portfolioData: {
        fullName: { type: String, default: "" },
        title: { type: String, default: "" },
        bio: { type: String, default: "" },
        contact: {
            email: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" }
        },
        skills: { type: [String], default: [] },
        projects: [
            {
                name: { type: String },
                description: { type: String },
                techStack: { type: String },
                githubLink: { type: String },
                liveDemo: { type: String }
            }
        ],
        experience: [
            {
                company: { type: String },
                role: { type: String },
                duration: { type: String },
                description: { type: String }
            }
        ]
    },
    
    hasPortfolio: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);