$(document).ready(function() {
    var d = new Date();
    var today = addZero(d.getDate()) + '/' + addZero(d.getMonth() + 1) + '/' + d.getFullYear()
     $('.today').val(today)
    
    var ref = addZero(d.getDate()) + '' + addZero(d.getMonth() + 1) + '' + d.getFullYear().toString().substr(-2) + '' + addZero(d.getHours()) + '' + addZero(d.getMinutes())
    $('.order_ref').val(ref);

    let currentStep = 1;
    const totalSteps = 3;

    // Initialize stepper
    function updateStepper() {
        $('.stepper-step').each(function() {
            const stepNum = parseInt($(this).data('step'));
            $(this).removeClass('active completed');
            
            if (stepNum < currentStep) {
                $(this).addClass('completed');
            } else if (stepNum === currentStep) {
                $(this).addClass('active');
            }
        });
        
        // Update stepper lines
        $('.stepper-line').each(function(index) {
            if (index + 1 < currentStep) {
                $(this).addClass('completed');
            } else {
                $(this).removeClass('completed');
            }
        });
    }

    // Show step
    function showStep(step) {
        $('.form-step').removeClass('active').hide();
        $(`#step${step}`).addClass('active').show();
        currentStep = step;
        updateStepper();
        
        // Show add attendee button container for step 3
        if (step === 3) {
            $('#addAttendeeContainer').show();
            updateAdditionalAttendeeSection();
        } else {
            $('#addAttendeeContainer').hide();
            $('#additionalAttendeeSection').hide();
        }
        
        // Smooth scroll to stepper container
        $('html, body').animate({
            scrollTop: $('.stepper-container').offset().top - 20
        }, 600);
    }

    // Validate step 1
    function validateStep1() {
        const tierSelected = $('input[name="tier"]:checked').length > 0;
        const acknowledgmentChecked = $('.acknowledgment-checkbox').is(':checked');
        const selectedTier = $('input[name="tier"]:checked').val();
        
        // Clear previous errors
        $('#tierError').hide();
        $('#acknowledgmentError').text('').hide();
        $('#contributionAmountError').text('').hide();
        $('#contributionAmount').removeClass('error');
        
        let isValid = true;
        let firstErrorElement = null;
        
        if (!tierSelected) {
            $('#tierError').show();
            if (!firstErrorElement) {
                firstErrorElement = $('.form-section').first();
            }
            isValid = false;
        }
        
        // Validate Tier 3 contribution amount
        if (selectedTier === 'tier3') {
            const contributionAmount = parseFloat($('#contributionAmount').val().replace(/[^0-9.]/g, '')) || 0;
            if (!contributionAmount || contributionAmount < 300) {
                $('#contributionAmount').addClass('error');
                $('#contributionAmountError').text('Minimum contribution amount is $300.').show();
                if (!firstErrorElement) {
                    firstErrorElement = $('#tier3ContributionSection');
                }
                isValid = false;
            }
        }
        
        if (!acknowledgmentChecked) {
            $('#acknowledgmentError').text('Please acknowledge the above distinctions.').show();
            if (!firstErrorElement) {
                firstErrorElement = $('.acknowledgment-section');
            }
            isValid = false;
        }
        
        return { isValid: isValid, firstError: firstErrorElement };
    }

    // Next Step 1 Button
    $('#nextStep1').on('click', function() {
        const validation = validateStep1();
        if (validation.isValid) {
            showStep(2);
        } else {
            // Scroll to first error
            if (validation.firstError && validation.firstError.length) {
                $('html, body').animate({
                    scrollTop: validation.firstError.offset().top - 100
                }, 600);
            } else {
                $('html, body').animate({
                    scrollTop: $('.stepper-container').offset().top - 20
                }, 600);
            }
        }
    });

    // Previous Step 2 Button
    $('#prevStep2').on('click', function() {
        showStep(1);
    });

    // Next Step 2 Button
    $('#nextStep2').on('click', function() {
        // Basic validation for contact fields
        let isValid = true;
        let firstErrorField = null;
        const requiredFields = ['institutionName', 'contactName', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
        
        requiredFields.forEach(function(fieldId) {
            const field = $(`#${fieldId}`);
            const errorElement = $(`#${fieldId}Error`);
            
            if (!field.val().trim()) {
                field.addClass('error');
                errorElement.text('This field is required.').show();
                if (!firstErrorField) {
                    firstErrorField = field;
                }
                isValid = false;
            } else {
                field.removeClass('error');
                errorElement.hide();
                
                // Email validation
                if (fieldId === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.val().trim())) {
                        field.addClass('error');
                        errorElement.text('Please enter a valid email address.').show();
                        if (!firstErrorField) {
                            firstErrorField = field;
                        }
                        isValid = false;
                    }
                }
                
                // Zip Code validation (basic - should be 5 digits or 5+4 format)
                if (fieldId === 'zipCode') {
                    const zipRegex = /^\d{5}(-\d{4})?$/;
                    if (!zipRegex.test(field.val().trim())) {
                        field.addClass('error');
                        errorElement.text('Please enter a valid zip code (e.g., 12345 or 12345-6789).').show();
                        if (!firstErrorField) {
                            firstErrorField = field;
                        }
                        isValid = false;
                    }
                }
            }
        });
        
        if (isValid) {
            showStep(3);
            // Initialize attendee fields if not already done
            initializeAttendeeFields();
        } else {
            // Scroll to first error field
            if (firstErrorField && firstErrorField.length) {
                $('html, body').animate({
                    scrollTop: firstErrorField.offset().top - 100
                }, 600);
                // Focus on the field
                setTimeout(function() {
                    firstErrorField.focus();
                }, 650);
            } else {
                $('html, body').animate({
                    scrollTop: $('.stepper-container').offset().top - 20
                }, 600);
            }
        }
    });

    // Previous Step 3 Button
    $('#prevStep3').on('click', function() {
        showStep(2);
    });

    // Real-time validation for step 1
    $('input[name="tier"]').on('change', function() {
        if ($(this).is(':checked')) {
            $('#tierError').hide();
            const selectedTier = $(this).val();
            
            // Show/hide Tier 3 contribution amount field
            if (selectedTier === 'tier3') {
                $('#tier3ContributionSection').slideDown(300);
            } else {
                $('#tier3ContributionSection').slideUp(300);
                $('#contributionAmount').val('').removeClass('error');
                $('#contributionAmountError').text('').hide();
            }
            
            // Update total amount when tier changes
            calculateTotalAmount();
        }
    });

    // Update total amount when contribution amount changes (Tier 3)
    $(document).on('input', '#contributionAmount', function() {
        calculateTotalAmount();
    });

    $('.acknowledgment-checkbox').on('change', function() {
        if ($(this).is(':checked')) {
            $('#acknowledgmentError').text('').hide();
        }
    });

    // Get max attendees based on tier
    function getMaxAttendees() {
        const selectedTier = $('input[name="tier"]:checked').val();
        if (selectedTier === 'tier1') return 3;
        if (selectedTier === 'tier2') return 2;
        if (selectedTier === 'tier3') return 1;
        return 0;
    }

    // Get max additional attendees based on tier
    function getMaxAdditionalAttendees() {
        const selectedTier = $('input[name="tier"]:checked').val();
        if (selectedTier === 'tier1') return 3;
        if (selectedTier === 'tier2') return 2;
        if (selectedTier === 'tier3') return 1; // Only one additional person allowed for Tier 3
        return 0;
    }

    // Get current regular attendee count
    function getCurrentAttendeeCount() {
        return $('.attendee-row:not(.additional-attendee)').length;
    }

    // Get current additional attendee count
    function getCurrentAdditionalAttendeeCount() {
        return $('.attendee-row.additional-attendee').length;
    }

    // Get total attendee count
    function getTotalAttendeeCount() {
        return $('.attendee-row').length;
    }

    // Create attendee row HTML
    function createAttendeeRow(attendeeNumber, isAdditional = false) {
        const additionalClass = isAdditional ? 'additional-attendee' : '';
        const additionalBadge = isAdditional ? '<span class="additional-badge">Additional ($300)</span>' : '';
        return `
            <div class="attendee-row ${additionalClass}" data-attendee="${attendeeNumber}" data-additional="${isAdditional}">
                <div class="attendee-number">
                    ${isAdditional ? `Additional Attendee ${attendeeNumber - getMaxAttendees()}` : `Attendee ${attendeeNumber}`}
                    ${additionalBadge}
                </div>
                <div class="attendee-input-group">
                    <label class="attendee-input-label">Name</label>
                    <input type="text" class="attendee-input required" name="attendeeName" placeholder="Enter attendee name">
                    <span class="error-message" id="attendee${attendeeNumber}NameError"></span>
                </div>
                <div class="attendee-input-group">
                    <label class="attendee-input-label">Title/Position</label>
                    <input type="text" class="attendee-input required" name="attendeeTitle" placeholder="Enter title/position">
                    <span class="error-message" id="attendee${attendeeNumber}TitleError"></span>
                </div>
                ${(attendeeNumber > 1 || isAdditional) ? `
                <div class="attendee-actions">
                    <button type="button" class="attendee-delete-btn" data-attendee="${attendeeNumber}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Initialize attendee fields based on selected tier (start with 1)
    function initializeAttendeeFields() {
        const attendeeFields = $('#attendeeFields');
        const additionalAttendeeFields = $('#additionalAttendeeFields');
        
        // Clear existing attendees
        attendeeFields.empty();
        additionalAttendeeFields.empty();
        
        // Start with 1 attendee
        attendeeFields.append(createAttendeeRow(1, false));
        updateAddAttendeeButton();
        updateAdditionalAttendeeSection();
        updateCostSummary();
        $('#addAttendeeContainer').show();
    }

    // Add new regular attendee
    function addAttendee() {
        const currentCount = getCurrentAttendeeCount();
        const maxAttendees = getMaxAttendees();
        
        if (currentCount < maxAttendees) {
            const newAttendeeNumber = currentCount + 1;
            $('#attendeeFields').append(createAttendeeRow(newAttendeeNumber, false));
            updateAddAttendeeButton();
            updateAdditionalAttendeeSection();
            calculateTotalAmount();
            
            // Scroll to new attendee
            $('html, body').animate({
                scrollTop: $(`.attendee-row[data-attendee="${newAttendeeNumber}"]`).offset().top - 100
            }, 400);
        }
    }

    // Add additional attendee
    function addAdditionalAttendee() {
        const currentAdditionalCount = getCurrentAdditionalAttendeeCount();
        const maxAdditional = getMaxAdditionalAttendees();
        
        if (currentAdditionalCount < maxAdditional) {
            const totalCount = getTotalAttendeeCount();
            const newAttendeeNumber = totalCount + 1;
            $('#additionalAttendeeFields').append(createAttendeeRow(newAttendeeNumber, true));
            updateAdditionalAttendeeButton();
            updateCostSummary();
            
            // Scroll to new attendee
            $('html, body').animate({
                scrollTop: $(`.attendee-row[data-attendee="${newAttendeeNumber}"]`).offset().top - 100
            }, 400);
        }
    }

    // Remove attendee
    function removeAttendee(attendeeNumber) {
        const attendeeRow = $(`.attendee-row[data-attendee="${attendeeNumber}"]`);
        const isAdditional = attendeeRow.hasClass('additional-attendee');
        
        attendeeRow.remove();
        
        if (isAdditional) {
            // Renumber additional attendees
            renumberAdditionalAttendees();
            updateAdditionalAttendeeButton();
            updateCostSummary();
        } else {
            // Renumber regular attendees
            renumberAttendees();
            updateAddAttendeeButton();
            updateAdditionalAttendeeSection();
        }
        
        // Update total amount when attendee is removed
        calculateTotalAmount();
    }

    // Renumber regular attendees after deletion
    function renumberAttendees() {
        $('.attendee-row:not(.additional-attendee)').each(function(index) {
            const newNumber = index + 1;
            $(this).attr('data-attendee', newNumber);
            $(this).find('.attendee-number').html(`Attendee ${newNumber}`);
            
            // Update input names and IDs
            const nameInput = $(this).find('input[name^="attendee"][name$="Name"]');
            const titleInput = $(this).find('input[name^="attendee"][name$="Title"]');
            const nameError = $(this).find('span[id^="attendee"][id$="NameError"]');
            const titleError = $(this).find('span[id^="attendee"][id$="TitleError"]');
            
            nameInput.attr('name', `attendee${newNumber}Name`).attr('id', `attendee${newNumber}Name`);
            titleInput.attr('name', `attendee${newNumber}Title`).attr('id', `attendee${newNumber}Title`);
            nameError.attr('id', `attendee${newNumber}NameError`);
            titleError.attr('id', `attendee${newNumber}TitleError`);
            
            // Handle delete button
            const deleteBtnContainer = $(this).find('.attendee-actions');
            if (newNumber === 1) {
                // Remove delete button from first attendee
                deleteBtnContainer.remove();
            } else {
                // Update or add delete button for other attendees
                if (deleteBtnContainer.length) {
                    deleteBtnContainer.find('.attendee-delete-btn').attr('data-attendee', newNumber);
                } else {
                    $(this).find('.attendee-input-group').last().after(`
                        <div class="attendee-actions">
                            <button type="button" class="attendee-delete-btn" data-attendee="${newNumber}">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    `);
                }
            }
        });
    }

    // Update add attendee button visibility
    function updateAddAttendeeButton() {
        const currentCount = getCurrentAttendeeCount();
        const maxAttendees = getMaxAttendees();
        const addBtn = $('#addAttendeeBtn');
        
        if (currentCount >= maxAttendees) {
            addBtn.hide();
        } else {
            addBtn.show();
        }
    }

    // Update additional attendee section visibility
    function updateAdditionalAttendeeSection() {
        const currentCount = getCurrentAttendeeCount();
        const maxAttendees = getMaxAttendees();
        const additionalSection = $('#additionalAttendeeSection');
        
        if (currentCount >= maxAttendees) {
            additionalSection.slideDown(300);
        } else {
            // Clear additional attendees if regular slots are available
            const additionalCount = getCurrentAdditionalAttendeeCount();
            if (additionalCount > 0 && currentCount < maxAttendees) {
                $('#additionalAttendeeFields').empty();
                updateCostSummary();
            }
            additionalSection.slideUp(300);
        }
    }

    // Update additional attendee button visibility
    function updateAdditionalAttendeeButton() {
        const currentAdditionalCount = getCurrentAdditionalAttendeeCount();
        const maxAdditional = getMaxAdditionalAttendees();
        const addBtn = $('#addAdditionalAttendeeBtn');
        
        if (currentAdditionalCount >= maxAdditional) {
            addBtn.hide();
        } else {
            addBtn.show();
        }
    }

    // Update cost summary
    function updateCostSummary() {
        const additionalCount = getCurrentAdditionalAttendeeCount();
        const additionalCost = additionalCount * 300;
        const costSummary = $('#additionalCostSummary');
        
        if (additionalCount > 0) {
            costSummary.html(`
                <div class="cost-summary-content">
                    <div class="cost-summary-row">
                        <span class="cost-label">Additional Attendees (${additionalCount} × $300):</span>
                        <span class="cost-value">$${additionalCost.toLocaleString()}</span>
                    </div>
                </div>
            `).slideDown(300);
        } else {
            costSummary.slideUp(300);
        }
        
        // Update total amount
        calculateTotalAmount();
    }

    // Calculate total amount
    function calculateTotalAmount() {
        const selectedTier = $('input[name="tier"]:checked').val();
        let baseAmount = 0;
        
        // Get base contribution amount
        if (selectedTier === 'tier1') {
            baseAmount = 3000;
        } else if (selectedTier === 'tier2') {
            baseAmount = 1500;
        } else if (selectedTier === 'tier3') {
            const contributionAmount = $('#contributionAmount').val();
            baseAmount = contributionAmount ? parseFloat(contributionAmount.replace(/[^0-9.]/g, '')) || 0 : 0;
            if (baseAmount < 300) baseAmount = 0; // Not valid if less than minimum
        }
        
        // Add additional attendees cost
        const additionalCount = getCurrentAdditionalAttendeeCount();
        const additionalCost = additionalCount * 300;
        
        // Calculate total
        const totalAmount = baseAmount + additionalCost;
        
        // Update hidden field
        $('#totalAmount').val(totalAmount.toFixed(2));
        
        return totalAmount;
    }

    // Renumber additional attendees
    function renumberAdditionalAttendees() {
        const maxRegular = getMaxAttendees();
        let additionalIndex = 1;
        
        $('.attendee-row.additional-attendee').each(function() {
            const newAttendeeNumber = maxRegular + additionalIndex;
            $(this).attr('data-attendee', newAttendeeNumber);
            $(this).find('.attendee-number').html(`Additional Attendee ${additionalIndex}<span class="additional-badge">Additional ($300)</span>`);
            
            // Update input names and IDs
            const nameInput = $(this).find('input[name^="attendee"][name$="Name"]');
            const titleInput = $(this).find('input[name^="attendee"][name$="Title"]');
            const nameError = $(this).find('span[id^="attendee"][id$="NameError"]');
            const titleError = $(this).find('span[id^="attendee"][id$="TitleError"]');
            
            nameInput.attr('name', `attendee${newAttendeeNumber}Name`).attr('id', `attendee${newAttendeeNumber}Name`);
            titleInput.attr('name', `attendee${newAttendeeNumber}Title`).attr('id', `attendee${newAttendeeNumber}Title`);
            nameError.attr('id', `attendee${newAttendeeNumber}NameError`);
            titleError.attr('id', `attendee${newAttendeeNumber}TitleError`);
            
            // Update delete button
            $(this).find('.attendee-delete-btn').attr('data-attendee', newAttendeeNumber);
            
            additionalIndex++;
        });
    }

    // Add attendee button click handler
    $(document).on('click', '#addAttendeeBtn', function() {
        addAttendee();
    });

    // Add additional attendee button click handler
    $(document).on('click', '#addAdditionalAttendeeBtn', function() {
        addAdditionalAttendee();
    });

    // Delete attendee button click handler
    $(document).on('click', '.attendee-delete-btn', function() {
        const attendeeNumber = $(this).data('attendee');
        removeAttendee(attendeeNumber);
    });

    // Form submission
    $(document).on('click', '.btn-submit', function(e) {
        e.preventDefault();
        
        // Validate attendee fields - require at least 1 complete attendee
        let isValid = true;
        let firstErrorField = null;
        let hasAtLeastOneComplete = false;
        
        // First, clear all errors
        $('.attendee-input.required').removeClass('error');
        $('.attendee-input.required').each(function() {
            const fieldName = $(this).attr('name');
            $(`#${fieldName}Error`).hide();
        });
        
        // Validate each attendee row
        $('.attendee-row').each(function() {
            const attendeeNumber = $(this).data('attendee') || ($(this).index() + 1);
            
            // Try both naming conventions
            let nameInput = $(this).find(`input[name="attendee${attendeeNumber}Name"]`);
            let titleInput = $(this).find(`input[name="attendee${attendeeNumber}Title"]`);
            
            // Fallback to generic names if not found
            if (nameInput.length === 0) {
                nameInput = $(this).find('input[name="attendeeName"]').first();
            }
            if (titleInput.length === 0) {
                titleInput = $(this).find('input[name="attendeeTitle"]').first();
            }
            
            const nameValue = nameInput.length > 0 ? nameInput.val().trim() : '';
            const titleValue = titleInput.length > 0 ? titleInput.val().trim() : '';
            
            // Check if this attendee is complete
            if (nameValue && titleValue) {
                hasAtLeastOneComplete = true;
            }
            
            // If either field has a value, both are required
            if (nameValue || titleValue) {
                if (!nameValue) {
                    nameInput.addClass('error');
                    const nameErrorId = nameInput.closest('.attendee-row').find('span[id*="NameError"]').attr('id');
                    if (nameErrorId) {
                        $(`#${nameErrorId}`).text('Name is required.').show();
                    }
                    if (!firstErrorField) {
                        firstErrorField = nameInput;
                    }
                    isValid = false;
                }
                if (!titleValue) {
                    titleInput.addClass('error');
                    const titleErrorId = titleInput.closest('.attendee-row').find('span[id*="TitleError"]').attr('id');
                    if (titleErrorId) {
                        $(`#${titleErrorId}`).text('Title/Position is required.').show();
                    }
                    if (!firstErrorField) {
                        firstErrorField = titleInput;
                    }
                    isValid = false;
                }
            }
        });
        
        // Check if at least one complete attendee exists
        if (!hasAtLeastOneComplete) {
            isValid = false;
            const firstRow = $('.attendee-row').first();
            let firstAttendeeName = firstRow.find('input[name="attendee1Name"]');
            let firstAttendeeTitle = firstRow.find('input[name="attendee1Title"]');
            
            // Fallback to generic names
            if (firstAttendeeName.length === 0) {
                firstAttendeeName = firstRow.find('input[name="attendeeName"]').first();
            }
            if (firstAttendeeTitle.length === 0) {
                firstAttendeeTitle = firstRow.find('input[name="attendeeTitle"]').first();
            }
            
            if (firstAttendeeName.length > 0) firstAttendeeName.addClass('error');
            if (firstAttendeeTitle.length > 0) firstAttendeeTitle.addClass('error');
            
            const firstErrorId = firstAttendeeName.attr('id') || 'attendee1NameError';
            $(`#${firstErrorId}`).text('At least one attendee is required.').show();
            
            if (!firstErrorField && firstAttendeeName.length > 0) {
                firstErrorField = firstAttendeeName;
            }
        }
        
        if (!isValid) {
            // Scroll to first error field
            if (firstErrorField && firstErrorField.length) {
                $('html, body').animate({
                    scrollTop: firstErrorField.offset().top - 100
                }, 600);
                // Focus on the field
                setTimeout(function() {
                    firstErrorField.focus();
                }, 650);
            } else {
                $('html, body').animate({
                    scrollTop: $('.stepper-container').offset().top - 20
                }, 600);
            }
            return;
        }
        
        // Prepare form data for Google Sheets
        submitToGoogleSheets();
    });

    // Function to collect and submit form data to Google Sheets
    function submitToGoogleSheets() {
        const $submitBtn = $('.btn-submit');
        const originalText = $submitBtn.text();
        
        // Disable submit button
        $submitBtn.attr('disabled', 'disabled').text('Please wait...');
        
        // Collect all form data
        const formData = $('#partnershipForm').serialize();
        
        // Get Google Sheets URL
        const url_gsheet = $('#partnershipForm').attr('action');
        
        // Add timestamp
        const time = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        const date = new Date().toLocaleDateString('en-US');
        formData.time = time;
        formData.date = date;
        
        // Submit to Google Sheets
        $.ajax({
            type: "POST",
            url: url_gsheet,
            data: formData,
            dataType: "json",
            success: function (response) {
                if (response.result == "success") {
                    // Show success modal
                    const selectedTier = $('input[name="tier"]:checked').val();
                    let tierName = '';
                    let contribution = '';
                    
                    if (selectedTier === 'tier1') {
                        tierName = 'Tier 1 — National Stewardship Partner';
                        contribution = '$3,000';
                    } else if (selectedTier === 'tier2') {
                        tierName = 'Tier 2 — Supporting Cultural Partner';
                        contribution = '$1,500';
                    } else if (selectedTier === 'tier3') {
                        tierName = 'Tier 3 — Unveiling Supporter';
                        const contributionAmount = $('#contributionAmount').val();
                        contribution = contributionAmount ? `$${parseFloat(contributionAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$300';
                    }
                    
                    $('#successMessage').text(`Thank you for selecting ${tierName} with a contribution of ${contribution}. Your form has been submitted successfully.`);
                    $('#successModal').addClass('show').css('display', 'flex').hide().fadeIn(300);
                    
                    // Auto reload after 3 seconds
                    setTimeout(function() {
                        window.location = window.location.href;
                    }, 3000);
                } else {
                    // Show error
                    $submitBtn.removeAttr('disabled').text(originalText);
                    alert('Error: ' + (response.error || 'Something went wrong. Please try again.'));
                }
            },
            error: function (xhr, status, error) {
                // Show error
                $submitBtn.removeAttr('disabled').text(originalText);
                alert('Error: Something went wrong. Please try again.');
                console.error('Submission error:', error);
            }
        });
    }

    // Function to collect all form data
    function collectFormData() {
        const data = {};
        
        // Tier selection
        const selectedTier = $('input[name="tier"]:checked').val();
        data.tier = selectedTier || '';
        
        // Contribution amount (for Tier 3)
        if (selectedTier === 'tier3') {
            data.contributionAmount = $('#contributionAmount').val() || '';
        } else {
            data.contributionAmount = selectedTier === 'tier1' ? '3000' : (selectedTier === 'tier2' ? '1500' : '');
        }
        
        // Contact information
        data.institutionName = $('#institutionName').val() || '';
        data.contactName = $('#contactName').val() || '';
        data.email = $('#email').val() || '';
        data.phone = $('#phone').val() || '';
        
        // Address information
        data.street = $('#street').val() || '';
        data.city = $('#city').val() || '';
        data.state = $('#state').val() || '';
        data.zipCode = $('#zipCode').val() || '';
        
        // Collect attendees
        const attendees = [];
        $('.attendee-row').each(function(index) {
            const attendeeNumber = $(this).data('attendee') || (index + 1);
            const isAdditional = $(this).hasClass('additional-attendee');
            
            // Try both naming conventions
            let nameInput = $(this).find('input[name="attendee' + attendeeNumber + 'Name"]');
            let titleInput = $(this).find('input[name="attendee' + attendeeNumber + 'Title"]');
            
            // Fallback to generic names if not found
            if (nameInput.length === 0) {
                nameInput = $(this).find('input[name="attendeeName"]').first();
            }
            if (titleInput.length === 0) {
                titleInput = $(this).find('input[name="attendeeTitle"]').first();
            }
            
            const name = nameInput.val() ? nameInput.val().trim() : '';
            const title = titleInput.val() ? titleInput.val().trim() : '';
            
            if (name || title) {
                attendees.push({
                    number: attendeeNumber,
                    name: name,
                    title: title,
                    isAdditional: isAdditional
                });
            }
        });
        
        // Convert attendees to string format for Google Sheets
        data.attendees = JSON.stringify(attendees);
        data.attendeeCount = attendees.length;
        data.additionalAttendeeCount = attendees.filter(a => a.isAdditional).length;
        
        return data;
    }

    // Close success modal
    $('#closeSuccessModal').on('click', function() {
        $('#successModal').fadeOut(300);
        window.location = window.location.href;
    });

    // Close modal on overlay click
    $('.success-modal-overlay').on('click', function() {
        $('#successModal').fadeOut(300);
        window.location = window.location.href;
    });

    // Initialize
    updateStepper();
    calculateTotalAmount(); // Initialize total amount
});

$(document).on('input', '.number', function (e) {
    this.value = this.value.replace(/[^0.00-9.99]/g, '').replace(/(\..*)\./g, '$1').replace(new RegExp("(^[\\d]{50})[\\d]", "g"), '$1');
});

function addZero(val) {
    return val < 10 ? ('0' + val) : val;
}