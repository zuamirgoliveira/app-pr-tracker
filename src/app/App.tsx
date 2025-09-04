import { AppProvider } from "../contexts/AppContext";
import { AppRouter } from "./router";
import { Footer } from "../ui/components/Footer";
import "./App.css";
import "../ui/styles/search.css";
import "../ui/styles/status-filter.css";
import "../ui/styles/title-validation.css";
import "../ui/styles/checkbox.css";
import "../ui/styles/typography.css";

function App() {
  return (
    <AppProvider>
      <div className="app">
        <AppRouter />
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;