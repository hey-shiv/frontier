import { Route, Switch } from "wouter";
import { Navbar } from "./components/navbar";
import IndexPage from "./pages/index";
import GeneratePage from "./pages/generate";
import CompaniesPage from "./pages/companies";
import TrendsPage from "./pages/trends";
import SavedPage from "./pages/saved";
import RoadmapsPage from "./pages/roadmaps";
import { RunableBadge } from "./components/runable-badge";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/generate" component={GeneratePage} />
        <Route path="/companies" component={CompaniesPage} />
        <Route path="/trends" component={TrendsPage} />
        <Route path="/saved" component={SavedPage} />
        <Route path="/roadmaps" component={RoadmapsPage} />
      </Switch>
      <RunableBadge />
    </div>
  );
}

export default App;
