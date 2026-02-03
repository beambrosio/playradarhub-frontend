const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: " 	#1C1C1C",
    color: "#eee",
    fontFamily: "'Space Grotesk', sans-serif", // Default for all
    alignItems: "stretch", // Adicione esta linha!
  },
  container: {
    display: "block",
    width: "100%",
    maxWidth: "1200px", // IGUAL ao da lista!
    margin: "0 auto",
    padding: "20px",
    flex: 1,
  },
  header: {
    textAlign: "left",
    padding: "20px",
    backgroundColor: "#1e1e1e",
    textShadow: "0 0 10px #0ff, 0 0 20px #0ff",
    fontFamily: "'Orbitron', sans-serif", // For header/title
    //    textShadow: "0 0 5px #0ff",
    fontSize: 24,
  },
  footer: {
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#1e1e1e",
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 14,
    color: "#888",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    margin: "0 auto",
    maxWidth: 1200, // já está certo
  },
  card: {
    backgroundColor: "#363636",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 0 10px #0ff66",
    transition: "transform 0.3s",
    cursor: "pointer",
  },
  cardHover: {
    transform: "scale(1.05)",
  },
  gameTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#0ff",
    fontFamily: "'Orbitron', sans-serif",
    // textShadow: "0 0 5px #0ff",
  },
  cover: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
  },
  loading: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#0ff",
  },
  error: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "red",
  },
  carouselItem: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    width: 400,
    height: 750,
    margin: "0 -10px", // margem lateral entre os jogos
    background: "#111",
    display: "flex",
    flexDirection: "column",
  },
  carouselImage: {
    width: "100%",
    height: 550, // altura fixa para imagem/placeholder
    objectFit: "cover",
    display: "block",
    borderRadius: "12px 12px 0 0",
  },
  carouselInfo: {
    flex: 1,
    padding: "12px 10px 8px 10px",
    background: "#363636",
    borderRadius: "0 0 12px 12px",
    color: "#fff",
    textAlign: "left",
    minHeight: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#363636",
    borderRadius: "0px 15px",
    color: "#fff",
    padding: 10,
    fontSize: 12,
  },
  overlayTitle: {
    fontFamily: "'Orbitron', sans-serif", // For card titles
    fontSize: 15,
    fontWeight: "bold",
    color: "#0ff",
    marginBottom: 5,
    zIndex: 1,
  },
  overlayDate: {
    margin: 0,
    color: "#ccc",
    fontSize: 15,
  },
  overlayPlatforms: {
    display: "flex",
    gap: 5,
    marginTop: 5,
    zIndex: 1,
  },
  carouselWrapper: {
    paddingBottom: 40, // ou marginBottom
    background: "none",
    display: "block",
  },
};

export default styles;
