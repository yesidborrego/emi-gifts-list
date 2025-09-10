"use client";

export default function AuthCodeError() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Authentication Error</h1>
      <p>There was an error during the authentication process.</p>
      <p>Please try again or contact support.</p>
      <a href="/login">Go back to Login</a>
    </div>
  );
}
