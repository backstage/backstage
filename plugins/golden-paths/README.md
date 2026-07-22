# Golden Paths

This is the React frontend part of the Golden Paths plugin. Golden Path is a group of Backstage [software templates](https://backstage.io/docs/features/software-templates/) that are executed in a specific order. This package contains interfaces to display golden paths that are available in the Backstage catalog and the workflow to execute templates using those golden paths.

## Features

### Golden Path Output Parameters Implementation: Executive Summary

#### Contribution Overview

This contribution enhanced the Golden Path functionality in Backstage by implementing a robust output handling system. The system now properly captures step outputs, filters them based on defined parameters, and makes them available for reference in subsequent steps.

#### Key Problems Addressed

1. **Step Output Persistence**: Step outputs were not being saved to the database when steps finished.
2. **Output Filtering**: The `output` field in golden path steps was not being utilized to filter the outputs.
3. **Reference Resolution**: References like `${{ outputs.xxx }}` were not properly resolved and made available between steps.
4. **Missing References**: The system failed when encountering references to non-existent outputs.
5. **Parameter Passing**: There was no mechanism to pass data outputs from one template as inputs to subsequent templates.

#### Solution Architecture

The implementation spans multiple components:

##### Backend Components

1. **StorageTaskBroker**: Enhanced to:

   - Properly save and persist step outputs
   - Filter outputs based on the `output` field
   - Process references in template inputs
   - Replace missing references with empty strings

2. **API Router**: Added endpoints for retrieving outputs and template data:
   - `GET /tasks/:taskId/outputs`
   - Returns filtered outputs from previous steps

##### Frontend Components

1. **API Client**: Added a method to fetch task outputs from the backend:
   - `getTemplateOutputs(taskId: string): Promise<Record<string, any>>`
   - Retrieves outputs from completed templates within a task

#### Implementation Details

##### Output Processing

- Implemented functionality to extract and store output values from completed steps
- Created a filtering mechanism based on the `output` definition
- Added URL encoding for task IDs containing special characters

##### Reference Resolution

- Template outputs are now accessible via a dedicated API endpoint
- Implemented handling of complex nested output structures
- Added proper error handling for missing references or failed requests

#### Testing

Comprehensive test coverage was implemented for all components:

1. **Backend Tests**:

   - Unit tests for output filtering logic
   - Tests for output storage and retrieval
   - Integration tests for database interactions

2. **API Tests**:
   - Unit tests with mock responses for all API endpoints
   - Tests for error handling and edge cases
   - Tests for URL encoding of special characters
   - Tests for complex nested data structures
   - Integration tests for parameter passing between templates

#### Technical Impact

- **Enhanced User Experience**: Users can now rely on outputs from one step being properly available in subsequent steps
- **Secure Data Handling**: Proper encoding of special characters prevents security issues
- **Improved Reliability**: The system gracefully handles edge cases such as missing references and special characters
- **Better Maintainability**: Comprehensive test coverage ensures regressions can be quickly identified
- **Type Safety**: Full TypeScript type coverage provides compile-time checks and better IDE support

#### Business Value

- **Streamlined Workflows**: Golden Path users can now build more complex, multi-step processes with interdependent steps
- **Reduced Friction**: Template values can be automatically populated based on previous step outputs
- **Enhanced Governance**: Output filtering provides control over which data is exposed to subsequent steps
- **Increased Productivity**: Reduced manual data entry through parameter passing between steps

#### Future Enhancements

- Add UI indicators for fields that will be populated from outputs
- Implement output validation before using them in subsequent steps
- Extend the reference resolution to support nested object paths
- Add support for transforms and formatting of output values
- Implement caching strategies for frequently accessed outputs

##### Test Coverage

The implementation includes extensive test coverage:

1. **Basic functionality testing**: Verifying the method correctly fetches outputs for a given task ID
2. **Error handling**: Ensuring proper error propagation when API requests fail
3. **Complex data structure support**: Testing with nested objects, arrays, and mixed data types
4. **Special character handling**: Verifying proper URL encoding of task IDs with special characters
5. **Integration testing**: Demonstrating how outputs can be passed between templates

This comprehensive testing approach ensures the output parameter system works reliably across various scenarios and edge cases.
