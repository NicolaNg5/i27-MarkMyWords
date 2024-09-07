// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uiytrctjwhhvghurjwkv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeXRyY3Rqd2hodmdodXJqd2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NjA0MDMsImV4cCI6MjAzOTAzNjQwM30.ZLxpxXvuLwLnI2rBpNDvJPHwDb-i70X6tm4ZUApxx1w";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
