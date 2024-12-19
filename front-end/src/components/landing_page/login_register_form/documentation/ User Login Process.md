# User Login Process and Session Maintenance

## 1. User Login Process

### Frontend (React)

1. **User Input**: The user enters their username and password in the login form in `LoginRegisterForm.jsx`.

2. **Form Submission**: When the user submits the form, the `handleFormSubmit` function from `LoginRegisterFunctions.jsx` is called.

3. **Username Validation**: The `validateUsername` function is called to clean and validate the username.

4. **Login Request**: If the form is valid, the `handleLogin` function is called. This function sends a POST request to the `/user/details` endpoint to fetch user details.

5. **Fetch User Details**: The `handleLogin` function sends a POST request to the `/user/login` endpoint with the cleaned username and password.

6. **Handle Login Response**: The `handleLoginResponse` function processes the response from the server. If the login is successful, it normalizes the user data and calls the `login` function from `AppContextProvider.jsx`.

### Backend (Node.js/Express)

1. **Login Endpoint**: The `/user/login` endpoint in `user_api_router.js` calls the `login` function in `user_api_controller.js`.

2. **User Validation**: The `login` function in `user_controller.js` validates the username and password. It checks if the user exists and if the password is correct using bcrypt.

3. **Response**: If the login is successful, the server responds with the user data (excluding the password).

## 2. Maintaining User Session

### Frontend (React)

1. **Store User Data**: The `login` function in `AppContextProvider.jsx` stores the user data (excluding the password) in both the React context and localStorage.

2. **Set Current User**: The `setCurrentUser` function is called to set the current user in the React context.

3. **LocalStorage**: The user data is stored in localStorage with a timestamp.

### Backend (Node.js/Express)

1. **Session Management**: The backend does not explicitly manage sessions. Instead, it relies on the frontend to store and manage the user session using localStorage.

## 3. Reloading the Browser

### Frontend (React)

1. **Check LocalStorage**: When the app loads, the `checkAndClearUserData` function in `AppContextProvider.jsx` checks localStorage for stored user data.

2. **Set Current User**: If valid user data is found in localStorage, it sets the current user in the React context.

3. **Expiration Check**: The `checkAndClearUserData` function checks if the stored user data is older than 9 days. If it is, the data is cleared from localStorage and the React context.

## Summary

- The login process involves validating the user credentials on the backend and storing the user data on the frontend.
- The user session is maintained by storing the user data in localStorage and the React context.
- When the browser is reloaded, the app checks localStorage for stored user data and sets the current user in the React context if valid data is found.

This approach ensures that the user remains logged in even after reloading the browser, as long as the stored user data is valid and not expired.