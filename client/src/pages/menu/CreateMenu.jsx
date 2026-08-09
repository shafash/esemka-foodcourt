import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import MenuForm from "../../components/menu/MenuForm";
import { createMenu } from "../../services/menu.service";

import "../../styles/menu.css";

function CreateMenu() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createMenu(payload);
      navigate("/menu");
    } catch (err) {
      setSubmitError(err.message || "Gagal menambahkan menu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Add Menu Item" showBack backTo="/menu" />
      <Card>
        {submitError && <p className="auth-error">{submitError}</p>}
        <MenuForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Change" />
      </Card>
    </>
  );
}

export default CreateMenu;