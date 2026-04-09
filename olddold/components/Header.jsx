export default function Header() {
  const changeLang = (page) => {
    window.location.href = page
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <a href="#hero">
            <img src="/logo.gif" className="site-logo" />
          </a>
        </div>

        <div className="menu">
          <a href="#hero">Home</a>
          <a href="#about">Sobre</a>
          <a href="#services">Serviços</a>
          <a href="#success">Casos</a>
          <a href="#contact">Contato</a>

          <div className="lang-switch">
            <img src="https://flagcdn.com/w20/br.png" onClick={() => changeLang('pt-br.html')} />
            <img src="https://flagcdn.com/w20/us.png" onClick={() => changeLang('en-us.html')} />
            <img src="https://flagcdn.com/w20/es.png" onClick={() => changeLang('es-es.html')} />
          </div>
        </div>
      </nav>
    </header>
  )
}