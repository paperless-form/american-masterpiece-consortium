<?php
// Include Stripe configuration to get publishable key
require_once 'stripe-config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>American Masterpiece Consortium - Partnership Selection</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <img src="main.png" alt="American Masterpiece Consortium Logo" class="logo">
        </header>
        
            <main class="main-content">
            
            <!-- Stepper Indicator -->
            <div class="stepper-container">
                <div class="stepper">
                    <div class="stepper-step active" data-step="1">
                        <div class="stepper-step-number">1</div>
                        <div class="stepper-step-label">Partnership Selection</div>
                    </div>
                    <div class="stepper-line"></div>
                    <div class="stepper-step" data-step="2">
                        <div class="stepper-step-number">2</div>
                        <div class="stepper-step-label">Contact Information</div>
                    </div>
                    <div class="stepper-line"></div>
                    <div class="stepper-step" data-step="3">
                        <div class="stepper-step-number">3</div>
                        <div class="stepper-step-label">Attendee Information</div>
                    </div>
                    <div class="stepper-line"></div>
                    <div class="stepper-step" data-step="4">
                        <div class="stepper-step-number">4</div>
                        <div class="stepper-step-label">Payment</div>
                    </div>
                </div>
            </div>
            
            <form class="partnership-form" id="partnershipForm" action="https://script.google.com/macros/s/AKfycbwn_AMTMjYTkarMyiijdoewGpiWaveKV-SHeJxBOPFVyrRMs_uWhb8h7h4DnFNbCIA_EQ/exec" method="POST">
                <div class="hidden-content">
                    <input type="hidden" name="date" class="today">
                    <input type="hidden" name="order_ref" class="order_ref">
                    <input type="hidden" name="totalAmount" id="totalAmount" class="totalAmount">
                </div>
                <!-- Step 1: Partnership Selection -->
                <div class="form-step active" id="step1" data-step="1">
                    <h1>Select One Option</h1>
                    <div class="form-section">
                        <div class="tier-option">
                            <label class="tier-label">
                                <input type="radio" name="tier" value="tier1" class="tier-radio">
                                <div class="tier-content">
                                    <div class="tier-header">
                                        <span class="tier-name">Tier 1 — National Stewardship Partner</span>
                                    </div>
                                    <div class="tier-details">
                                        <p class="tier-contribution">One-time contribution: <strong>$3,000</strong></p>
                                        <p class="tier-benefit">Includes up to three (3) complimentary unveiling attendees</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <div class="tier-option">
                            <label class="tier-label">
                                <input type="radio" name="tier" value="tier2" class="tier-radio">
                                <div class="tier-content">
                                    <div class="tier-header">
                                        <span class="tier-name">Tier 2 — Supporting Cultural Partner</span>
                                    </div>
                                    <div class="tier-details">
                                        <p class="tier-contribution">One-time contribution: <strong>$1,500</strong></p>
                                        <p class="tier-benefit">Includes up to two (2) complimentary unveiling attendees</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <div class="tier-option">
                            <label class="tier-label">
                                <input type="radio" name="tier" value="tier3" class="tier-radio">
                                <div class="tier-content">
                                    <div class="tier-header">
                                        <span class="tier-name">Tier 3 — Unveiling Supporter</span>
                                    </div>
                                    <div class="tier-details">
                                        <p class="tier-contribution">One-time contribution of <strong>$300 or more</strong></p>
                                        <p class="tier-note">Attendance for named individual only</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="tier-error-message" id="tierError" style="display: none;">
                            Please select one of these.
                        </div>
                    </div>
                    
                    <!-- Tier 3 Contribution Amount Field -->
                    <div class="tier3-contribution-section" id="tier3ContributionSection" style="display: none;">
                        <div class="form-field">
                            <label for="contributionAmount" class="field-label">Contribution Amount</label>
                            <div class="contribution-input-wrapper">
                                <span class="contribution-prefix">$</span>
                                <input type="text" id="contributionAmount" name="contributionAmount" class="form-input required contribution-input number" placeholder="300" min="300">
                            </div>
                            <span class="error-message" id="contributionAmountError"></span>
                            <p class="field-hint">Minimum contribution: $300</p>
                        </div>
                    </div>
                    
                    <div class="clarifications-section">
                        <h2 class="clarifications-title">Important Clarifications</h2>
                        <ul class="clarifications-list">
                            <li>Unveiling access is included for Tier 1 (up to 3 attendees) and Tier 2 (up to 2 attendees).</li>
                            <li>Unveiling Supporter access is limited to the named attendee.</li>
                            <li>Eligibility for permanent placement consideration is limited to Tier 1 and Tier 2</li>
                            <li>Participation does not guarantee a physical exhibition at the participant's location.</li>
                            <li>Final exhibition locations are determined by the artwork's owner and curatorial team.</li>
                            <li>Travel, lodging, and meals not included.</li>
                        </ul>
                    </div>
                    
                    <div class="acknowledgment-section">
                        <label class="acknowledgment-label">
                            <input type="checkbox" name="acknowledgment" class="acknowledgment-checkbox">
                            <span class="acknowledgment-text">I acknowledge and understand the above distinctions.</span>
                        </label>
                        <span class="error-message" id="acknowledgmentError"></span>
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="step-next-btn" id="nextStep1">Continue</button>
                    </div>
                </div>
                
                <!-- Step 2: Contact Information -->
                <div class="form-step" id="step2" data-step="2" style="display: none;">
                    <div class="contact-fields-section" id="contactFields">
                        <div class="form-field">
                            <label for="institutionName" class="field-label">Institution / Organization Name</label>
                            <input type="text" id="institutionName" name="institutionName" class="form-input required">
                            <span class="error-message" id="institutionNameError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="contactName" class="field-label">Primary Contact Name & Title</label>
                            <input type="text" id="contactName" name="contactName" class="form-input required">
                            <span class="error-message" id="contactNameError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="email" class="field-label">Email Address</label>
                            <input type="text" id="email" name="email" class="form-input required email">
                            <span class="error-message" id="emailError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="phone" class="field-label">Phone Number</label>
                            <input type="text" id="phone" name="phone" class="form-input required number">
                            <span class="error-message" id="phoneError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="street" class="field-label">Street Address</label>
                            <input type="text" id="street" name="street" class="form-input required">
                            <span class="error-message" id="streetError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="city" class="field-label">City</label>
                            <input type="text" id="city" name="city" class="form-input required">
                            <span class="error-message" id="cityError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="state" class="field-label">State</label>
                            <input type="text" id="state" name="state" class="form-input required">
                            <span class="error-message" id="stateError"></span>
                        </div>
                        
                        <div class="form-field">
                            <label for="zipCode" class="field-label">Zip Code</label>
                            <input type="text" id="zipCode" name="zipCode" class="form-input required">
                            <span class="error-message" id="zipCodeError"></span>
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="step-prev-btn" id="prevStep2">Previous</button>
                        <button type="button" class="step-next-btn" id="nextStep2">Continue</button>
                    </div>
                </div>
                
                <!-- Step 3: Attendee Information -->
                <div class="form-step" id="step3" data-step="3" style="display: none;">
                    <div class="attendee-section" id="attendeeSection">
                        <h2 class="attendee-title">Attendee Information</h2>
                        
                        <div class="attendee-info-banner">
                            <div class="attendee-info-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="attendee-info-text">
                                <strong>Important:</strong> Please use names exactly as they appear on state-issued driver's license or non-driver ID card.
                            </div>
                        </div>
                        
                        <div class="attendee-header">
                            <div class="attendee-header-col">Names of Attendees</div>
                            <div class="attendee-header-col">Title/Position within Organization</div>
                        </div>
                        
                        <div class="attendee-fields" id="attendeeFields">
                            <!-- Attendee fields will be dynamically generated here -->
                        </div>
                        
                        <div class="add-attendee-container" id="addAttendeeContainer" style="display: none;">
                            <button type="button" class="add-attendee-btn" id="addAttendeeBtn">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                Add Another Attendee
                            </button>
                        </div>
                        
                        <!-- Additional Attendees Section -->
                        <div class="additional-attendee-section" id="additionalAttendeeSection" style="display: none;">
                            <div class="additional-attendee-header">
                                <h3 class="additional-attendee-title">Additional Attendees</h3>
                                <p class="additional-attendee-description">You've reached the maximum number of complimentary attendees. Additional attendees may be added at $300 per person.</p>
                            </div>
                            
                            <div class="attendee-fields" id="additionalAttendeeFields">
                                <!-- Additional attendee fields will be dynamically generated here -->
                            </div>
                            
                            <div class="add-attendee-container">
                                <button type="button" class="add-attendee-btn" id="addAdditionalAttendeeBtn">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                    Add Additional Attendee ($300)
                                </button>
                            </div>
                            
                            <div class="cost-summary" id="additionalCostSummary" style="display: none;">
                                <!-- Cost summary will be displayed here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="step-prev-btn" id="prevStep3">Previous</button>
                        <button type="button" class="submit-button btn-submit" id="proceedToPayment">Proceed to Payment</button>
                    </div>
                </div>
                
                <!-- Step 4: Payment -->
                <div class="form-step" id="step4" data-step="4" style="display: none;">
                    <div class="payment-section">
                        <h2 class="payment-title">Payment Information</h2>
                        
                        <!-- Invoice Summary -->
                        <div class="invoice-summary-section">
                            <h3 class="invoice-summary-title">Invoice Summary</h3>
                            <div class="invoice-summary-content">
                                <div class="invoice-row">
                                    <span class="invoice-label">Base Contribution:</span>
                                    <span class="invoice-value" id="invoiceBaseContribution">$0.00</span>
                                </div>
                                <div class="invoice-row" id="invoiceAdditionalAttendeesRow" style="display: none;">
                                    <span class="invoice-label">Additional Attendees:</span>
                                    <span class="invoice-value" id="invoiceAdditionalAttendeesCost">$0.00</span>
                                </div>
                                <div class="invoice-row invoice-total">
                                    <span class="invoice-label">Total Amount:</span>
                                    <span class="invoice-value" id="invoiceTotalAmount">$0.00</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Payment Form -->
                        <div class="payment-form-section">
                            <h3 class="payment-form-title">Card Details</h3>
                            
                            <!-- Stripe Error Display -->
                            <div id="stripeErrorBox" class="stripe-error-box" style="display: none;">
                                <div class="stripe-error-content">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span id="stripeErrorText"></span>
                                </div>
                            </div>
                            
                            <div id="paymentForm">
                                <div class="form-field">
                                    <label class="field-label">Card Details <span class="required-asterisk">*</span></label>
                                    <div id="card-element" class="stripe-card-element">
                                        <!-- Stripe Elements will create form elements here -->
                                    </div>
                                    <div id="card-errors" class="stripe-field-error" role="alert"></div>
                                </div>
                                
                                <div class="step-actions">
                                    <button type="button" class="step-prev-btn" id="prevStep4">Previous</button>
                                    <button type="button" class="submit-button btn-submit" id="submitPayment">Pay Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <p class="footer-text">Managed by</p>
                <img src="sub-log.png" alt="Guardswell Enterprises, Inc." class="footer-logo">
                <!-- <p class="footer-company">Guardswell Enterprises, Inc.</p> -->
            </div>
        </footer>
    </div>
    
    <!-- Success Modal -->
    <div id="successModal" class="success-modal" style="display: none;">
        <div class="success-modal-overlay"></div>
        <div class="success-modal-content">
            <div class="success-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="32" fill="#22c55e"/>
                    <path d="M20 32L28 40L44 24" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 class="success-title">Successfully Submitted!</h2>
            <p class="success-message" id="successMessage">Thank you for your partnership selection. Your form has been submitted successfully.</p>
            <button type="button" class="success-close-btn" id="closeSuccessModal">Close</button>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script>
        // Initialize Stripe with publishable key from PHP
        var STRIPE_PUBLISHABLE_KEY = '<?php echo isset($stripe_publishable_key) ? addslashes($stripe_publishable_key) : ""; ?>';
    </script>
    <script src="script.js"></script>
</body>
</html>
