import React from "react";
import { FaHome, FaGamepad, FaInfoCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: <FaHome />, label: "Home", path: "/" },
  { icon: <FaGamepad />, label: "Games", path: "/games" },
  { icon: <FaInfoCircle />, label: "About", path: "/about" },
];

function Sidebar({ expanded, onToggle }) {
  const navigate = useNavigate();

  return (
    <div
      className={`app-sidebar ${expanded ? 'expanded' : 'collapsed'}`}
      style={{
        height: "100vh",
        width: expanded ? 180 : 56,
        background: "#181818",
        color: "#fff",
        position: "fixed",
        top: 56, // abaixo do header
        left: 0,
        transition: "width 0.2s",
        zIndex: 10000,
        boxShadow: "2px 0 8px #0008",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: expanded ? "flex-start" : "center",
          justifyContent: "flex-start",
          flex: 1,
        }}
      >
        {/* Removido o ícone do menu aqui */}
        {/* Itens do menu */}
        {menuItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: expanded ? "flex-start" : "center",
              width: "100%",
              padding: expanded ? "10px 16px" : "10px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            tabIndex={0}
            onClick={() => navigate(item.path)}
          >
            <span
              style={{
                fontSize: 22,
                marginRight: expanded ? 16 : 0,
              }}
            >
              {item.icon}
            </span>
            {expanded && (
              <span
                style={{
                  fontSize: 16,
                  fontFamily: "'Orbitron', Arial, Verdana, sans-serif", // Altere aqui para a fonte desejada
                  color: "#fff",
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
