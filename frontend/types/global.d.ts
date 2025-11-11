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
}

export {};
