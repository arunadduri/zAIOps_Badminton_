// Supabase Configuration
const SUPABASE_URL = 'https://yvzfnotfpmoitzyljbfd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2emZub3RmcG1vaXR6eWxqYmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQzODIsImV4cCI6MjA5MTY3MDM4Mn0.bSN6hGtv1keJMFjjPUBGD6d4Vg6Ks3YuuFA7E8UArfE';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Category Configuration
const categories = {
    male: [
        { id: 'mensSingles', label: "Men's Singles", hasPartner: false },
        { id: 'mensDoubles', label: "Men's Doubles", hasPartner: true },
        { id: 'mixedDoubles', label: "Mixed Doubles", hasPartner: true }
    ],
    female: [
        { id: 'womensSingles', label: "Women's Singles", hasPartner: false },
        { id: 'womensDoubles', label: "Women's Doubles", hasPartner: true },
        { id: 'mixedDoubles', label: "Mixed Doubles", hasPartner: true }
    ]
};

// Global Variables
let errorTimeout;

// Made with Bob
