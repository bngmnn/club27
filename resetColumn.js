import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

 async function resetColumn() {
   const { error } = await supabase
     .from('guests')
     .update({ invitation_state: 'pending' })
     .eq('user_id', 'aa750b46-021d-4324-992e-5a3612f0c3b2');
 
   if (error) {
     console.error('Failed to reset column:', error.message);
     process.exit(1);
   }
 
   console.log('Column reset successfully');
 }
 
 resetColumn();