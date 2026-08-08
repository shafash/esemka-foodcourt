import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import MenuForm from "../../components/menu/MenuForm";
import useFetch from "../../hooks/useFetch";
import { getMenuById, updateMenu } from "../../services/menu.service";

import "../../styles/menu.css";

function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchMenu = useCallback(() => getMenuById(id), [id]);
  const { data: menu, isLoading, error } = useFetch(fetchMenu);

  const handleSubmit = async (payload) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await updateMenu(id, payload);
      navigate("/menu");
    } catch (err) {
      setSubmitError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Edit Menu" />
      <Card>
        {isLoading ? (
          <Loader centered label="Memuat data menu..." />
        ) : error || !menu ? (
          <EmptyState
            title="Menu tidak ditemukan"
            description="Menu yang ingin diedit mungkin sudah dihapus."
            actionLabel="Kembali ke Manage Menus"
            onAction={() => navigate("/menu")}
          />
        ) : (
          <>
            {submitError && <p className="auth-error">{submitError}</p>}
            <MenuForm
              initialValues={menu}
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

export default EditMenu;