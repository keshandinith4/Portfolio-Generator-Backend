import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    // Main portfolio data structure
    portfolioData: {
        fullName: { type: String, default: "" },
        title: { type: String, default: "" },
        profileImage: { type: String, default: "" }, // Personal Info
        bio: { type: String, default: "" },
        contact: {
            email: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            website: { type: String, default: "" } // Contact Section
        },
        skills: { 
            type: [String], 
            default: [] // Dynamic array for add/remove skills
        },
        projects: [{
            name: { type: String, required: true },
            description: { type: String },
            techStack: { type: String },
            githubLink: { type: String, default: "" },
            liveDemo: { type: String, default: "" }
        }],
        experience: [{
            company: { type: String },
            role: { type: String },
            duration: { type: String },
            description: { type: String }
        }]
    },
    hasPortfolio: { 
        type: Boolean, 
        default: false 
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', UserSchema);
export default User;