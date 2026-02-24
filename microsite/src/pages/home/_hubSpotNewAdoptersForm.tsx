import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import hubSpotStyles from './hubSpotNewAdoptersForm.module.scss';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const NAME_PATTERN = /^[a-zA-Z\s'-]+$/;

export const HubSpotNewAdoptersForm = () => {
  const [isClosed, setClosed] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    const handleLoad = () => {
      // @ts-ignore
      if (window.hbspt) {

        const getValidationError = (
          value: string,
          fieldName: string,
          requireMinLength: boolean,
        ): string => {
          if (requireMinLength && value.length < MIN_NAME_LENGTH) {
            return `${fieldName} must be at least ${MIN_NAME_LENGTH} characters`;
          }
          if (value.length > MAX_NAME_LENGTH) {
            return `${fieldName} must be ${MAX_NAME_LENGTH} characters or fewer`;
          }
          if (!NAME_PATTERN.test(value)) {
            return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
          }
          return '';
        };
        
        const validateName = (
          input: HTMLInputElement | null,
          fieldName: string,
          requireMinLength: boolean = true,
        ): boolean => {
          if (!input) return true;
          
          const value = input.value.trim();
          
          const existingError = input.parentElement?.querySelector('.hs-error-msgs.custom-validation');
          if (existingError) {
            existingError.remove();
          }
          input.classList.remove('custom-invalid');
          
          if (!value) {
            return !requireMinLength;
          }
          
          const errorMessage = getValidationError(value, fieldName, requireMinLength);
          
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
            input.parentElement?.appendChild(errorElement);
            input.classList.add('custom-invalid');
            return false;
          }
          
          return true;
        };
        
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: '21894833',
          formId: '9a5aa2af-87f3-4a44-819f-88ee243bb61e',
          target: `.${hubSpotStyles.hubSpotNewAdopterFormContent}`,
          pageId: '79735607665',
          onFormReady: function($form: HTMLFormElement) {
            const firstNameInput = $form.querySelector('input[name="firstname"]') as HTMLInputElement | null;
            const lastNameInput = $form.querySelector('input[name="lastname"]') as HTMLInputElement | null;
            
            const createBlurHandler = (
              input: HTMLInputElement,
              fieldName: string,
              requireMinLength: boolean,
            ) => {
              return () => {
                validateName(input, fieldName, requireMinLength);
              };
            };
            
            if (firstNameInput) {
              const firstNameHandler = createBlurHandler(firstNameInput, 'First name', true);
              firstNameInput.addEventListener('blur', firstNameHandler);
            }
            
            if (lastNameInput) {
              const lastNameHandler = createBlurHandler(lastNameInput, 'Last name', false);
              lastNameInput.addEventListener('blur', lastNameHandler);
            }
          },
          onFormSubmit: function($form: HTMLFormElement) {
            const firstNameInput = $form.querySelector('input[name="firstname"]') as HTMLInputElement | null;
            const lastNameInput = $form.querySelector('input[name="lastname"]') as HTMLInputElement | null;
            
            let hasErrors = false;
            let firstInvalidInput: HTMLInputElement | null = null;
            
            [firstNameInput, lastNameInput].forEach(input => {
              if (!input) return;
              
              const isFirstName = input.name === 'firstname';
              const fieldName = isFirstName ? 'First name' : 'Last name';
              const requireMinLength = isFirstName;
              
              const isValid = validateName(input, fieldName, requireMinLength);
              if (!isValid) {
                hasErrors = true;
                // Track the first invalid field to focus on it
                if (!firstInvalidInput) {
                  firstInvalidInput = input;
                }
              }
            });
            
            if (firstInvalidInput) {
              firstInvalidInput.focus();
            }
            
            return !hasErrors;
          },
        });
      }
    };

    script.addEventListener('load', handleLoad);

    return () => {
      script.removeEventListener('load', handleLoad);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
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
