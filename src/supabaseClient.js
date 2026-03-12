import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jsjffaomzjbewdodpdti.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mBP9OC5MNRISscUlZrY_ZA_eGo-aQX4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
