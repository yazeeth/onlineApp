import "dotenv/config";

const required = (name: "DATABASE_URL" | "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET") => {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} environment variable is required`);
    }

    return value;
};

const parsePort = (value: string | undefined) => {
    if (!value) {
        return 5000;
    }

    const port = Number(value);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be an integer between 1 and 65535");
    }

    return port;
};

export const env = {
    port: parsePort(process.env.PORT),
    frontendUrl: process.env.FRONTEND_URL?.trim() || "http://localhost:3000",
    databaseUrl: required("DATABASE_URL"),
    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET")
};
