
Dashboard:

    Main Navigation
        Tabbed interface with sections:
            Items Master
            Processes
            Bill of Materials (BoM)
        Process Steps
            Progress tracker showing completion status
    Sidebar Features
        Recommended setup order: Items > BoM > Processes > Process Steps
        Quick navigation to incomplete sections
        Dynamic progress indicators
    Pending Setup Section (Always Visible)
        Incomplete items grouped by type
        Direct links to resolve missing dependencies
        Real-time status updates

Sections:

1. Items Master Section
    
    Mandatory Fields:
        internal_item_name
        type (sell/purchase/component)
        UoM
        Avg_weight_needed

        If any of the mandatory fields is missing, instantly generate an error.(also try to fetch the whole row in which error occurred for easy navigation towards the user.) 

    UI Components:
        Searchable dropdown for type selection with tooltips
        Conditional checkbox for is_job_work
        Clear validation feedback
        These are suggestion, make it as beautiful and user friendly as possible.
    Key Validations:
        Unique internal_item_name + tenant combination
        Non-null scrap_type for purchase/sell items
        Conditional job work settings based on tenant configuration
    If any validation fails, immediately generate an error. 


2. BoM
    Mandatory Fields:
        item_id
        component_id
        Quantity
        If any of the mandatory fields is missing, instantly generate an error(also try to fetch the whole row in which error occurred for easy navigation towards the user.) 
    UI Components:
        Searchable dropdowns with autocomplete for items
        These are suggestion, make it as beautiful and user friendly as possible.
    Key Validations:
        Sell items: ≥1 entry as item_id
        Purchase items: ≥1 entry as component_id
        Component items: Both item_id and component_id entries required
        UoM-based quantity validation:
            Both Nos: Integer only
            Mixed Nos/Kgs: Special rules apply
    If any validation fails, immediately generate an error.


3. Process Steps Section
    Mandatory Fields:
        process_id
        item_id
        sequence
        conversion_ratio
        Process_description
        If any of the mandatory fields is missing, instantly generate an error(also try to fetch the whole row in which error occurred for easy navigation towards the user.). 
    Key Validations:
        No duplicate item_id + sequence
        No sequence gaps allowed
        Purchase items: Single "Internal Transfer" step only
        Conversion ratio: 0-100 (warning if <30)
        If any validation fails, immediately generate an error.


4. Error Handling System
    Our aim is to make the process less tedious and more user friendly. 
    Bulk Upload Features:
    Detailed error reporting
    In-place correction capabilities
    Partial success handling
    Bulk error resolution tools 
    Real-time Validation:
    Field-level instant feedback
    Cross-reference checking
    Suggestion system
    Smart error recovery



Technical Implementation
Required Features
File Handling:
CSV upload/download
Template generation
Error report generation
Data Management:
Real-time validation
Dependency tracking
Cross-reference checking
User Interface:
Responsive design
Intuitive navigation
Clear error messaging
Progress tracking
Test Cases
Data Validation:
Duplicate item detection
Cross-tenant isolation
Dependency verification
UoM-based quantity rules
Error Handling:
Bulk upload errors
Real-time validation
Recovery scenarios
Partial success cases
User Flow:
Complete item creation
BoM setup with dependencies
Process step sequence management
Error correction workflows
Evaluation Criteria
Code Quality (20%)(Priority)
Clean architecture
Component reusability
State management
Error handling
Feature Completeness (60%)( Priority)
All validations implemented
Bulk operations working
Real-time feedback
Dependency management
User Experience (20%)
Interface intuitiveness
Error clarity
Navigation flow
Response time
Extra Credit (10%)( attempt only when completed above mentioned feature)
New Feature implemented

