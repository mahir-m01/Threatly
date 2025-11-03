import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "../../../database/mongoose";
import { nextCookies } from "better-auth/next-js";

// Singleton instance to ensure no duplicates are created
let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) {
        return authInstance;
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("Database connection is not established");
    }

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false, // Enable sign up
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 32,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

// Export a function that returns the auth instance
// This is better than top-level await as it allows the consumer to control when the async operation happens
export const auth = () => getAuth();
