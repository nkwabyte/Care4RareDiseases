import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// Setup function to initialize demo doctors and patients
export async function setupDemoData() {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Demo doctor with Ghanaian name
  const demoDoctors = [
    {
      email: 'kwame.mensah@hospital.gh',
      password: 'demo123',
      name: 'Dr. Kwame Mensah',
      specialty: 'Clinical Genetics',
    },
  ];

  // Create demo doctors in Supabase Auth
  for (const doctor of demoDoctors) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser?.users.some(u => u.email === doctor.email);

      if (!userExists) {
        const { data, error } = await supabase.auth.admin.createUser({
          email: doctor.email,
          password: doctor.password,
          email_confirm: true, // Auto-confirm since we don't have email server
          user_metadata: {
            name: doctor.name,
            specialty: doctor.specialty,
          },
        });

        if (error) {
          console.log(`Error creating doctor ${doctor.email}: ${error.message}`);
        } else {
          console.log(`Created doctor: ${doctor.email}`);
          
          // Store doctor data in KV store
          await kv.set(`doctor:${doctor.email}`, {
            id: data.user?.id,
            email: doctor.email,
            name: doctor.name,
            specialty: doctor.specialty,
          });
        }
      } else {
        console.log(`Doctor already exists: ${doctor.email}`);
      }
    } catch (error) {
      console.log(`Error setting up doctor ${doctor.email}: ${error}`);
    }
  }

  // Assign 4 specific patients to Dr. Kwame Mensah
  const assignedPatientIds = ['UDN-P4', 'UDN-P7', 'UDN-P12', 'UDN-P18'];

  // Assign patients to Dr. Kwame Mensah
  const doctorEmail = 'kwame.mensah@hospital.gh';
  const assignmentsKey = `doctor_patients:${doctorEmail}`;
  
  try {
    await kv.set(assignmentsKey, assignedPatientIds);
    console.log(`Assigned ${assignedPatientIds.length} patients to ${doctorEmail}: ${assignedPatientIds.join(', ')}`);
  } catch (error) {
    console.log(`Error assigning patients: ${error}`);
  }

  console.log('Demo data setup complete');
}
