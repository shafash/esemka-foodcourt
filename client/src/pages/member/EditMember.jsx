import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import MemberForm from "../../components/member/MemberForm";
import useFetch from "../../hooks/useFetch";
import { getMemberById, updateMember } from "../../services/user.service";

function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchMember = useCallback(() => getMemberById(id), [id]);
  const { data: member, isLoading, error } = useFetch(fetchMember);

  const handleSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }
      await updateMember(id, payload);
      navigate("/members");
    } catch (err) {
      setSubmitError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Edit Member" showBack backTo="/members" />
      {isLoading ? (
        <Card>
          <Loader centered label="Memuat data member..." />
        </Card>
      ) : error || !member ? (
        <Card>
          <EmptyState
            title="Member tidak ditemukan"
            description="Member yang ingin diedit mungkin sudah dihapus."
            actionLabel="Kembali ke Manage Members"
            onAction={() => navigate("/members")}
          />
        </Card>
      ) : (
        <>
          {submitError && <p className="auth-error">{submitError}</p>}
          <MemberForm
            initialValues={member}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Save Change"
            isEdit
          />
        </>
      )}
    </>
  );
}

export default EditMember;
