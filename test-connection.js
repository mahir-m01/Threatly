// Test script to verify MongoDB connection
// Run with: node test-connection.js

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');

    if (!MONGODB_URI) {
        console.error('❌ ERROR: MONGODB_URI not found in environment variables');
        console.log('Make sure you have a .env file with MONGODB_URI defined');
        process.exit(1);
    }

    console.log('📝 MongoDB URI found (showing first 30 chars):', MONGODB_URI.substring(0, 30) + '...');

    try {
        console.log('\n⏳ Attempting to connect to MongoDB...');

        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000
        });

        console.log('\n✅ SUCCESS! Connected to MongoDB');
        console.log('📊 Connection Details:');
        console.log('   - Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
        console.log('   - Database:', mongoose.connection.name || 'default');
        console.log('   - Host:', mongoose.connection.host);
        console.log('   - Port:', mongoose.connection.port);

        // Test a simple operation
        console.log('\n🧪 Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('   - Collections found:', collections.length);
        if (collections.length > 0) {
            console.log('   - Collection names:', collections.map(c => c.name).join(', '));
        }

        console.log('\n🎉 All tests passed! Your database connection is working correctly.\n');

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!');
        console.error('Error message:', error.message);

        if (error.message.includes('authentication')) {
            console.log('\n💡 Tip: Check your MongoDB username and password');
        } else if (error.message.includes('network')) {
            console.log('\n💡 Tip: Check your internet connection and MongoDB cluster status');
        } else if (error.message.includes('timeout')) {
            console.log('\n💡 Tip: Your IP might not be whitelisted in MongoDB Atlas');
        }

        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed\n');
    }
}

testConnection();

