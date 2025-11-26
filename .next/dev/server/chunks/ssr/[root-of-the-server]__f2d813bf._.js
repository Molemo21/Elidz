module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Prisma Client singleton
// Use this instead of creating new PrismaClient instances
__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file and ensure it contains DATABASE_URL.');
}
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/lib/auth-nextauth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// NextAuth.js v5 Configuration
// Complete JWT authentication solution using NextAuth.js v5
// NextAuth.js handles sessions, token refresh, and security automatically
__turbopack_context__.s([
    "authConfig",
    ()=>authConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_e4393d663397538dac164e1d4339b55b$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_e4393d663397538dac164e1d4339b55b/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@auth+core@0.41.0/node_modules/@auth/core/providers/credentials.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/index.js [app-rsc] (ecmascript)");
;
;
;
const authConfig = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$auth$2b$core$40$0$2e$41$2e$0$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }
                // Find user
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user) {
                    throw new Error('Invalid email or password');
                }
                // Check if user has a password hash (migrated to JWT auth)
                if (!user.passwordHash) {
                    throw new Error('This account still uses Supabase authentication. Please contact support to migrate your account.');
                }
                // Verify password
                const isValidPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.passwordHash);
                if (!isValidPassword) {
                    throw new Error('Invalid email or password');
                }
                // Update last login
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        lastLogin: new Date()
                    }
                });
                // Return user object (will be encoded in JWT)
                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                    approved: user.approved
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            // Initial sign in - user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.approved = user.approved;
            }
            return token;
        },
        async session ({ session, token }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.approved = token.approved;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};
}),
"[project]/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// NextAuth.js v5 exports and shared auth types
// This file provides both NextAuth functions and the AuthUser type used throughout the app
__turbopack_context__.s([
    "auth",
    ()=>auth,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_e4393d663397538dac164e1d4339b55b$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@5.0.0-beta.30_nex_e4393d663397538dac164e1d4339b55b/node_modules/next-auth/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-nextauth.ts [app-rsc] (ecmascript)");
;
;
// Create NextAuth instance for server-side use
const nextAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$5$2e$0$2e$0$2d$beta$2e$30_nex_e4393d663397538dac164e1d4339b55b$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authConfig"]);
const { auth, signIn, signOut } = nextAuth;
}),
"[project]/lib/auth-nextauth-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server-side NextAuth.js helpers
// These replace Supabase auth helpers for server components
__turbopack_context__.s([
    "getServerSession",
    ()=>getServerSession,
    "requireAdmin",
    ()=>requireAdmin,
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
async function getServerSession() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user) {
        return null;
    }
    return {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
        approved: session.user.approved
    };
}
async function requireAuth() {
    const session = await getServerSession();
    if (!session) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    return session;
}
async function requireAdmin() {
    const session = await getServerSession();
    if (!session) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    if (session.role !== 'admin') {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/dashboard');
    }
    return session;
}
}),
"[project]/lib/supabase/auth-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server-side auth helpers - Now using NextAuth.js
// This file maintains the same interface for backward compatibility
// but uses NextAuth.js instead of Supabase Auth
__turbopack_context__.s([
    "getServerSession",
    ()=>getServerSession,
    "requireAdmin",
    ()=>requireAdmin,
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-nextauth-helpers.ts [app-rsc] (ecmascript)");
;
async function getServerSession() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
}
async function requireAuth() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
}
async function requireAdmin() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$nextauth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdmin"])();
}
}),
"[project]/lib/db/field-mapper.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Field name mapper: snake_case (validation) <-> camelCase (Prisma)
// Converts between database column names (snake_case) and Prisma model fields (camelCase)
/**
 * Convert snake_case to camelCase
 */ __turbopack_context__.s([
    "fromPrismaFormat",
    ()=>fromPrismaFormat,
    "toPrismaFormat",
    ()=>toPrismaFormat,
    "transformUserProfileToPrisma",
    ()=>transformUserProfileToPrisma,
    "userProfileFieldMap",
    ()=>userProfileFieldMap
]);
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter)=>letter.toUpperCase());
}
/**
 * Convert camelCase to snake_case
 */ function camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter)=>`_${letter.toLowerCase()}`);
}
function toPrismaFormat(data) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) {
        return data.map((item)=>toPrismaFormat(item));
    }
    const transformed = {};
    for (const [key, value] of Object.entries(data)){
        const camelKey = snakeToCamel(key);
        // Handle nested objects (like funding_requirements)
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            transformed[camelKey] = toPrismaFormat(value);
        } else {
            transformed[camelKey] = value;
        }
    }
    return transformed;
}
function fromPrismaFormat(data) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) {
        return data.map((item)=>fromPrismaFormat(item));
    }
    const transformed = {};
    for (const [key, value] of Object.entries(data)){
        const snakeKey = camelToSnake(key);
        // Handle nested objects
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            transformed[snakeKey] = fromPrismaFormat(value);
        } else {
            transformed[snakeKey] = value;
        }
    }
    return transformed;
}
const userProfileFieldMap = {
    company_name: 'companyName',
    registration_number: 'registrationNumber',
    business_description: 'businessDescription',
    annual_revenue: 'annualRevenue',
    employees_count: 'employeesCount',
    years_in_business: 'yearsInBusiness',
    funding_requirements: 'fundingRequirements'
};
function transformUserProfileToPrisma(data) {
    if (!data || typeof data !== 'object') return data;
    const transformed = {};
    for (const [key, value] of Object.entries(data)){
        const prismaKey = userProfileFieldMap[key] || snakeToCamel(key);
        // Special handling for nested objects
        if (key === 'funding_requirements' && value && typeof value === 'object') {
            transformed[prismaKey] = value; // Keep as-is (already in correct format)
        } else {
            transformed[prismaKey] = value;
        }
    }
    return transformed;
}
}),
"[externals]/@prisma/client/runtime/library [external] (@prisma/client/runtime/library, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client/runtime/library", () => require("@prisma/client/runtime/library"));

