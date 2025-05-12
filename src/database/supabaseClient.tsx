import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uwvuiperonzpckvdnncv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dnVpcGVyb256cGNrdmRubmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTkxMzEsImV4cCI6MjA2MDM3NTEzMX0.B_6PZQUbP6lqmUmaMScY_tzHUQFVf0S3p2B16mPr5RY';

export const supabase =createClient(supabaseUrl, supabaseAnonKey);