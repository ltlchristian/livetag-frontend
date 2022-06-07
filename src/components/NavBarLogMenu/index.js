import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { Link } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

import "./NavBarLogMenu.css";

export default function NavBarLogMenu() {
  const { connected, disconnect } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const ButtonForm = styled(Button)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "rgb(1, 80, 104)",
    borderColor: "white",

    "&:hover": {
      backgroundColor: "rgb(2, 51, 66)",
      borderColor: "white",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "rgb(2, 51, 66)",
      borderColor: "white",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.5rem rgba(0,123,255,.5)",
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AccountBoxIcon className="links" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {connected && (
          <MenuItem onClick={handleClose}>
            <Link className="menuLinks " to="/profil">
              <ButtonForm variant="contained" onClick={handleClick}>
                Profil
              </ButtonForm>
            </Link>
          </MenuItem>
        )}
        {!connected && (
          <MenuItem onClick={handleClose}>
            <Link className="menuLinks" to="/login">
              <ButtonForm variant="contained" onClick={handleClick}>
                Se connecter
              </ButtonForm>
            </Link>
          </MenuItem>
        )}
        {connected && (
          <MenuItem
            onClick={() => {
              handleClose();
              disconnect();
            }}
          >
            <Link className="menuLinks" to="/logout" color="rgb(1, 80, 104)">
              <ButtonForm
                variant="contained"
                size="small"
                onClick={handleClick}
              >
                Se déconnecter
              </ButtonForm>
            </Link>
          </MenuItem>
        )}
        {!connected && (
          <MenuItem onClick={handleClose}>
            <Link className="menuLinks" to="/signup">
              <ButtonForm variant="contained" onClick={handleClick}>
                S'inscrire
              </ButtonForm>
            </Link>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
