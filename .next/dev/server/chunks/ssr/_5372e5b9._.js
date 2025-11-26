module.exports = [
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$1$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$84$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.1.0_@supabase+supabase-js@2.84.0/node_modules/@supabase/ssr/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$1$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$84$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createServerClient"])(("TURBOPACK compile-time value", "https://nxdjdkoamvertmzgslyq.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZGpka29hbXZlcnRtemdzbHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTUwMTgsImV4cCI6MjA3OTU3MTAxOH0.2qdDKkJUEPI-bsA15NuEe4vz9XjsFQuZmtYeF_UbOzI"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60b59951fd5143ab30439d8982ae3ae4d3d966f67f":"createUserRecord"},"",""] */ __turbopack_context__.s([
    "createUserRecord",
    ()=>createUserRecord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function createUserRecord(userId, userData) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Check if user record already exists
        const { data: existingUser } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
        if (existingUser) {
            return {
                success: true,
                message: 'User record already exists',
                data: existingUser
            };
        }
        // Use the system function via RPC (bypasses RLS)
        // This function uses SECURITY DEFINER and doesn't require auth check
        const { data, error } = await supabase.rpc('create_user_record_system', {
            user_id: userId,
            user_email: userData.email,
            user_role: userData.role,
            user_first_name: userData.firstName,
            user_last_name: userData.lastName,
            user_phone: userData.phone
        });
        if (error) {
            // If duplicate key error, record exists (race condition - trigger created it)
            if (error.code === '23505') {
                return {
                    success: true,
                    message: 'User record already exists (created by trigger)'
                };
            }
            console.error('Failed to create user record via RPC:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return {
                success: false,
                error: error.message || 'Failed to create user record'
            };
        }
        return {
            success: true,
            message: 'User record created successfully',
            data: {
                id: data || userId
            }
        };
    } catch (error) {
        console.error('Error in createUserRecord:', error);
        return {
            success: false,
            error: error.message || 'Failed to create user record'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createUserRecord
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUserRecord, "60b59951fd5143ab30439d8982ae3ae4d3d966f67f", null);
}),
"[project]/lib/supabase/auth-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getServerSession",
    ()=>getServerSession,
    "requireAdmin",
    ()=>requireAdmin,
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
async function getServerSession() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Try getSession first - this reads from cookies
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('[getServerSession] Session error:', {
                message: sessionError.message,
                status: sessionError.status,
                code: sessionError.status
            });
        }
        // If we have a session, use it
        if (session?.user) {
            console.log('[getServerSession] Session found via getSession(), user ID:', session.user.id);
            const { data: profile, error: profileError } = await supabase.from('users').select('id, email, role, first_name, last_name, approved').eq('id', session.user.id).maybeSingle();
            if (profileError) {
                console.error('[getServerSession] Profile query error:', {
                    message: profileError.message,
                    code: profileError.code,
                    details: profileError.details
                });
                return null;
            }
            if (!profile) {
                console.warn('[getServerSession] Profile not found for user:', session.user.id);
                return null;
            }
            return {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                name: `${profile.first_name} ${profile.last_name}`,
                approved: profile.approved
            };
        }
        // Fallback: try getUser() which might work if session is in headers
        // This is more reliable as it validates the token
        console.log('[getServerSession] No session from getSession(), trying getUser()...');
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            // Log error but don't treat it as fatal - might be missing cookies
            console.log('[getServerSession] getUser() error (this is normal if cookies not synced):', {
                message: error.message,
                status: error.status
            });
            return null;
        }
        if (!user) {
            console.log('[getServerSession] No user found via getUser()');
            return null;
        }
        console.log('[getServerSession] User found via getUser(), user ID:', user.id);
        const { data: profile, error: profileError } = await supabase.from('users').select('id, email, role, first_name, last_name, approved').eq('id', user.id).maybeSingle();
        if (profileError) {
            console.error('[getServerSession] Profile query error:', {
                message: profileError.message,
                code: profileError.code,
                details: profileError.details
            });
            return null;
        }
        if (!profile) {
            console.warn('[getServerSession] Profile not found for user:', user.id);
            return null;
        }
        return {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            name: `${profile.first_name} ${profile.last_name}`,
            approved: profile.approved
        };
    } catch (error) {
        // Catch any unexpected errors
        console.error('[getServerSession] Unexpected error:', {
            message: error?.message,
            stack: error?.stack
        });
        return null;
    }
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
"[project]/lib/db/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Reusable query helpers with consistent error handling
// These provide a standardized way to interact with the database
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
/**
 * Generic error handler for Supabase errors
 * Maps common error codes to user-friendly messages
 */ function handleSupabaseError(error) {
    // Unique constraint violation (duplicate key)
    if (error?.code === '23505') {
        return {
            success: false,
            error: 'Record already exists',
            code: 'DUPLICATE'
        };
    }
    // Foreign key violation
    if (error?.code === '23503') {
        return {
            success: false,
            error: 'Referenced record does not exist',
            code: 'FOREIGN_KEY'
        };
    }
    // Not found
    if (error?.code === 'PGRST116') {
        return {
            success: false,
            error: 'Record not found',
            code: 'NOT_FOUND'
        };
    }
    // Permission denied (RLS)
    if (error?.code === '42501' || error?.message?.includes('permission denied')) {
        return {
            success: false,
            error: 'Permission denied',
            code: 'PERMISSION_DENIED'
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
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Profile not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Upsert user profile (create or update)
   */ async upsert (userId, profile) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('user_profiles').upsert({
                ...profile,
                user_id: userId
            }, {
                onConflict: 'user_id'
            }).select().single();
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Update user profile (partial update)
   */ async update (userId, updates) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('user_profiles').update(updates).eq('user_id', userId).select().single();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Profile not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
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
                profile.company_name,
                profile.registration_number,
                profile.industry,
                profile.business_description,
                profile.location,
                profile.annual_revenue,
                profile.employees_count,
                profile.years_in_business,
                profile.funding_requirements
            ];
            if (required.some((field)=>field === null || field === undefined || field === '')) {
                return false;
            }
            // Validate funding_requirements structure
            const fundingReqs = profile.funding_requirements;
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
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('users').select('*').order('created_at', {
                ascending: false
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get user by ID
   */ async getById (userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'User not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get user by email
   */ async getByEmail (email) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'User not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Update user approval status
   */ async updateApproval (userId, approved) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('users').update({
                approved
            }).eq('id', userId).select().single();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'User not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Update user last login timestamp
   */ async updateLastLogin (userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('users').update({
                last_login: new Date().toISOString()
            }).eq('id', userId).select().single();
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    }
};
const opportunityQueries = {
    /**
   * Get all opportunities
   */ async getAll () {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('funding_opportunities').select('*').order('created_at', {
                ascending: false
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get opportunity by ID
   */ async getById (opportunityId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('funding_opportunities').select('*').eq('id', opportunityId).maybeSingle();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Opportunity not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get opportunities by industry
   */ async getByIndustry (industry) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('funding_opportunities').select('*').contains('industry_focus', [
                industry
            ]).order('created_at', {
                ascending: false
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get active opportunities (deadline in future)
   */ async getActive () {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const now = new Date().toISOString();
            const { data, error } = await supabase.from('funding_opportunities').select('*').gt('deadline', now).order('deadline', {
                ascending: true
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    }
};
const matchQueries = {
    /**
   * Get matches for user
   */ async getByUserId (userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('matches').select('*').eq('user_id', userId).order('match_score', {
                ascending: false
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Update match status
   */ async updateStatus (matchId, status) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const updateData = {
                status
            };
            if (status === 'viewed') {
                updateData.viewed_at = new Date().toISOString();
            }
            const { data, error } = await supabase.from('matches').update(updateData).eq('id', matchId).select().single();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Match not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    }
};
const applicationQueries = {
    /**
   * Get applications for user
   */ async getByUserId (userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('applications').select('*').eq('user_id', userId).order('created_at', {
                ascending: false
            });
            if (error) return handleSupabaseError(error);
            return {
                success: true,
                data: data || []
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Get application by ID
   */ async getById (applicationId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.from('applications').select('*').eq('id', applicationId).maybeSingle();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Application not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    },
    /**
   * Update application status
   */ async updateStatus (applicationId, status) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
            const updateData = {
                status
            };
            if (status === 'submitted') {
                updateData.submitted_at = new Date().toISOString();
            } else if (status === 'approved' || status === 'rejected') {
                updateData.reviewed_at = new Date().toISOString();
            }
            const { data, error } = await supabase.from('applications').update(updateData).eq('id', applicationId).select().single();
            if (error) return handleSupabaseError(error);
            if (!data) return {
                success: false,
                error: 'Application not found',
                code: 'NOT_FOUND'
            };
            return {
                success: true,
                data
            };
        } catch (error) {
            return handleSupabaseError(error);
        }
    }
};
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
        // Use getServerSession instead of requireAuth to avoid redirect issues
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        const supabase = await createClient();
        // Validate required fields
        if (!input.company_name || !input.registration_number || !input.industry) {
            return {
                success: false,
                error: 'Missing required fields'
            };
        }
        const { data: profile, error } = await supabase.from('user_profiles').insert({
            user_id: user.id,
            company_name: input.company_name,
            registration_number: input.registration_number,
            industry: input.industry,
            business_description: input.business_description,
            annual_revenue: input.annual_revenue,
            employees_count: input.employees_count,
            years_in_business: input.years_in_business,
            location: input.location,
            funding_requirements: input.funding_requirements
        }).select().single();
        if (error) {
            console.error('Error creating user profile:', error);
            // Handle unique constraint violation (profile already exists)
            if (error.code === '23505') {
                return {
                    success: false,
                    error: 'Profile already exists. Use update instead.'
                };
            }
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data: profile
        };
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
        // Use getServerSession instead of requireAuth to avoid redirect issues
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        const supabase = await createClient();
        // Build update object, only including provided fields
        const updateData = {};
        if (input.company_name !== undefined) updateData.company_name = input.company_name;
        if (input.registration_number !== undefined) updateData.registration_number = input.registration_number;
        if (input.industry !== undefined) updateData.industry = input.industry;
        if (input.business_description !== undefined) updateData.business_description = input.business_description;
        if (input.annual_revenue !== undefined) updateData.annual_revenue = input.annual_revenue;
        if (input.employees_count !== undefined) updateData.employees_count = input.employees_count;
        if (input.years_in_business !== undefined) updateData.years_in_business = input.years_in_business;
        if (input.location !== undefined) updateData.location = input.location;
        if (input.funding_requirements !== undefined) {
            updateData.funding_requirements = input.funding_requirements;
        }
        // Check if profile exists first
        const { data: existingProfile } = await supabase.from('user_profiles').select('id').eq('user_id', user.id).maybeSingle();
        let result;
        if (existingProfile) {
            // Update existing profile
            const { data: profile, error } = await supabase.from('user_profiles').update(updateData).eq('user_id', user.id).select().single();
            if (error) {
                console.error('Error updating user profile:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
            result = {
                success: true,
                data: profile
            };
        } else {
            // Create new profile if doesn't exist (upsert behavior)
            const { data: profile, error } = await supabase.from('user_profiles').insert({
                user_id: user.id,
                ...updateData
            }).select().single();
            if (error) {
                console.error('Error creating user profile during update:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
            result = {
                success: true,
                data: profile
            };
        }
        return result;
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
        // Use getServerSession instead of requireAuth to avoid redirect issues
        // If no session, return error instead of redirecting
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please log in.'
            };
        }
        const supabase = await createClient();
        // Validate required fields
        if (!input.company_name || !input.registration_number || !input.industry) {
            return {
                success: false,
                error: 'Missing required fields'
            };
        }
        const { data: profile, error } = await supabase.from('user_profiles').upsert({
            user_id: user.id,
            company_name: input.company_name,
            registration_number: input.registration_number,
            industry: input.industry,
            business_description: input.business_description,
            annual_revenue: input.annual_revenue,
            employees_count: input.employees_count,
            years_in_business: input.years_in_business,
            location: input.location,
            funding_requirements: input.funding_requirements
        }, {
            onConflict: 'user_id'
        }).select().single();
        if (error) {
            console.error('Error upserting user profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data: profile
        };
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
        // Use getServerSession instead of requireAuth to avoid redirect issues
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])();
        if (!user) {
            return false;
        }
        const supabase = await createClient();
        const { data: profile, error } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle();
        // If no profile exists or error occurred, profile is incomplete
        if (error || !profile) {
            return false;
        }
        // Check all required fields are filled
        // Basic business information
        if (!profile.company_name || profile.company_name.trim() === '') return false;
        if (!profile.registration_number || profile.registration_number.trim() === '') return false;
        if (!profile.industry || profile.industry.trim() === '') return false;
        if (!profile.business_description || profile.business_description.trim() === '') return false;
        if (!profile.location || profile.location.trim() === '') return false;
        // Business metrics
        if (profile.annual_revenue === null || profile.annual_revenue === undefined) return false;
        if (profile.employees_count === null || profile.employees_count === undefined) return false;
        if (profile.years_in_business === null || profile.years_in_business === undefined) return false;
        // Funding requirements (JSONB field)
        if (!profile.funding_requirements || typeof profile.funding_requirements !== 'object') return false;
        const fundingReqs = profile.funding_requirements;
        if (!fundingReqs.amount_needed || fundingReqs.amount_needed === null || fundingReqs.amount_needed === undefined) return false;
        if (!fundingReqs.funding_purpose || fundingReqs.funding_purpose.trim() === '') return false;
        // All required fields are present and filled
        return true;
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
"[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00bb7fc876b5d429ebf45c202731d453991d49206f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isProfileComplete"],
    "60b59951fd5143ab30439d8982ae3ae4d3d966f67f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserRecord"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$pending$2d$approval$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/pending-approval/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_5372e5b9._.js.map