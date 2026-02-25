import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import hubSpotStyles from './hubSpotNewAdoptersForm.module.scss';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const NAME_PATTERN = /^[a-zA-Z\s'-]+$/;

const HUBSPOT_SCRIPT_ID = 'hubspot-forms-script';
let isFormInitialized = false;

export const HubSpotNewAdoptersForm = () => {
  const [isClosed, setClosed] = useState(true);

  useEffect(() => {
    const eventListeners: Array<{ element: HTMLInputElement; handler: EventListener }> = [];
    
    const initializeForm = () => {
      // @ts-ignore
      if (window.hbspt && !isFormInitialized) {
        isFormInitialized = true;

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
        
        const clearValidationError = (input: HTMLInputElement) => {
          const errorId = `${input.name}-validation-error`;
          const existingError = input.parentElement?.querySelector('.hs-error-msgs.custom-validation');
          if (existingError) {
            existingError.remove();
          }
          
          input.classList.remove('custom-invalid');
          input.removeAttribute('aria-invalid');
          
          const describedBy = input.getAttribute('aria-describedby');
          if (describedBy) {
            const tokens = describedBy
              .split(/\s+/)
              .filter(token => token && token !== errorId);
            if (tokens.length > 0) {
              input.setAttribute('aria-describedby', tokens.join(' '));
            } else {
              input.removeAttribute('aria-describedby');
            }
          }
        };
        
        const showValidationError = (
          input: HTMLInputElement,
          errorMessage: string,
        ) => {
          const errorId = `${input.name}-validation-error`;
          const errorElement = document.createElement('ul');
          errorElement.className = 'hs-error-msgs inputs-list custom-validation';
          errorElement.setAttribute('role', 'alert');
          const errorItem = document.createElement('li');
          const errorSpan = document.createElement('span');
          errorSpan.className = 'hs-error-msg';
          errorSpan.id = errorId;
          errorSpan.textContent = errorMessage;
          errorItem.appendChild(errorSpan);
          errorElement.appendChild(errorItem);
          input.parentElement?.appendChild(errorElement);
          
          input.classList.add('custom-invalid');
          input.setAttribute('aria-invalid', 'true');
          
          const describedBy = input.getAttribute('aria-describedby');
          const tokens = describedBy
            ? describedBy.split(/\s+/).filter(token => token)
            : [];
          if (!tokens.includes(errorId)) {
            tokens.push(errorId);
          }
          input.setAttribute('aria-describedby', tokens.join(' '));
        };
        
        const validateName = (
          input: HTMLInputElement | null,
          fieldName: string,
          requireMinLength: boolean = true,
        ): boolean => {
          if (!input) return true;
          
          const value = input.value.trim();
          
          if (!value) {
            clearValidationError(input);
            return true;
          }
          
          const errorMessage = getValidationError(value, fieldName, requireMinLength);
          const existingError = input.parentElement?.querySelector(
            '.hs-error-msgs.custom-validation .hs-error-msg'
          );
          const currentErrorText = existingError?.textContent;
          
          if (errorMessage) {
            if (currentErrorText !== errorMessage) {
              clearValidationError(input);
              showValidationError(input, errorMessage);
            }
            return false;
          }
          
          clearValidationError(input);
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
            
            if (firstNameInput) {
              const firstNameHandler = () => {
                validateName(firstNameInput, 'First name', true);
              };
              firstNameInput.addEventListener('blur', firstNameHandler);
              eventListeners.push({ element: firstNameInput, handler: firstNameHandler });
            }
            
            if (lastNameInput) {
              const lastNameHandler = () => {
                validateName(lastNameInput, 'Last name', false);
              };
              lastNameInput.addEventListener('blur', lastNameHandler);
              eventListeners.push({ element: lastNameInput, handler: lastNameHandler });
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
    
    let script: HTMLScriptElement | null = null;
    let handleLoad: (() => void) | null = null;
    
    // @ts-ignore
    if (window.hbspt) {
      initializeForm();
    } else {
      script = document.getElementById(HUBSPOT_SCRIPT_ID) as HTMLScriptElement | null;
      
      if (!script) {
        script = document.createElement('script');
        script.id = HUBSPOT_SCRIPT_ID;
        script.src = 'https://js.hsforms.net/forms/v2.js';
        document.body.appendChild(script);
      }
      
      handleLoad = () => {
        initializeForm();
      };
      
      script.addEventListener('load', handleLoad);
    }
    
    return () => {
      if (script && handleLoad) {
        script.removeEventListener('load', handleLoad);
      }
      eventListeners.forEach(({ element, handler }) => {
        element.removeEventListener('blur', handler as EventListener);
      });
      isFormInitialized = false;
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
