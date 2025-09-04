import { Routes, Route } from "react-router-dom";
import Login from "../../ui/pages/login/Login";
//import ProjectsPage from "../../ui/pages/Projects";
//import RepositoriesPage from "../../ui/pages/Repositories";
//import PullRequestsPage from "../../ui/pages/PullRequests";
//import MyPullRequestsPage from "../../ui/pages/MyPullRequests";

      //<Route path="/projects" element={<ProjectsPage />} />
      //<Route path="/repositories" element={<RepositoriesPage />} />
      //<Route path="/pullrequests" element={<PullRequestsPage />} />
      //<Route path="/my-pullrequests" element={<MyPullRequestsPage />} />

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
