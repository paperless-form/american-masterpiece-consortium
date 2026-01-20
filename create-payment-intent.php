<?php
// Include Stripe configuration
require_once 'stripe-config.php';

header('Content-Type: application/json');

// Get POST data - handle both JSON and form data
$input = null;
$rawInput = file_get_contents('php://input');

// Try to decode as JSON first
if (!empty($rawInput)) {
    $input = json_decode($rawInput, true);
}

// If JSON decode failed or empty, try form data
if (!$input || empty($input)) {
    $input = $_POST;
}

$amount = isset($input['amount']) ? intval($input['amount']) : 0;
$currency = isset($input['currency']) ? $input['currency'] : 'usd';
$order_ref = isset($input['order_ref']) ? $input['order_ref'] : '';

// Validate amount
if ($amount <= 0) {
    echo json_encode(['error' => 'Invalid payment amount.']);
    exit;
}

// Check if Stripe is initialized
if (!class_exists('\Stripe\Stripe')) {
    echo json_encode(['error' => 'Stripe PHP library is not installed. Please install it using: composer require stripe/stripe-php']);
    exit;
}

try {
    // Create PaymentIntent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $amount,
        'currency' => $currency,
        'metadata' => [
            'order_ref' => $order_ref
        ],
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
    ]);

    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    echo json_encode(['error' => $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => 'An error occurred while processing your payment.']);
}
?>
