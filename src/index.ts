import express from "express";
import dotenv from "dotenv";
import { bootStrap } from "./app/bootstrap";

// Load environment variables first
dotenv.config({ path: ".env", debug: false });

// ✅ Add global error handlers BEFORE starting the app
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Promise Rejection at:', promise);
    console.error('Reason:', reason);
    // Log but don't exit in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// ✅ Add SIGTERM/SIGINT handlers for graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    process.exit(0);
});

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 8000; // ✅ Added radix and fallback

// ✅ Validate PORT
if (isNaN(PORT)) {
    console.error('❌ Invalid PORT in environment variables');
    process.exit(1);
}

// ✅ Wrap bootstrap in async function with error handling
async function startApplication() {
    try {
        console.log('🚀 Starting application...');
        await bootStrap(app, PORT);
        console.log('✅ Application started successfully');
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

startApplication();