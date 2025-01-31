import "./Footer.css"


const Footer = () => {
  return (
      <div className="footer">
        <img className="ufcIconLoginPage" src="src\assets\Icons\ufcSymbol.png" width="3%" alt="UFC.Symbol.Header" />
        <div className="ufcLink">
            <a href="https://site.crateus.ufc.br/" target="_blank">UFC - Federal University of Ceará</a>
        </div>
        <div className="outroslinks">
            <p>Contact Us</p>
            <p>FAQ</p>
            <p>Developers</p>
        </div>
    </div>
  )
}

export default Footer