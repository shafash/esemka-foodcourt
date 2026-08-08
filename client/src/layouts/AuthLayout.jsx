function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">{children}</div>
    </div>
  );
}

export default AuthLayout;
