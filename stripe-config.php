<?php
// Stripe Configuration
// Replace with your actual Stripe keys
// Get your keys from: https://dashboard.stripe.com/apikeys

// Load Stripe PHP library
// Option 1: If using Composer (recommended)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
// Option 2: If manually downloaded Stripe PHP library
// Download from: https://github.com/stripe/stripe-php
// Uncomment and set the correct path:
// require_once(__DIR__ . '/stripe-php/init.php');

// ============================================
// STRIPE API KEYS - UPDATE THESE VALUES
// ============================================

// Replace 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' with your actual Stripe publishable key
$stripe_publishable_key = 'pk_test_51RT4CA2a1pn6Gm2fwggj54EAH2HoCpP2ouUUwKyLdZ6SH0fh2obwnca0WONFrrzokWxP2O7ERM3XAddpdSgq6QdD00HAyWQ5Hw';

// Replace 'sk_test_YOUR_SECRET_KEY_HERE' with your actual Stripe secret key
$stripe_secret_key = 'sk_test_51RT4CA2a1pn6Gm2fkFPCW5y3QipCtn2vUFpOMhYDM2Nx4bKeRDOKbVjtv0aqlLaEJG8VQ9B9WNEA1uOS45fesWPa00dJpxZ8bn';

// For production, use environment variables or secure config file
// $stripe_publishable_key = getenv('STRIPE_PUBLISHABLE_KEY');
// $stripe_secret_key = getenv('STRIPE_SECRET_KEY');

// ============================================

// Initialize Stripe if library is loaded
if (class_exists('\Stripe\Stripe')) {
    \Stripe\Stripe::setApiKey($stripe_secret_key);
}
?>
