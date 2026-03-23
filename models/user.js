import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    portfolioData: {
        // Personal Info 
        fullName: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""         
        },
        bio: {
            type: String,
            default: ""
        },
        profileImage: {
            type: String,
            default: ""         
        },
        resumeUrl: {
            type: String,       
            default: ""
        },

        // Contact & Links 
        contact: {
            email:    { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github:   { type: String, default: "" },
            website:  { type: String, default: "" }
        },

        // Skills
        skills: {
            type: [String],
            default: []         
        },

        // Projects / Works 
        projects: [{
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                default: ""
            },
            toolsUsed: {       
                type: String,
                default: ""   
            },
            projectLink: {     
                type: String,
                default: ""     // e.g. Behance, Dribbble, GitHub, or any source link
            },
            liveDemo: {
                type: String,
                default: ""
            }
        }],

        // Experience
        experience: [{
            company: {
                type: String,
                default: ""     // company, client, or organization
            },
            role: {
                type: String,
                default: ""
            },
            duration: {
                type: String,
                default: ""     // e.g. "Jan 2022 – Present"
            },
            description: {
                type: String,
                default: ""
            }
        }]
    },

    // Portfolio Status 
    hasPortfolio: {
        type: Boolean,
        default: false
    },

    // Analytics
    viewCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true  
});

const User = mongoose.model('User', UserSchema);
export default User;
