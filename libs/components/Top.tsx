import { Logout, ReceiptLong } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { logout, userVar } from "../auth";
import { imageUrl } from "../config";

const NAV = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/service", label: "Xizmatlar" },
  { href: "/myOrder", label: "Buyurtmalarim" },
  { href: "/about", label: "Biz haqimizda" },
];

const Top = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isActive = (href: string) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    router.push("/");
  };

  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container "}>
          <Box component={"div"} className={"logo-box"}>
            <Link href={"/"}>
              <img src="/img/logo/hpline-mark.svg" alt="HPLine" />
            </Link>
          </Box>
          <Box component={"div"} className={"router-box"}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={isActive(item.href) ? "active" : ""}>{item.label}</div>
              </Link>
            ))}
          </Box>
          <Box component={"div"} className={"user-box"}>
            {user ? (
              <>
                <div
                  className="login-user"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  style={{ cursor: "pointer" }}
                  title={user.memberNick}
                >
                  <img
                    src={user.memberImage ? imageUrl(user.memberImage) : "/img/profile/defaultUser.svg"}
                    alt={user.memberNick}
                  />
                </div>
                <Menu
                  sx={{ mt: "5px" }}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem disabled sx={{ fontWeight: 600, opacity: "1 !important" }}>
                    {user.memberNick}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      router.push("/myOrder");
                    }}
                  >
                    <ReceiptLong fontSize="small" style={{ marginRight: "10px" }} />
                    Buyurtmalarim
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" style={{ color: "blue", marginRight: "10px" }} />
                    Chiqish
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => router.push(`/login?next=${encodeURIComponent(router.asPath)}`)}
                sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
              >
                Kirish
              </Button>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Top;
