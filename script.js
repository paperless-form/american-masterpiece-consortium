document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('partnershipForm');
    const acknowledgmentCheckbox = form.querySelector('input[name="acknowledgment"]');
    const contactFieldsSection = document.getElementById('contactFields');
    const attendeeSection = document.getElementById('attendeeSection');
    const attendeeFieldsContainer = document.getElementById('attendeeFields');
    const tierError = document.getElementById('tierError');
    const tierRadios = form.querySelectorAll('input[name="tier"]');
    
    let attendeeCounter = 1;
    let maxAttendees = 3;
    let complimentaryAttendees = 3; // Number of complimentary attendees
    let additionalAttendeesAllowed = 3; // Number of additional paid attendees allowed
    let hasConfirmedAdditionalAttendees = false; // Track if user confirmed additional attendees
    
    // Function to show error message
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Function to hide error message
    function hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Function to clear all errors
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Clear input error states
        const inputs = document.querySelectorAll('.form-input, .attendee-input');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    // Function to set input error state
    function setInputError(input, hasError) {
        if (hasError) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }
    
    // Function to create a single attendee row
    function createAttendeeRow(index) {
        const attendeeRow = document.createElement('div');
        attendeeRow.className = 'attendee-row';
        attendeeRow.setAttribute('data-attendee-index', index);
        attendeeRow.innerHTML = `
            <div class="attendee-input-group">
                <label class="attendee-input-label" for="attendeeName${index}">Name</label>
                <input type="text" id="attendeeName${index}" name="attendeeName${index}" class="attendee-input required" placeholder="Enter attendee name">
                <span class="error-message" id="attendeeName${index}Error"></span>
            </div>
            <div class="attendee-input-group">
                <label class="attendee-input-label" for="attendeeTitle${index}">Title/Position</label>
                <input type="text" id="attendeeTitle${index}" name="attendeeTitle${index}" class="attendee-input required" placeholder="Enter title/position">
                <span class="error-message" id="attendeeTitle${index}Error"></span>
            </div>
            <div class="attendee-actions">
                <button type="button" class="attendee-delete-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add delete button event listener
        const deleteBtn = attendeeRow.querySelector('.attendee-delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteAttendee(index);
        });
        
        // Add input event listeners to clear errors on input
        const nameInput = attendeeRow.querySelector(`#attendeeName${index}`);
        const titleInput = attendeeRow.querySelector(`#attendeeTitle${index}`);
        
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                hideError(`attendeeName${index}Error`);
                setInputError(this, false);
            });
        }
        
        if (titleInput) {
            titleInput.addEventListener('input', function() {
                hideError(`attendeeTitle${index}Error`);
                setInputError(this, false);
            });
        }
        
        return attendeeRow;
    }
    
    // Function to get current attendee count
    function getAttendeeCount() {
        return attendeeFieldsContainer.querySelectorAll('.attendee-row').length;
    }
    
    // Function to check if we should show additional attendees confirmation
    function checkAndShowAdditionalAttendeesConfirmation() {
        const currentCount = getAttendeeCount();
        const selectedTier = form.querySelector('input[name="tier"]:checked');
        
        if (!selectedTier || hasConfirmedAdditionalAttendees) {
            return;
        }
        
        // Check if user has reached complimentary limit
        if (currentCount === complimentaryAttendees) {
            showAdditionalAttendeesConfirmation(selectedTier.value);
        } else {
            hideAdditionalAttendeesConfirmation();
        }
    }
    
    // Function to show additional attendees confirmation UI
    function showAdditionalAttendeesConfirmation(tierValue) {
        // Remove existing confirmation if any
        hideAdditionalAttendeesConfirmation();
        
        const additionalCount = tierValue === 'tier1' ? 3 : 2;
        const confirmationCard = document.createElement('div');
        confirmationCard.className = 'additional-attendees-confirmation';
        confirmationCard.id = 'additionalAttendeesConfirmation';
        confirmationCard.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="confirmation-text">
                    <p class="confirmation-title">You've reached your complimentary attendees limit!</p>
                    <p class="confirmation-message">You can add up to ${additionalCount} more attendee${additionalCount > 1 ? 's' : ''} at $300 each.</p>
                </div>
                <label class="confirmation-checkbox-label">
                    <input type="checkbox" id="confirmAdditionalAttendees" class="confirmation-checkbox">
                    <span class="confirmation-checkbox-text">Yes, I'd like to add additional attendees</span>
                </label>
            </div>
        `;
        
        // Insert before add button container
        const addButtonContainer = attendeeFieldsContainer.querySelector('.add-attendee-container');
        if (addButtonContainer) {
            attendeeFieldsContainer.insertBefore(confirmationCard, addButtonContainer);
        } else {
            attendeeFieldsContainer.appendChild(confirmationCard);
        }
        
        // Add event listener to checkbox
        const checkbox = confirmationCard.querySelector('#confirmAdditionalAttendees');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                hasConfirmedAdditionalAttendees = true;
                maxAttendees = complimentaryAttendees + additionalAttendeesAllowed;
                updateAddButtonVisibility();
                confirmationCard.classList.add('confirmed');
            } else {
                hasConfirmedAdditionalAttendees = false;
                maxAttendees = complimentaryAttendees;
                // Remove any attendees beyond complimentary limit
                removeExcessAttendees();
                updateAddButtonVisibility();
                confirmationCard.classList.remove('confirmed');
            }
        });
    }
    
    // Function to hide additional attendees confirmation
    function hideAdditionalAttendeesConfirmation() {
        const confirmation = document.getElementById('additionalAttendeesConfirmation');
        if (confirmation) {
            confirmation.remove();
        }
    }
    
    // Function to remove attendees beyond complimentary limit
    function removeExcessAttendees() {
        const rows = attendeeFieldsContainer.querySelectorAll('.attendee-row');
        const rowsArray = Array.from(rows);
        
        // Remove attendees beyond complimentary limit
        rowsArray.slice(complimentaryAttendees).forEach(row => {
            row.remove();
        });
        
        // Reset counter if needed
        const remainingCount = getAttendeeCount();
        if (remainingCount < attendeeCounter) {
            attendeeCounter = remainingCount;
        }
        
        updateDeleteButtonsVisibility();
    }
    
    // Function to add a new attendee
    function addAttendee() {
        const currentCount = getAttendeeCount();
        if (currentCount < maxAttendees) {
            attendeeCounter++;
            // Insert before the add button container
            const addButtonContainer = attendeeFieldsContainer.querySelector('.add-attendee-container');
            const newRow = createAttendeeRow(attendeeCounter);
            if (addButtonContainer) {
                attendeeFieldsContainer.insertBefore(newRow, addButtonContainer);
            } else {
                attendeeFieldsContainer.appendChild(newRow);
            }
            updateAddButtonVisibility();
            updateDeleteButtonsVisibility();
            
            // Check if we need to show confirmation after adding
            setTimeout(() => {
                checkAndShowAdditionalAttendeesConfirmation();
            }, 100);
        }
    }
    
    // Function to delete an attendee
    function deleteAttendee(index) {
        const currentCount = getAttendeeCount();
        if (currentCount > 1) {
            const rowToDelete = attendeeFieldsContainer.querySelector(`[data-attendee-index="${index}"]`);
            if (rowToDelete) {
                rowToDelete.remove();
                const newCount = getAttendeeCount();
                
                // If we go below complimentary limit, reset confirmation
                if (newCount < complimentaryAttendees) {
                    hasConfirmedAdditionalAttendees = false;
                    maxAttendees = complimentaryAttendees;
                    const confirmationCheckbox = document.getElementById('confirmAdditionalAttendees');
                    if (confirmationCheckbox) {
                        confirmationCheckbox.checked = false;
                    }
                }
                
                updateAddButtonVisibility();
                updateDeleteButtonsVisibility();
                
                // Check if we need to show/hide confirmation after deleting
                setTimeout(() => {
                    checkAndShowAdditionalAttendeesConfirmation();
                }, 100);
            }
        }
    }
    
    // Function to update add button visibility
    function updateAddButtonVisibility() {
        const addButton = document.getElementById('addAttendeeBtn');
        if (addButton) {
            const currentCount = getAttendeeCount();
            addButton.style.display = currentCount < maxAttendees ? 'flex' : 'none';
        }
    }
    
    // Function to update delete buttons visibility
    function updateDeleteButtonsVisibility() {
        const deleteButtons = attendeeFieldsContainer.querySelectorAll('.attendee-delete-btn');
        const currentCount = getAttendeeCount();
        deleteButtons.forEach(btn => {
            btn.style.display = currentCount > 1 ? 'flex' : 'none';
        });
    }
    
    // Function to generate attendee fields based on tier
    function generateAttendeeFields(tierValue) {
        complimentaryAttendees = tierValue === 'tier1' ? 3 : 2;
        additionalAttendeesAllowed = tierValue === 'tier1' ? 3 : 2;
        maxAttendees = complimentaryAttendees; // Start with complimentary only
        hasConfirmedAdditionalAttendees = false; // Reset confirmation
        
        attendeeFieldsContainer.innerHTML = '';
        attendeeCounter = 1;
        
        // Start with one attendee by default
        const firstRow = createAttendeeRow(attendeeCounter);
        attendeeFieldsContainer.appendChild(firstRow);
        
        // Add the "Add Attendee" button container
        const addButtonContainer = document.createElement('div');
        addButtonContainer.className = 'add-attendee-container';
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.id = 'addAttendeeBtn';
        addButton.className = 'add-attendee-btn';
        addButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Add Attendee</span>
        `;
        addButton.addEventListener('click', addAttendee);
        addButtonContainer.appendChild(addButton);
        attendeeFieldsContainer.appendChild(addButtonContainer);
        
        updateAddButtonVisibility();
        updateDeleteButtonsVisibility();
        
        // Hide any existing confirmation
        hideAdditionalAttendeesConfirmation();
    }
    
    // Function to setup contact field event listeners
    function setupContactFieldListeners() {
        const institutionNameInput = document.getElementById('institutionName');
        const contactNameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (institutionNameInput) {
            institutionNameInput.addEventListener('input', function() {
                hideError('institutionNameError');
                setInputError(this, false);
            });
        }
        
        if (contactNameInput) {
            contactNameInput.addEventListener('input', function() {
                hideError('contactNameError');
                setInputError(this, false);
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                hideError('emailError');
                setInputError(this, false);
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                hideError('phoneError');
                setInputError(this, false);
            });
        }
    }
    
    // Function to check tier selection and show/hide fields
    function checkTierAndShowFields() {
        const selectedTier = form.querySelector('input[name="tier"]:checked');
        const isAcknowledged = acknowledgmentCheckbox.checked;
        
        // Hide error message initially
        tierError.style.display = 'none';
        
        // If checkbox is checked
        if (isAcknowledged) {
            // If tier is selected, show contact fields and attendee section
            if (selectedTier) {
                contactFieldsSection.style.display = 'flex';
                attendeeSection.style.display = 'flex';
                tierError.style.display = 'none';
                
                // Setup contact field listeners
                setupContactFieldListeners();
                
                // Generate attendee fields based on selected tier
                generateAttendeeFields(selectedTier.value);
            } else {
                // If no tier selected, show error message
                contactFieldsSection.style.display = 'none';
                attendeeSection.style.display = 'none';
                tierError.style.display = 'block';
            }
        } else {
            // If checkbox is unchecked, hide everything
            contactFieldsSection.style.display = 'none';
            attendeeSection.style.display = 'none';
            tierError.style.display = 'none';
        }
    }
    
    // Handle acknowledgment checkbox click
    acknowledgmentCheckbox.addEventListener('change', function() {
        hideError('acknowledgmentError');
        checkTierAndShowFields();
    });
    
    // Handle tier selection change
    tierRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Clear tier error
            tierError.style.display = 'none';
            
            // Remove any previous selection highlights
            tierRadios.forEach(r => {
                const content = r.nextElementSibling;
                if (content) {
                    content.classList.remove('selected');
                }
            });
            
            // Add highlight to selected tier
            if (this.checked) {
                const content = this.nextElementSibling;
                if (content) {
                    content.classList.add('selected');
                }
            }
            
            // Check if checkbox is checked and update fields visibility
            if (acknowledgmentCheckbox.checked) {
                checkTierAndShowFields();
            }
        });
    });
    
    // Handle form submission
    function validate() {
        var valid = true;
        $('input, select').removeClass('danger')
        $(".alert-danger").remove();
        $(".required:visible").each(function () {
            if ($(this).val() == "" || $(this).val() == null) {
                $(this).closest("div").append('<div class="alert-danger ps-1">This field is required</div>');
                $(this).addClass('danger')
                valid = false;
            }
        });
        $(".email:visible").each(function () {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
            email_check = emailReg.test($(this).val())
            if (email_check == false) {
                $(this).closest("div").append('<div class="alert-danger ps-1">Invalid email format</div>');
                $(this).addClass('danger')
                valid = false;
            }
        })
    
        var select
        $(".select:visible").each(function () {
            select = $(this);
            if (select.hasClass('required') && (select.find('option:selected').val() == "" || select.find('option:selected').val() == null)) {
                $(this).closest("div").find('.alert-danger').remove()
                $(this).closest("div").append('<div class="alert-danger ps-1">This field is required</div>');
                $(this).closest('div').find('.select2-selection').addClass('danger')
                valid = false;
            }
        });

        if (!valid) {
            $("html, body").animate(
                {
                    scrollTop: $(".alert-danger:first").offset().top - 80,
                },
                100
            );
        }

        return valid;
    }    

    // Function to show success modal
    function showSuccessModal() {
        const selectedTier = form.querySelector('input[name="tier"]:checked');
        const successModal = document.getElementById('successModal');
        const successMessage = document.getElementById('successMessage');
        
        if (selectedTier) {
            const tierName = selectedTier.value === 'tier1' ? 'Tier 1 — National Stewardship Partner' : 'Tier 2 — Supporting Cultural Partner';
            const attendeeCount = getAttendeeCount();
            const complimentaryCount = selectedTier.value === 'tier1' ? 3 : 2;
            const additionalCount = attendeeCount > complimentaryCount ? attendeeCount - complimentaryCount : 0;
            const additionalCost = additionalCount * 300;
            
            let message = `Thank you for selecting ${tierName}. Your form has been submitted successfully.`;
            
            if (additionalCount > 0) {
                message += `\n\nYou have ${complimentaryCount} complimentary attendee${complimentaryCount > 1 ? 's' : ''} and ${additionalCount} additional attendee${additionalCount > 1 ? 's' : ''} at $300 each (Total: $${additionalCost.toLocaleString()}).`;
            } else {
                message += `\n\nYou have ${attendeeCount} complimentary attendee${attendeeCount > 1 ? 's' : ''}.`;
            }
            
            successMessage.textContent = message;
        } else {
            successMessage.textContent = 'Thank you for your partnership selection. Your form has been submitted successfully.';
        }
        
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Function to hide success modal
    function hideSuccessModal() {
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Redirect to same location (reload page)
        window.location.href = window.location.href;
    }
    
    // Setup success modal event listeners
    const modalElement = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeSuccessModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSuccessModal);
    }
    
    if (modalElement) {
        modalElement.addEventListener('click', function(e) {
            if (e.target.classList.contains('success-modal-overlay')) {
                hideSuccessModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalElement && modalElement.style.display === 'flex') {
            hideSuccessModal();
        }
    });
    
    $(document).on('click', '.submit-button', function(e) {
        e.preventDefault();
        console.log('Submit button clicked');
        
        // Clear all errors first
        clearAllErrors();
        
        // Validate tier selection
        const selectedTier = form.querySelector('input[name="tier"]:checked');
        if (!selectedTier) {
            tierError.style.display = 'block';
            $("html, body").animate({
                scrollTop: $("#tierError").offset().top - 80,
            }, 100);
            return;
        }
        
        // Validate acknowledgment
        if (!acknowledgmentCheckbox.checked) {
            showError('acknowledgmentError', 'Please acknowledge and understand the above distinctions.');
            $("html, body").animate({
                scrollTop: $("#acknowledgmentError").offset().top - 80,
            }, 100);
            return;
        }
        
        // Validate form fields
        if(validate()) {
            console.log('Form is valid');
            
            // Disable submit button
            const submitButton = form.querySelector('.submit-button');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
            }
            
            // Simulate form processing (replace with actual submission logic)
            setTimeout(() => {
                showSuccessModal();
                
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                }
            }, 1000);
        }
    });
});

