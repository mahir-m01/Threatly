import mongoose from 'mongoose';

declare global {
    interface SignInFormData {
        email: string;
        password: string;
        rememberMe?: boolean;
    }

    interface SignUpFormData {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }

    var mongooseCache: {
        connection: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

export {};
