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
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Try getSession first - this reads from cookies
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        console.error('[getServerSession] Session error:', {
            message: sessionError.message,
            status: sessionError.status
        });
    }
    // If we have a session, use it
    if (session?.user) {
        console.log('[getServerSession] Session found via getSession()');
        const { data: profile, error: profileError } = await supabase.from('users').select('id, email, role, first_name, last_name, approved').eq('id', session.user.id).maybeSingle();
        if (profileError) {
            console.error('[getServerSession] Profile query error:', profileError);
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
    console.warn('[getServerSession] No session from getSession(), trying getUser()...');
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('[getServerSession] getUser() error:', {
            message: error.message,
            status: error.status
        });
        return null;
    }
    if (!user) {
        console.warn('[getServerSession] No user found');
        return null;
    }
    console.log('[getServerSession] User found via getUser()');
    const { data: profile, error: profileError } = await supabase.from('users').select('id, email, role, first_name, last_name, approved').eq('id', user.id).maybeSingle();
    if (profileError) {
        console.error('Profile query error:', profileError);
        return null;
    }
    if (!profile) {
        console.warn('Profile not found for user:', user.id);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/auth-helpers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getUserProfile() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: profile, error } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle();
        if (error) {
            console.error('Error fetching user profile:', error);
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
        console.error('Error in getUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch profile'
        };
    }
}
async function createUserProfile(input) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        console.error('Error in createUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to create profile'
        };
    }
}
async function updateUserProfile(input) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        console.error('Error in updateUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to update profile'
        };
    }
}
async function upsertUserProfile(input) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        console.error('Error in upsertUserProfile:', error);
        return {
            success: false,
            error: error.message || 'Failed to save profile'
        };
    }
}
async function isProfileComplete() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$auth$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuth"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "004ab1230c9b936f1e516085b77bf56571976af577",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"],
    "00bb7fc876b5d429ebf45c202731d453991d49206f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isProfileComplete"],
    "407a553b48adb047830837cd6e23bd35cb3dc5639f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserProfile"],
    "407bcd04fecfe2a2b2a8efaabed3cbf083edb8023b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["upsertUserProfile"],
    "40fff11f8f229cf24c462419964b98fbf5a0c5c2e0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserProfile"],
    "60b59951fd5143ab30439d8982ae3ae4d3d966f67f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserRecord"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$user$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/user-profiles.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_4c79670f._.js.map