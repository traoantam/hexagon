/**
 * Contact Form Handler with Firebase
 * Handles form submission and sends data to Firebase Cloud Function
 */

(function () {
  'use strict';

  // Get your Firebase Cloud Function URL
  // Replace this with your actual Firebase Function URL after deployment
  const FIREBASE_FUNCTION_URL =
    'https://hexagon-contact.cloudfunctions.net/sendContactEmail';

  /**
   * Initialize contact form handler
   */
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) {
      console.warn('Contact form not found');
      return;
    }

    contactForm.addEventListener('submit', handleFormSubmit);
  }

  /**
   * Handle form submission
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Get form values
    const formValues = {
      name: formData.get('name') || form.querySelector('[name="name"]').value,
      email:
        formData.get('email') || form.querySelector('[name="email"]').value,
      subject:
        formData.get('subject') || form.querySelector('[name="subject"]').value,
      message:
        formData.get('message') || form.querySelector('[name="message"]').value,
    };

    // Validate form
    if (!validateForm(formValues)) {
      return;
    }

    // Disable submit button and show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    // Hide previous messages
    hideMessage();

    try {
      // Send data to Firebase Cloud Function
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      // Check if response is ok before trying to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        showMessage(
          'error',
          `Server error (${response.status}). Please try again later.`
        );
        return;
      }

      if (response.ok && data.success) {
        // Success
        showMessage(
          'success',
          data.message ||
            'Message sent successfully! We will get back to you soon.'
        );
        form.reset();
      } else {
        // Error from server
        showMessage(
          'error',
          data.message ||
            data.error ||
            `Failed to send message (${response.status}). Please try again.`
        );
      }
    } catch (error) {
      // Network or other error
      console.error('Error:', error);

      // Provide more specific error messages
      let errorMessage =
        'Network error. Please check your connection and try again.';

      if (
        error.name === 'TypeError' &&
        error.message.includes('Failed to fetch')
      ) {
        errorMessage =
          'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      showMessage('error', errorMessage);
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  }

  /**
   * Validate form data
   */
  function validateForm(values) {
    const errors = [];

    if (!values.name || values.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!values.email || values.email.trim() === '') {
      errors.push('Email is required');
    } else if (!isValidEmail(values.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!values.subject || values.subject.trim() === '') {
      errors.push('Subject is required');
    }

    if (!values.message || values.message.trim() === '') {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      showMessage('error', errors.join('<br>'));
      return false;
    }

    return true;
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show message to user
   */
  function showMessage(type, message) {
    // Remove existing message if any
    hideMessage();

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'contact-form-message';
    messageDiv.className = `alert alert-${
      type === 'success' ? 'success' : 'danger'
    }`;
    messageDiv.style.cssText = `
      margin-top: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      ${
        type === 'success'
          ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
          : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
      }
    `;
    messageDiv.innerHTML = message;

    // Insert message after form
    const form = document.getElementById('contact-form');
    if (form) {
      form.parentNode.insertBefore(messageDiv, form.nextSibling);

      // Scroll to message
      messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Hide message
   */
  function hideMessage() {
    const existingMessage = document.getElementById('contact-form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
