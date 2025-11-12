import './styles.css';

function App() {
  return (
    <div className="app">
      {/* Shape Right Up - Pojok Kanan Atas */}
      <svg className="shape-right-up" width="77" height="78" viewBox="0 0 77 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M77 77.2465V0H0.43588C58.2201 0 77 21.2145 77 77.2465Z" fill="#00A39D"/>
      </svg>
      
      {/* Shape Left Down - Orange decorative shape */}
      <svg className="shape-left-down" xmlns="http://www.w3.org/2000/svg" width="91" height="91" viewBox="0 0 91 91" fill="none">
        <path d="M91 90.2465V0H0.43588C58.2201 0 91 31.2145 91 90.2465Z" fill="#F8AD3C"/>
      </svg>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo">BSI UMKM Centre</span>
          </div>
          
          <div className="nav-menu">
            <button className="nav-btn">Tentang Kami</button>
            <button className="nav-btn">Produk</button>
            <button className="nav-btn">FAQ</button>
          </div>
          
          <button className="btn-login-nav">Login</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="background-pattern">
          <div className="pattern-container"></div>
          <div className="main-logo">
            <h2 className="main-bsi-logo">BSI UMKM Centre</h2>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="login-section">
          <div className="form-container">
            <div className="welcome-text">
              <h1 className="title">Selamat<br/>Datang...</h1>
              <p className="subtitle">
                Assalamualaikum warahmatullahi wabarakatuh,<br/>
                Selamat datang di BSI UMKM Centre cabang<br/>
                Yogyakarta.
              </p>
            </div>

            <form className="login-form" id="loginForm">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="Masukkan Email anda..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Kata sandi</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="Masukkan Kata sandi anda..."
                  required
                />
                
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox"/>
                    <span className="checkmark"></span>
                    <span className="checkbox-text">Ingat saya</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-login">Masuk</button>

              <div className="form-footer">
                <p>Belum memiliki akun? <a href="#register" className="link-register">Daftar di sini</a></p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;