import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import CategoryForm from "../../components/category/CategoryForm";
import { createCategory } from "../../services/cetagory.service";

function CreateCategory() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createCategory(values);
      navigate("/category");
    } catch (err) {
      setSubmitError(err.message || "Gagal menambahkan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Add Category" />
      <Card>
        {submitError && <p className="auth-error">{submitError}</p>}
        <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Change" />
      </Card>
    </>
  );
}

export default CreateCategory;