import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../database/mongoose';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectToDatabase();

        const connectionState = mongoose.connection.readyState;
        const stateMap: { [key: number]: string } = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        return NextResponse.json({
            success: true,
            message: 'Database connection successful!',
            status: stateMap[connectionState],
            database: mongoose.connection.name || 'default',
            host: mongoose.connection.host || 'unknown'
        }, { status: 200 });

    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

