const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Organization = require('../models/organization');
const User = require('../models/user');

const createDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        // Create demo organization
        const demoOrg = await Organization.create({
            name: "TechCorp Solutions",
            domains: new Map([
                ['Google', 'google.com'],
                ['Microsoft', 'microsoft.com'],
                ['Internal', 'techcorp.com'],
                ['Development', 'dev.techcorp.com']
            ])
        });

        console.log('🏢 Created demo organization:', demoOrg);

        // Hash password for demo users
        const hashedPassword = await bcrypt.hash('Password123!', 10);

        // Create demo users
        const demoUsers = await User.create([
            {
                email: 'admin@techcorp.com',
                password: hashedPassword,
                orgId: demoOrg._id,
                role: 'admin',
                access: ['google.com', 'microsoft.com', 'techcorp.com', 'dev.techcorp.com'],
                mfaEnabled: true
            },
            {
                email: 'developer@techcorp.com',
                password: hashedPassword,
                orgId: demoOrg._id,
                role: 'developer',
                access: ['dev.techcorp.com', 'techcorp.com'],
                mfaEnabled: true
            },
            {
                email: 'user1@techcorp.com',
                password: hashedPassword,
                orgId: demoOrg._id,
                role: 'user',
                access: ['techcorp.com'],
                mfaEnabled: false
            },
            {
                email: 'user2@techcorp.com',
                password: hashedPassword,
                orgId: demoOrg._id,
                role: 'user',
                access: ['google.com', 'techcorp.com'],
                mfaEnabled: false
            }
        ]);

        console.log('👥 Created demo users:', demoUsers.map(user => ({
            email: user.email,
            role: user.role,
            access: user.access
        })));

        console.log('\n🔑 Demo Credentials:');
        console.log('Email: admin@techcorp.com (Has access to all domains)');
        console.log('Email: developer@techcorp.com (Has access to dev and internal domains)');
        console.log('Email: user1@techcorp.com (Has access to internal domain only)');
        console.log('Email: user2@techcorp.com (Has access to Google and internal domains)');
        console.log('Password for all users: Password123!');

    } catch (error) {
        console.error('❌ Error creating demo data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};

createDemoData();