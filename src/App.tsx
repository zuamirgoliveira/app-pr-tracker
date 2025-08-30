import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RepositoryList from "./components/RepositoryList";
import { AzureDevOpsService } from "./services/azure";
import { Repository, ConnectionForm } from "./types";

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleLogin = async (form: ConnectionForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const repos = await AzureDevOpsService.getRepositories(
        form.organization,
        form.project,
        form.token
      );

      setRepositories(repos);
      setConnectionInfo(form);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setRepositories([]);
      setConnectionInfo(null);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setRepositories([]);
    setConnectionInfo(null);
    setIsConnected(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-azure-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {!isConnected ? (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          connectionInfo && (
            <RepositoryList
              repositories={repositories}
              organization={connectionInfo.organization}
              project={connectionInfo.project}
              onDisconnect={handleDisconnect}
            />
          )
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t border-gray-200 py-2">
        <div className="text-center text-xs text-gray-500">
          Azure Repos Client - Feito com ❤️ usando Tauri + React + TypeScript
        </div>
      </footer>
    </div>
  );
}

export default App;