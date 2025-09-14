import { AppProvider } from "../contexts/AppContext";
import { AppRouter } from "./router";
import { Footer } from "../ui/components/Footer";

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