module.exports = mod;
}),
"[project]/lib/db/serialize.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Utility to serialize Prisma data for client components
// Converts Decimal objects to numbers, Dates to strings, etc.
__turbopack_context__.s([
    "serializePrismaResult",
    ()=>serializePrismaResult,
    "serializeUserProfile",
    ()=>serializeUserProfile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client/runtime/library [external] (@prisma/client/runtime/library, cjs)");
;
/**
 * Convert Prisma Decimal to number
 */ function decimalToNumber(value) {
    if (value === null || value === undefined) return null;
    if (value instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$29$__["Decimal"]) {
        return value.toNumber();
    }
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    return null;
}
function serializeUserProfile(profile) {
    if (!profile) return null;
    return {
        ...profile,
        annualRevenue: decimalToNumber(profile.annualRevenue)
    };
}
function serializePrismaResult(data) {
    if (data === null || data === undefined) return data;
    if (Array.isArray(data)) {
        return data.map(serializePrismaResult);
    }
    if (data instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client$2f$runtime$2f$library__$5b$external$5d$__$2840$prisma$2f$client$2f$runtime$2f$library$2c$__cjs$29$__["Decimal"]) {
        return data.toNumber();
    }
    if (data instanceof Date) {
        return data.toISOString();
    }
    if (typeof data === 'object') {
        const serialized = {};
        for (const [key, value] of Object.entries(data)){
            serialized[key] = serializePrismaResult(value);
        }
        return serialized;
    }
    return data;
}
}),
"[project]/lib/db/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Prisma Query Helpers - Production Ready
// Migrated from Supabase to Prisma with best practices
// 
// Key improvements:
// - Full type safety with Prisma generated types
// - Consistent error handling
// - Better performance with optimized queries
// - Clearer, more maintainable code
// - No RLS restrictions - access control handled in application code
__turbopack_context__.s([
    "applicationQueries",
    ()=>applicationQueries,
    "matchQueries",
    ()=>matchQueries,
    "opportunityQueries",
    ()=>opportunityQueries,
    "userProfileQueries",
    ()=>userProfileQueries,
    "userQueries",
    ()=>userQueries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$field$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/field-mapper.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$serialize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/serialize.ts [app-rsc] (ecmascript)");
;
;
;
/**
 * Prisma error handler - maps Prisma errors to consistent format
 */ function handlePrismaError(error) {
    // Record not found (P2025)
    if (error?.code === 'P2025') {
        return {
            success: false,
            error: 'Record not found',
            code: 'NOT_FOUND'
        };
    }
    // Unique constraint violation (P2002)
    if (error?.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        return {
            success: false,
            error: `Record with this ${field} already exists`,
            code: 'DUPLICATE'
        };
    }
    // Foreign key constraint violation (P2003)
    if (error?.code === 'P2003') {
        return {
            success: false,
            error: 'Referenced record does not exist',
            code: 'FOREIGN_KEY'
        };
    }
    // Generic error
    return {
        success: false,
        error: error?.message || 'Database operation failed',
        code: error?.code
    };
}
const userProfileQueries = {
    /**
   * Get user profile by user ID
   */ async getByUserId (userId) {
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userProfile.findUnique({
                where: {
                    userId
                }
            });
            if (!profile) {
                return {
                    success: false,
                    error: 'Profile not found',
                    code: 'NOT_FOUND'
                };
            }
            // Serialize Decimal values for client components
            return {
                success: true,
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$serialize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serializePrismaResult"])(profile)
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Upsert user profile (create or update)
   * Transforms snake_case validation data to camelCase Prisma format
   */ async upsert (userId, profile// Accept any for flexibility, validated by caller (snake_case format)
    ) {
        try {
            // Transform from validation format (snake_case) to Prisma format (camelCase)
            const prismaProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$field$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transformUserProfileToPrisma"])(profile);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userProfile.upsert({
                where: {
                    userId
                },
                update: prismaProfile,
                create: {
                    userId,
                    ...prismaProfile
                }
            });
            // Serialize Decimal values for client components
            return {
                success: true,
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$serialize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serializePrismaResult"])(result)
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Update user profile (partial update)
   * Transforms snake_case validation data to camelCase Prisma format
   */ async update (userId, updates// Accept any for flexibility (snake_case or camelCase)
    ) {
        try {
            // Transform from validation format (snake_case) to Prisma format (camelCase)
            const prismaUpdates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$field$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transformUserProfileToPrisma"])(updates);
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].userProfile.update({
                where: {
                    userId
                },
                data: prismaUpdates
            });
            // Serialize Decimal values for client components
            return {
                success: true,
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$serialize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serializePrismaResult"])(profile)
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Check if profile is complete (has all required onboarding data)
   */ async isComplete (userId) {
        try {
            const result = await this.getByUserId(userId);
            if (!result.success || !result.data) return false;
            const profile = result.data;
            // Check required fields
            const required = [
                profile.companyName,
                profile.registrationNumber,
                profile.industry,
                profile.businessDescription,
                profile.location,
                profile.annualRevenue,
                profile.employeesCount,
                profile.yearsInBusiness,
                profile.fundingRequirements
            ];
            if (required.some((field)=>field === null || field === undefined || field === '')) {
                return false;
            }
            // Validate funding_requirements structure
            const fundingReqs = profile.fundingRequirements;
            if (!fundingReqs?.amount_needed || !fundingReqs?.funding_purpose) {
                return false;
            }
            return true;
        } catch  {
            return false;
        }
    }
};
const userQueries = {
    /**
   * Get all users (admin only - caller must verify admin status)
   */ async getAll () {
        try {
            const users = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                success: true,
                data: users
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get user by ID
   */ async getById (userId) {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    id: userId
                }
            });
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                    code: 'NOT_FOUND'
                };
            }
            return {
                success: true,
                data: user
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get user by email
   */ async getByEmail (email) {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                    code: 'NOT_FOUND'
                };
            }
            return {
                success: true,
                data: user
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Update user approval status
   */ async updateApproval (userId, approved) {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.update({
                where: {
                    id: userId
                },
                data: {
                    approved
                }
            });
            return {
                success: true,
                data: user
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Update user last login timestamp
   */ async updateLastLogin (userId) {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.update({
                where: {
                    id: userId
                },
                data: {
                    lastLogin: new Date()
                }
            });
            return {
                success: true,
                data: user
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    }
};
const opportunityQueries = {
    /**
   * Get all opportunities
   */ async getAll () {
        try {
            const opportunities = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].fundingOpportunity.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                success: true,
                data: opportunities
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get opportunity by ID
   */ async getById (opportunityId) {
        try {
            const opportunity = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].fundingOpportunity.findUnique({
                where: {
                    id: opportunityId
                }
            });
            if (!opportunity) {
                return {
                    success: false,
                    error: 'Opportunity not found',
                    code: 'NOT_FOUND'
                };
            }
            return {
                success: true,
                data: opportunity
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get opportunities by industry
   */ async getByIndustry (industry) {
        try {
            const opportunities = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].fundingOpportunity.findMany({
                where: {
                    industryFocus: {
                        has: industry
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                success: true,
                data: opportunities
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get active opportunities (deadline in future)
   */ async getActive () {
        try {
            const now = new Date();
            const opportunities = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].fundingOpportunity.findMany({
                where: {
                    deadline: {
                        gt: now
                    }
                },
                orderBy: {
                    deadline: 'asc'
                }
            });
            return {
                success: true,
                data: opportunities
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    }
};
const matchQueries = {
    /**
   * Get matches for user
   */ async getByUserId (userId) {
        try {
            const matches = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].match.findMany({
                where: {
                    userId
                },
                orderBy: {
                    matchScore: 'desc'
                }
            });
            return {
                success: true,
                data: matches
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Update match status
   */ async updateStatus (matchId, status// 'new' | 'viewed' | 'interested' | 'applied'
    ) {
        try {
            const updateData = {
                status
            };
            // Set viewed_at when status becomes 'viewed'
            if (status === 'viewed') {
                updateData.viewedAt = new Date();
            }
            const match = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].match.update({
                where: {
                    id: matchId
                },
                data: updateData
            });
            return {
                success: true,
                data: match
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    }
};
const applicationQueries = {
    /**
   * Get applications for user
   */ async getByUserId (userId) {
        try {
            const applications = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].application.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                success: true,
                data: applications
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Get application by ID
   */ async getById (applicationId) {
        try {
            const application = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].application.findUnique({
                where: {
                    id: applicationId
                }
            });
            if (!application) {
                return {
                    success: false,
                    error: 'Application not found',
                    code: 'NOT_FOUND'
                };
            }
            return {
                success: true,
                data: application
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    },
    /**
   * Update application status
   */ async updateStatus (applicationId, status// 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
    ) {
        try {
            const updateData = {
                status
            };
            if (status === 'submitted') {
                updateData.submittedAt = new Date();
            } else if (status === 'approved' || status === 'rejected') {
                updateData.reviewedAt = new Date();
            }
            const application = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].application.update({
                where: {
                    id: applicationId
                },
                data: updateData
            });
            return {
                success: true,
                data: application
            };
        } catch (error) {
            return handlePrismaError(error);
        }
    }
};
}),
"[project]/lib/validations/schemas.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Zod validation schemas for all input types
// These provide runtime validation and type inference
__turbopack_context__.s([
    "applicationSchema",
    ()=>applicationSchema,
    "applicationUpdateSchema",
    ()=>applicationUpdateSchema,
    "fundingOpportunitySchema",
    ()=>fundingOpportunitySchema,
    "fundingRequirementsSchema",
    ()=>fundingRequirementsSchema,
    "matchSchema",
    ()=>matchSchema,
    "userProfileSchema",
    ()=>userProfileSchema,
    "userProfileUpdateSchema",
    ()=>userProfileUpdateSchema,
    "userRegistrationSchema",
    ()=>userRegistrationSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const fundingRequirementsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    amount_needed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Funding amount must be positive'),
    funding_purpose: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10, 'Funding purpose must be at least 10 characters').max(2000),
    business_stage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'startup',
        'growth',
        'expansion',
        'mature'
    ], {
        errorMap: ()=>({
                message: 'Business stage must be one of: startup, growth, expansion, mature'
            })
    }),
    industry_sector: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one industry sector is required'),
    preferred_funding_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one funding type is required')
});
const userProfileSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Company name is required').max(255, 'Company name must be less than 255 characters').trim(),
    registration_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Registration number is required').max(100, 'Registration number must be less than 100 characters').trim(),
    industry: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Industry is required').max(100, 'Industry must be less than 100 characters').trim(),
    business_description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10, 'Business description must be at least 10 characters').max(2000, 'Business description must be less than 2000 characters').trim(),
    annual_revenue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Annual revenue must be positive').max(999999999999999, 'Annual revenue is too large'),
    employees_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int('Employee count must be a whole number').min(0, 'Employee count must be non-negative').max(1000000, 'Employee count is too large'),
    years_in_business: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int('Years in business must be a whole number').min(0, 'Years in business must be non-negative').max(200, 'Years in business is too large'),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Location is required').max(255, 'Location must be less than 255 characters').trim(),
    funding_requirements: fundingRequirementsSchema
});
const userProfileUpdateSchema = userProfileSchema.partial();
const userRegistrationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email address').max(255, 'Email must be less than 255 characters').toLowerCase().trim(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[a-z]/, 'Password must contain at least one lowercase letter').regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters').trim(),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters').trim(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').max(20, 'Phone number must be less than 20 characters').trim(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'smme',
        'admin'
    ]).default('smme')
});
const applicationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    opportunity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid opportunity ID'),
    match_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid match ID').optional().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'draft',
        'in_review',
        'submitted',
        'approved',
        'rejected'
    ]).default('draft'),
    form_data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).default({}),
    signature: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Signature is required').optional()
});
const applicationUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'draft',
        'in_review',
        'submitted',
        'approved',
        'rejected'
    ]).optional(),
    form_data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    signature: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    outcome: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'approved',
        'rejected'
    ]).optional(),
    outcome_reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const fundingOpportunitySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    funder_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Funder name is required').max(255, 'Funder name must be less than 255 characters').trim(),
    program_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Program name is required').max(255, 'Program name must be less than 255 characters').trim(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters').trim(),
    amount_range_min: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Minimum amount must be positive').max(999999999999999, 'Amount is too large'),
    amount_range_max: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Maximum amount must be positive').max(999999999999999, 'Amount is too large'),
    eligibility_criteria: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one eligibility criterion is required').max(50, 'Too many eligibility criteria'),
    application_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url('Invalid application URL').max(500, 'URL must be less than 500 characters'),
    deadline: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime('Invalid deadline format (must be ISO 8601)').refine((date)=>new Date(date) > new Date(), {
        message: 'Deadline must be in the future'
    }),
    industry_focus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one industry focus is required').max(50, 'Too many industry focuses'),
    funding_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Funding type is required').max(100, 'Funding type must be less than 100 characters').trim(),
    requirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one requirement is required').max(50, 'Too many requirements')
}).refine((data)=>data.amount_range_max >= data.amount_range_min, {
    message: 'Maximum amount must be greater than or equal to minimum amount',
    path: [
        'amount_range_max'
    ]
});
const matchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid user ID'),
    opportunity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid opportunity ID'),
    match_score: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int('Match score must be a whole number').min(0, 'Match score must be between 0 and 100').max(100, 'Match score must be between 0 and 100'),
    match_reasons: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, 'At least one match reason is required').max(20, 'Too many match reasons'),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'new',
        'viewed',
        'interested',
        'applied'
    ]).default('new')
});
}),
"[project]/lib/validations/helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Validation helper functions
// These provide utilities for validating data with Zod
__turbopack_context__.s([
    "formatZodError",
    ()=>formatZodError,
    "safeParseWithZod",
    ()=>safeParseWithZod,
    "validateAndTransform",
    ()=>validateAndTransform,
    "validateWithZod",
    ()=>validateWithZod
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
function formatZodError(error) {
    return error.errors.map((err)=>{
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
    }).join(', ');
}
function validateWithZod(schema, data) {
    try {
        const validated = schema.parse(data);
        return {
            success: true,
            data: validated
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: formatZodError(error)
            };
        }
        return {
            success: false,
            error: 'Validation failed'
        };
    }
}
function safeParseWithZod(schema, data) {
    return schema.safeParse(data);
}
function validateAndTransform(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
        return {
            success: false,
            error: formatZodError(result.error)
        };
    }
}
}),
"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"004ab1230c9b936f1e516085b77bf56571976af577":"getUserProfile","00bb7fc876b5d429ebf45c202731d453991d49206f":"isProfileComplete","407a553b48adb047830837cd6e23bd35cb3dc5639f":"updateUserProfile","407bcd04fecfe2a2b2a8efaabed3cbf083edb8023b":"upsertUserProfile","40fff11f8f229cf24c462419964b98fbf5a0c5c2e0":"createUserProfile"},"",""] */ __turbopack_context__.s([
    "createUserProfile",
    ()=>createUserProfile,
    "getUserProfile",
    ()=>getUserProfile,
    "isProfileComplete",
    ()=>isProfileComplete,
    "updateUserProfile",
    ()=>updateUserProfile,
    "upsertUserProfile",
    ()=>upsertUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/auth-helpers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validations/schemas.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validations/helpers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getUserProfile() {
    try {
        // Check authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        // Use optimized query helper
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].getByUserId(user.id);
        return result;
    } catch (error) {
        // Check if this is a Next.js redirect error - if so, re-throw it
        if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error in getUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch profile'
        };
    }
}
async function createUserProfile(input) {
    try {
        // Validate input with Zod
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateWithZod"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileSchema"], input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Check authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        // Use optimized query helper
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].upsert(user.id, validation.data);
        return result;
    } catch (error) {
        // Check if this is a Next.js redirect error - if so, re-throw it
        if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error in createUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to create profile'
        };
    }
}
async function updateUserProfile(input) {
    try {
        // Validate input with Zod (partial schema)
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateWithZod"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileUpdateSchema"], input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Check authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        // Check if profile exists
        const existingResult = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].getByUserId(user.id);
        if (existingResult.success && existingResult.data) {
            // Update existing profile
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].update(user.id, validation.data);
            return result;
        } else {
            // Create new profile if doesn't exist (upsert behavior)
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].upsert(user.id, validation.data);
            return result;
        }
    } catch (error) {
        // Check if this is a Next.js redirect error - if so, re-throw it
        if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error in updateUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to update profile'
        };
    }
}
async function upsertUserProfile(input) {
    try {
        // Validate input with Zod
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateWithZod"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validations$2f$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileSchema"], input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Check authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        // Use optimized query helper
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].upsert(user.id, validation.data);
        return result;
    } catch (error) {
        // Check if this is a Next.js redirect error - if so, re-throw it
        if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Error in upsertUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to save profile'
        };
    }
}
async function isProfileComplete() {
    try {
        // Check authentication
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return false;
        }
        // Use optimized query helper
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userProfileQueries"].isComplete(user.id);
    } catch (error) {
        console.error('Error checking profile completion:', error);
        // On error, assume incomplete to be safe
        return false;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    upsertUserProfile,
    isProfileComplete
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "004ab1230c9b936f1e516085b77bf56571976af577", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUserProfile, "40fff11f8f229cf24c462419964b98fbf5a0c5c2e0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserProfile, "407a553b48adb047830837cd6e23bd35cb3dc5639f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(upsertUserProfile, "407bcd04fecfe2a2b2a8efaabed3cbf083edb8023b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isProfileComplete, "00bb7fc876b5d429ebf45c202731d453991d49206f", null);
}),
"[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00bb7fc876b5d429ebf45c202731d453991d49206f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isProfileComplete"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$pending$2d$approval$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f2d813bf._.js.map