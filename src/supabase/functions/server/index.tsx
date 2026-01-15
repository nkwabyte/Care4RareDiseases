import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { setupDemoData } from "./setup.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fbf76271/health", (c) => {
  return c.json({ status: "ok" });
});

// Setup demo data (call this once to initialize demo doctors and patients)
app.post("/make-server-fbf76271/setup", async (c) => {
  try {
    await setupDemoData();
    return c.json({ success: true, message: "Demo data initialized successfully" });
  } catch (error) {
    console.log(`Setup error: ${error}`);
    return c.json({ error: "Setup failed" }, 500);
  }
});

// Login endpoint - validates doctor credentials against Django backend
app.post("/make-server-fbf76271/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if doctor exists in our system
    let doctorData = await kv.get(`doctor:${email}`);
    
    // Auto-initialize demo data if doctor doesn't exist and it's the demo email
    if (!doctorData && email === 'kwame.mensah@hospital.gh') {
      console.log('Demo doctor not found, initializing demo data...');
      try {
        await setupDemoData();
        doctorData = await kv.get(`doctor:${email}`);
      } catch (setupError) {
        console.log(`Auto-setup failed: ${setupError}`);
      }
    }
    
    if (!doctorData) {
      console.log(`Login failed: Doctor not found for email ${email}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log(`Login authentication error: ${authError.message}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Return session and doctor info
    return c.json({
      session: authData.session,
      doctor: doctorData,
    });
  } catch (error) {
    console.log(`Login error: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Get patients assigned to a doctor
app.get("/make-server-fbf76271/patients", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Patient fetch authorization error: ${authError?.message}`);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Get doctor's email
    const doctorEmail = user.email;
    
    // Get patients assigned to this doctor
    const assignmentsKey = `doctor_patients:${doctorEmail}`;
    const patientIds = await kv.get(assignmentsKey) || [];
    
    if (!Array.isArray(patientIds) || patientIds.length === 0) {
      return c.json({ patients: [] });
    }

    // Return patient IDs as simple objects with id field
    const patients = patientIds.map(id => ({ id }));

    return c.json({ patients });
  } catch (error) {
    console.log(`Error fetching patients: ${error}`);
    return c.json({ error: "Failed to fetch patients" }, 500);
  }
});

// Save or update patient (restricted to assigned doctor)
app.post("/make-server-fbf76271/patients", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Patient save authorization error: ${authError?.message}`);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const patientData = await c.req.json();
    const doctorEmail = user.email;

    // Save patient data
    await kv.set(`patient:${patientData.id}`, patientData);

    // Ensure patient is assigned to this doctor
    const assignmentsKey = `doctor_patients:${doctorEmail}`;
    const existingPatients = await kv.get(assignmentsKey) || [];
    
    if (!existingPatients.includes(patientData.id)) {
      existingPatients.push(patientData.id);
      await kv.set(assignmentsKey, existingPatients);
    }

    return c.json({ success: true, patient: patientData });
  } catch (error) {
    console.log(`Error saving patient: ${error}`);
    return c.json({ error: "Failed to save patient" }, 500);
  }
});

Deno.serve(app.fetch);