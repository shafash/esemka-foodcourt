import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import UnitForm from "../../components/unit/UnitForm";

import useFetch from "../../hooks/useFetch";
import { getUnitsPaginated, createUnit, updateUnit, deleteUnit } from "../../services/unit.service";

import "../../styles/category.css";

const PAGE_SIZE = 8;

function UnitList() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formTarget, setFormTarget] = useState(null); // null = closed, {} = create, {id,...} = edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchUnits = useCallback(
    () => getUnitsPaginated({ search, page: currentPage, pageSize: PAGE_SIZE }),
    [search, currentPage]
  );
  const { data, isLoading, refetch } = useFetch(fetchUnits);

  const units = data?.data || [];
  const total = data?.total || 0;

  const openCreate = () => {
    setFormError("");
    setFormTarget({});
  };

  const openEdit = (unit) => {
    setFormError("");
    setFormTarget(unit);
  };

  const closeForm = () => {
    setFormTarget(null);
    setFormError("");
  };

  const submitForm = async (values) => {
    setFormError("");
    setIsSubmitting(true);
    try {
      if (formTarget?.id) {
        await updateUnit(formTarget.id, values);
      } else {
        await createUnit(values);
      }
      setFormTarget(null);
      refetch();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan unit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (unit) => {
    setDeleteError("");
    setDeleteTarget(unit);
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteUnit(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus unit.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [{ key: "name", header: "Unit" }];

  return (
    <>
      <Header title="Manage Units" />

      <Card
        title="Unit List"
        headerAction={
          <div className="category-toolbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search units..."
            />
            <Button variant="primary" icon={<FiPlus />} onClick={openCreate}>
              Insert New
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={5} />
        ) : units.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={units}
              getRowId={(row) => row.id}
              actionsWidth="100px"
              actionsAlign="center"
              renderActions={(row) => (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<FiEdit2 />}
                    aria-label="Edit unit"
                    onClick={() => openEdit(row)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<FiTrash2 />}
                    aria-label="Hapus unit"
                    onClick={() => openDelete(row)}
                  />
                </>
              )}
            />
            <div className="data-card-list">
              {units.map((unit) => (
                <div key={unit.id} className="data-card">
                  <div className="data-card__top">
                    <div className="data-card__title-group">
                      <p className="data-card__title">{unit.name}</p>
                    </div>
                  </div>
                  <div className="data-card__footer">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiEdit2 />}
                      aria-label="Edit unit"
                      onClick={() => openEdit(unit)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiTrash2 />}
                      aria-label="Hapus unit"
                      onClick={() => openDelete(unit)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalItems={total}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState
            title="Belum ada unit"
            description={
              search
                ? "Tidak ada unit yang cocok dengan pencarian saat ini."
                : "Mulai tambahkan unit pertama untuk digunakan pada bahan menu."
            }
            actionLabel={!search ? "Insert New" : undefined}
            onAction={openCreate}
          />
        )}
      </Card>

      <Modal
        isOpen={Boolean(formTarget)}
        onClose={closeForm}
        title={formTarget?.id ? "Edit Unit" : "Add Unit"}
      >
        {formError && <p className="auth-error">{formError}</p>}
        <UnitForm
          initialValues={formTarget?.id ? formTarget : undefined}
          onSubmit={submitForm}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
          submitLabel="Save Change"
        />
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={closeDelete}
        title="Delete This Unit?"
        footer={
          <>
            <Button variant="secondary" onClick={closeDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        {deleteError ? (
          <p className="auth-error">{deleteError}</p>
        ) : (
          <p className="text-muted">
            The unit &quot;{deleteTarget?.name}&quot; will be permanently deleted. This action
            cannot be undone.
          </p>
        )}
      </Modal>
    </>
  );
}

export default UnitList;