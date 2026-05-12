import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      role,
      university,
      student_id,
      course,
      year_of_study,
      business_name,
      tax_pin,
      bank_account,
    } = body;

    // Insert profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: user_id,
        first_name,
        last_name,
        email,
        phone,
        role,
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    // Insert role-specific data
    if (role === 'student') {
      const { error: studentError } = await supabaseClient
        .from('students')
        .upsert({
          user_id,
          university,
          student_id,
          course,
          year_of_study,
          is_verified: false,
        }, { onConflict: 'user_id' });
      if (studentError) throw studentError;
    } else if (role === 'landlord') {
      const { error: landlordError } = await supabaseClient
        .from('landlords')
        .upsert({
          user_id,
          business_name,
          tax_pin,
          bank_account,
          verification_status: 'pending',
        }, { onConflict: 'user_id' });
      if (landlordError) throw landlordError;
    } else if (role === 'agent') {
      const { error: agentError } = await supabaseClient
        .from('agents')
        .upsert({ user_id }, { onConflict: 'user_id' });
      if (agentError) throw agentError;
    } else if (role === 'admin') {
      const { error: adminError } = await supabaseClient
        .from('admins')
        .upsert({ user_id }, { onConflict: 'user_id' });
      if (adminError) throw adminError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});