import { createClient } from "@supabase/supabase-js";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME || "Administrador";

const { data: created, error: createError } =
  await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

if (createError && !createError.message.toLowerCase().includes("already")) {
  throw createError;
}

let user = created?.user;

if (!user) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  user = data.users.find((item) => item.email === email);
}

if (!user) {
  throw new Error(`Could not find or create admin user ${email}`);
}

const { error: profileError } = await supabase.from("profiles").upsert(
  {
    id: user.id,
    email,
    full_name: fullName,
  },
  { onConflict: "id" }
);

if (profileError) throw profileError;

const { error: roleError } = await supabase.from("user_roles").upsert(
  {
    user_id: user.id,
    role: "super_admin",
  },
  { onConflict: "user_id,role" }
);

if (roleError) throw roleError;

console.log(`Admin ready: ${email}`);
