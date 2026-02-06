import { Logout } from "@mui/icons-material";
import { Box, Link, Menu, MenuItem, Stack } from "@mui/material";

const Top = () => {
  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container "}>
          <Box component={"div"} className={"logo-box"}>
            <Link href={"/"}>
              <img src="/img/logo/logoWhite.svg" alt="" />
            </Link>
          </Box>
          <Box component={"div"} className={"router-box"}>
            <Link href={"/"}>
              <div>Bosh sahifa</div>
            </Link>
            <Link href={"/service"}>
              <div>Xizmatlar</div>
            </Link>
            <Link href={"/myOrder"}>
              <div>Buyurtmalarim</div>
            </Link>
            <Link href={"/about"}>
              <div>Biz haqimizda</div>
            </Link>
          </Box>
          <Box component={"div"} className={"user-box"}>
            <>
              <div className="login-user">
                <img src={"/img/profile/defaultUser.svg"} alt="" />
              </div>
              <Menu
                sx={{ mt: "5px" }}
                open={false}
                anchorEl={null}
                onClose={() => {}}
              >
                <MenuItem>
                  <Logout
                    fontSize="small"
                    style={{ color: "blue", marginRight: "10px" }}
                  />
                  Logout
                </MenuItem>
              </Menu>
            </>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Top;
