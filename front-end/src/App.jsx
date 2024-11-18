import { AppContextProvider } from "./general_app_context/AppContextProvider.jsx";
import './App.css'
import LoginRegisterForm from "./components/landing_page/login_register_form/LoginRegisterForm.jsx";
function App() {
  return (
    <AppContextProvider>
      <LoginRegisterForm />
    </AppContextProvider>
  )
}

export default App