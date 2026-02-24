import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import hubSpotStyles from './hubSpotNewAdoptersForm.module.scss';

export const HubSpotNewAdoptersForm = () => {
  const [isClosed, setClosed] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: '21894833',
          formId: '9a5aa2af-87f3-4a44-819f-88ee243bb61e',
          target: `.${hubSpotStyles.hubSpotNewAdopterFormContent}`,
          pageId: '79735607665',
          onFormReady: function($form) {
            const firstNameInput = $form.querySelector('input[name="firstname"]');
            const lastNameInput = $form.querySelector('input[name="lastname"]');
            
            const validateName = (input, fieldName, requireMinLength = true) => {
              if (!input) return;
              
              input.addEventListener('blur', function() {
                const value = this.value.trim();
                const existingError = input.parentElement.querySelector('.hs-error-msgs.custom-validation');
                if (existingError) {
                  existingError.remove();
                }
                input.classList.remove('custom-invalid');
                
                if (!value) return;
                
                let errorMessage = '';
                
                if (requireMinLength && value.length < 2) {
                  errorMessage = `${fieldName} must be at least 2 characters`;
                } else if (value.length > 50) {
                  errorMessage = `${fieldName} must be less than 50 characters`;
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                  errorMessage = `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
                }
                
                if (errorMessage) {
                  const errorElement = document.createElement('ul');
                  errorElement.className = 'hs-error-msgs inputs-list custom-validation';
                  errorElement.setAttribute('role', 'alert');
                  const errorItem = document.createElement('li');
                  const errorLabel = document.createElement('label');
                  errorLabel.className = 'hs-error-msg';
                  errorLabel.textContent = errorMessage;
                  errorItem.appendChild(errorLabel);
                  errorElement.appendChild(errorItem);
                  input.parentElement.appendChild(errorElement);
                  input.classList.add('custom-invalid');
                }
              });
            };
            
            validateName(firstNameInput, 'First name', true);
            validateName(lastNameInput, 'Last name', false);
          },
          onFormSubmit: function($form) {
            const firstNameInput = $form.querySelector('input[name="firstname"]');
            const lastNameInput = $form.querySelector('input[name="lastname"]');
            
            let hasErrors = false;
            
            [firstNameInput, lastNameInput].forEach(input => {
              if (!input) return;
              
              const value = input.value.trim();
              const isFirstName = input.name === 'firstname';
              
              if (value && (
                  (isFirstName && value.length < 2) || 
                  value.length > 50 || 
                  !/^[a-zA-Z\s'-]+$/.test(value))) {
                hasErrors = true;
                input.focus();
              }
            });
            
            return !hasErrors;
          },
        });
      }
    });
  }, []);

  return (
    <div
      className={clsx(
        hubSpotStyles.hubSpotNewAdopterFormContainer,
        isClosed && 'adoptersFormHidden',
      )}
    >
      <button
        className="button button--primary"
        onClick={() => {
          setClosed(!isClosed);
        }}
      >
        New Adopters
      </button>

      <div
        className={clsx(
          'padding-left--lg padding-vert--lg thin-scrollbar',
          hubSpotStyles.hubSpotNewAdopterFormContent,
        )}
      ></div>
    </div>
  );
};
