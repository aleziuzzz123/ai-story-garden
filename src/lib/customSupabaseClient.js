import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmxsvryhrzppsfqiclhk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteHN2cnlocnpwcHNmcWljbGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDUwNDgsImV4cCI6MjA2ODEyMTA0OH0.v1ESOgiTYbNEwNeNFC4_VG_cUDn7HfUD4WWyVPyDOK4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);