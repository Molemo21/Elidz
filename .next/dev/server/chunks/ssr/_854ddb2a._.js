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
"[project]/app/actions/users.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"006bae14dc3b8a2bd68dcbed4cc4aa7b3b9e17f385":"getAllUsers","40006816566e2a89f9c0f2ca19f28971b1c6371ea5":"getUserById","4047aea1c4bee4149c5fe0ae9ad4b4c959f25bd673":"approveUser","404db9384882c1ec11743b28191c8d841e56c33c0c":"declineUser","6024e55a704adf69203ea0ac23637d9009967aec82":"updateUserApproval"},"",""] */ __turbopack_context__.s([
    "approveUser",
    ()=>approveUser,
    "declineUser",
    ()=>declineUser,
    "getAllUsers",
    ()=>getAllUsers,
    "getUserById",
    ()=>getUserById,
    "updateUserApproval",
    ()=>updateUserApproval
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getAllUsers() {
    try {
        // Create client first to check what cookies are available
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Check what cookies are available
        const cookieStore = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)").then((m)=>m.cookies());
        const allCookies = cookieStore.getAll();
        const supabaseCookies = allCookies.filter((c)=>c.name.includes('sb-') || c.name.includes('supabase'));
        console.log('[getAllUsers] Available Supabase cookies:', supabaseCookies.map((c)=>c.name).join(', ') || 'None');
        console.log('[getAllUsers] Total cookies:', allCookies.length);
        // Try multiple methods to get the user
        console.log('[getAllUsers] Attempting to get user session...');
        // Method 1: Try getSession (reads from cookies)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('[getAllUsers] getSession() error:', sessionError);
        }
        let authUser = session?.user;
        // Method 2: If no session, try getUser() (reads from headers/tokens)
        if (!authUser) {
            console.warn('[getAllUsers] No session from getSession(), trying getUser()...');
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('[getAllUsers] getUser() error:', {
                    message: userError.message,
                    status: userError.status
                });
            }
            authUser = user || null;
        }
        if (!authUser) {
            console.error('[getAllUsers] No authenticated user found');
            return {
                success: false,
                error: 'Unauthorized: Please log in. If you just logged in, try refreshing the page or logging out and back in.'
            };
        }
        console.log('[getAllUsers] User authenticated:', authUser.email);
        // Get user profile to check admin status
        const { data: profile, error: profileError } = await supabase.from('users').select('id, email, role').eq('id', authUser.id).maybeSingle();
        if (profileError) {
            console.error('[getAllUsers] Error fetching user profile:', {
                message: profileError.message,
                code: profileError.code,
                details: profileError.details
            });
            return {
                success: false,
                error: `Profile error: ${profileError.message}`
            };
        }
        if (!profile) {
            console.error('[getAllUsers] User profile not found:', authUser.id);
            return {
                success: false,
                error: 'User profile not found'
            };
        }
        // Verify user is admin
        if (profile.role !== 'admin') {
            console.warn('[getAllUsers] Non-admin user attempted access:', profile.email);
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        console.log('[getAllUsers] Admin verified, fetching all users...');
        const { data: users, error } = await supabase.from('users').select(`
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        approved,
        created_at,
        last_login
      `).order('created_at', {
            ascending: false
        });
        if (error) {
            console.error('Error fetching users list:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return {
                success: false,
                error: error.message || 'Failed to fetch users',
                // Include error code for debugging
                ...error.code && {
                    errorCode: error.code
                }
            };
        }
        console.log(`Successfully fetched ${users?.length || 0} users`);
        return {
            success: true,
            data: users || []
        };
    } catch (error) {
        console.error('Unexpected error in getAllUsers:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        // Handle redirect errors from requireAdmin if it was used elsewhere
        if (error.message?.includes('redirect') || error.message?.includes('NEXT_REDIRECT')) {
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        return {
            success: false,
            error: error.message || 'Failed to fetch users'
        };
    }
}
async function getUserById(userId) {
    try {
        // Create client and verify admin status
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return {
                success: false,
                error: 'Unauthorized: Please log in'
            };
        }
        const { data: profile } = await supabase.from('users').select('role').eq('id', authUser.id).maybeSingle();
        if (!profile || profile.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        const { data: user, error } = await supabase.from('users').select(`
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        approved,
        created_at,
        last_login
      `).eq('id', userId).maybeSingle();
        if (error) {
            console.error('Error fetching user:', error);
            return {
                success: false,
                error: error.message
            };
        }
        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        return {
            success: true,
            data: user
        };
    } catch (error) {
        console.error('Error in getUserById:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch user'
        };
    }
}
async function approveUser(userId) {
    try {
        // Create client and verify admin status
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return {
                success: false,
                error: 'Unauthorized: Please log in'
            };
        }
        const { data: profile } = await supabase.from('users').select('role').eq('id', authUser.id).maybeSingle();
        if (!profile || profile.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        // First verify user exists
        const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email, approved').eq('id', userId).maybeSingle();
        if (fetchError) {
            console.error('Error fetching user:', fetchError);
            return {
                success: false,
                error: fetchError.message
            };
        }
        if (!existingUser) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        if (existingUser.approved) {
            return {
                success: false,
                error: 'User is already approved'
            };
        }
        // Update user approval status
        const { data: updatedUser, error: updateError } = await supabase.from('users').update({
            approved: true
        }).eq('id', userId).select(`
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        approved,
        created_at,
        last_login
      `).single();
        if (updateError) {
            console.error('Error approving user:', updateError);
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            data: updatedUser,
            error: undefined
        };
    } catch (error) {
        console.error('Error in approveUser:', error);
        return {
            success: false,
            error: error.message || 'Failed to approve user'
        };
    }
}
async function declineUser(userId) {
    try {
        // Create client and verify admin status
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return {
                success: false,
                error: 'Unauthorized: Please log in'
            };
        }
        const { data: profile } = await supabase.from('users').select('role').eq('id', authUser.id).maybeSingle();
        if (!profile || profile.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        // First verify user exists
        const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email, approved').eq('id', userId).maybeSingle();
        if (fetchError) {
            console.error('Error fetching user:', fetchError);
            return {
                success: false,
                error: fetchError.message
            };
        }
        if (!existingUser) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        // Update user approval status to false
        const { data: updatedUser, error: updateError } = await supabase.from('users').update({
            approved: false
        }).eq('id', userId).select(`
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        approved,
        created_at,
        last_login
      `).single();
        if (updateError) {
            console.error('Error declining user:', updateError);
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            data: updatedUser,
            error: undefined
        };
    } catch (error) {
        console.error('Error in declineUser:', error);
        return {
            success: false,
            error: error.message || 'Failed to decline user'
        };
    }
}
async function updateUserApproval(userId, approved) {
    try {
        // Create client and verify admin status
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return {
                success: false,
                error: 'Unauthorized: Please log in'
            };
        }
        const { data: profile } = await supabase.from('users').select('role').eq('id', authUser.id).maybeSingle();
        if (!profile || profile.role !== 'admin') {
            return {
                success: false,
                error: 'Unauthorized: Admin access required'
            };
        }
        const { data: updatedUser, error } = await supabase.from('users').update({
            approved
        }).eq('id', userId).select(`
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        approved,
        created_at,
        last_login
      `).single();
        if (error) {
            console.error('Error updating user approval:', error);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data: updatedUser
        };
    } catch (error) {
        console.error('Error in updateUserApproval:', error);
        return {
            success: false,
            error: error.message || 'Failed to update user approval'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAllUsers,
    getUserById,
    approveUser,
    declineUser,
    updateUserApproval
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllUsers, "006bae14dc3b8a2bd68dcbed4cc4aa7b3b9e17f385", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserById, "40006816566e2a89f9c0f2ca19f28971b1c6371ea5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveUser, "4047aea1c4bee4149c5fe0ae9ad4b4c959f25bd673", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(declineUser, "404db9384882c1ec11743b28191c8d841e56c33c0c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserApproval, "6024e55a704adf69203ea0ac23637d9009967aec82", null);
}),
"[project]/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/users.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "006bae14dc3b8a2bd68dcbed4cc4aa7b3b9e17f385",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllUsers"],
    "4047aea1c4bee4149c5fe0ae9ad4b4c959f25bd673",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveUser"],
    "404db9384882c1ec11743b28191c8d841e56c33c0c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["declineUser"],
    "60b59951fd5143ab30439d8982ae3ae4d3d966f67f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserRecord"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$users$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/users.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$create$2d$user$2d$record$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/create-user-record.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/users.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_854ddb2a._.js.map