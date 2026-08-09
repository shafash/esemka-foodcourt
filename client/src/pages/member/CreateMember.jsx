import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import MemberForm from "../../components/member/MemberForm";
import { createMember } from "../../services/user.service";

function CreateMember() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (values) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createMember(values);
      navigate("/members");
    } catch (err) {
      setSubmitError(err.message || "Gagal menambahkan member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Add Member" showBack backTo="/members" />
      {submitError && <p className="auth-error">{submitError}</p>}
      <MemberForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Change" />
    </>
  );
}

export default CreateMember;
