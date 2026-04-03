import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.jpg";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import Logo from "../../assets/logo.jpg";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const [openDailog, setOpenDailog] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    console.log("User data:", user);
  }, []);

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid profile email",
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.log(error),
  });
  const GetUserProfile = async (tokenInfo) => {
    console.log("tokenInfo from Google login:", tokenInfo);

    const accessToken = tokenInfo?.access_token;
    const credentialToken = tokenInfo?.credential;

    if (!accessToken && !credentialToken) {
      console.error(
        "Google login did not return an access token or credential",
        tokenInfo,
      );
      return;
    }

    try {
      let userData;

      if (accessToken) {
        const resp = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          },
        );
        userData = resp.data;
        console.log("Full user data from Google via access token:", userData);
      } else {
        // If only credential token is available, decode ID token payload
        const parts = credentialToken.split(".");
        if (parts.length >= 2) {
          const payloadJson = atob(
            parts[1].replace(/-/g, "+").replace(/_/g, "/"),
          );
          userData = JSON.parse(decodeURIComponent(escape(payloadJson)));
          console.log(
            "User data extracted from ID token credential:",
            userData,
          );
        } else {
          throw new Error("Invalid Google credential token");
        }
      }

      const storedUser = {
        data: userData,
        id: userData?.id || userData?.sub,
        email: userData?.email,
        name: userData?.name,
        picture: userData?.picture,
      };

      localStorage.setItem("user", JSON.stringify(storedUser));
      console.log("Stored user object:", storedUser);
      setOpenDailog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Failed to fetch user profile. Please try signing in again.");
    }
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <a href="/">
        <img src={logo} alt="logo" className="size-15 rounded-[50%] " />
      </a>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/my-trips">
              <Button varient="outline" className="rounded-full">
                My Trips
              </Button>{" "}
            </a>

            <Popover>
              <PopoverTrigger>
                <Button variant="outline" className="cursor-pointer">
                  <div>{user?.data?.given_name}</div>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout;
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => setOpenDailog(true)}
            className="cursor-pointer"
          >
            Sign In
          </Button>
        )}
      </div>
      <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In with Google</DialogTitle>
            <DialogDescription>
              <img src={Logo} alt="Logo" className="size-15 rounded-[50%] " />
              <span className="block mt-3">
                Sign in to the App with Google authentication securely
              </span>
              <Button
                className="w-full mt-5 flex gap-4 items-center"
                onClick={login}
              >
                {" "}
                <FcGoogle className="h-7 w-7" />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
