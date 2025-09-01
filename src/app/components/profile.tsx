"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "79vh",
  width: "63vw",
};

type ProfileData = {
  avatar: string;
  why: string;
  height: string;
  weight: string;
  gender: string;
  age: string;
};

export default function Profile({ open, onClose }: ProfileProps) {
  const [data, setData] = React.useState<ProfileData>({
    avatar: "",
    why: "",
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Fetch initial profile data only once when component mounts
  React.useEffect(() => {
    setLoading(true);
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((profile: Partial<ProfileData>) => {
        // merge with defaults so all fields exist
        setData({
          avatar: profile.avatar ?? "",
          why: profile.why ?? "",
          height: profile.height ?? "",
          weight: profile.weight ?? "",
          gender: profile.gender ?? "",
          age: profile.age ?? "",
        });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setData((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange =
    (field: keyof Omit<ProfileData, "avatar">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              height: "calc(100% - 60px)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "calc(100% - 80px)",
              gap: 4,
              mt: 2,
            }}
          >
            {/* Left: Avatar + upload button */}
            <Box
              sx={{
                flex: "0 0 30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Avatar
                src={data.avatar || "/avatar.png"}
                sx={{ width: 128, height: 128 }}
              />
              <Button variant="outlined" component="label">
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            </Box>

            {/* Right: form fields */}
            <Box
              component="form"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Why?"
                value={data.why}
                onChange={handleChange("why")}
                fullWidth
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Height"
                  value={data.height}
                  onChange={handleChange("height")}
                  fullWidth
                />
                <TextField
                  label="Weight"
                  value={data.weight}
                  onChange={handleChange("weight")}
                  fullWidth
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Gender"
                  value={data.gender}
                  onChange={handleChange("gender")}
                  fullWidth
                />
                <TextField
                  label="Age"
                  type="number"
                  value={data.age}
                  onChange={handleChange("age")}
                  fullWidth
                />
              </Box>

              {/* Buttons */}
              <Box sx={{ mt: "auto", textAlign: "right", pt: 2 }}>
                <Button onClick={onClose} sx={{ mr: 2 }}>
                  Close
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
