import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import CategoryForm from "../../components/category/CategoryForm";
import useFetch from "../../hooks/useFetch";
import { getCategoryById, updateCategory } from "../../services/cetagory.service";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchCategory = useCallback(() => getCategoryById(id), [id]);
  const { data: category, isLoading, error } = useFetch(fetchCategory);

  const handleSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await updateCategory(id, values);
      navigate("/category");
    } catch (err) {
      setSubmitError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Edit Category" />
      <Card>
        {isLoading ? (
          <Loader centered label="Memuat data kategori..." />
        ) : error || !category ? (
          <EmptyState
            title="Kategori tidak ditemukan"
            description="Kategori yang ingin diedit mungkin sudah dihapus."
            actionLabel="Kembali ke Manage Categories"
            onAction={() => navigate("/category")}
          />
        ) : (
          <>
            {submitError && <p className="auth-error">{submitError}</p>}
            <CategoryForm
              initialValues={category}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Save Change"
            />
          </>
        )}
      </Card>
    </>
  );
}

export default EditCategory;