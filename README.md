# InveeSync Assignment

This project is a ERP system designed using **Next.js** and **Tailwind CSS**. It provides a user-friendly interface to manage processes, items, and materials effectively.

## Deployed Application

The application is deployed and accessible at: [https://invee-sync-frontend.vercel.app/](https://invee-sync-frontend.vercel.app/)

## Features
- Create and manage Bills of Materials.
- Add and manage items and processes.
- Modular components for scalability.
- Error handling and modals for enhanced user experience.

## Libraries Used

### Core Dependencies
- **axios**: ^1.7.7
- **flowbite**: ^2.5.2
- **next**: ^15.0.3
- **papaparse**: ^5.4.1
- **react**: ^18.3.0
- **react-dom**: ^18.3.0
- **react-icons**: ^5.3.0
- **react-query**: ^3.39.3
- **react-select**: ^5.8.3
- **react-toastify**: ^10.0.6

### Development Dependencies
- **daisyui**: ^4.12.14
- **postcss**: ^8
- **tailwindcss**: ^3.4.1

## Installation

Follow the steps below to run this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ankushyamkar10/InveeSync-Frontend.git  
   cd inveesync-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## File Structure

- `src/app/components`: Contains reusable UI components.
- `src/app/modals`: Modal components for various features.
- `src/app/queries`: Contains API query configurations.
- `src/app/services`: Handles API requests for BoM, items, and processes.
- `src/app/utils`: Utility functions including Axios configurations.



## License
This project is licensed under the MIT License. See the LICENSE file for details.
