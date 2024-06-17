import "../css/NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="not-found">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
