import { useState } from "react";
import { submitAI } from "../services/api";
import { TextField, Button, Container } from "@mui/material";

export default function SubmitAI() {
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    await submitAI(form);
    alert("Submitted!");
  };

  return (
    <Container>
      <TextField label="Name" fullWidth onChange={e => setForm({...form, name: e.target.value})} />
      <TextField label="Category" fullWidth onChange={e => setForm({...form, category: e.target.value})} />
      <TextField label="Description" fullWidth onChange={e => setForm({...form, description: e.target.value})} />
      <TextField label="Icon URL" fullWidth onChange={e => setForm({...form, iconurl: e.target.value})} />
      <TextField label="Website" fullWidth onChange={e => setForm({...form, website: e.target.value})} />

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}