import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import SearchBar from "../../components/common/SearchBar";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import CategoryForm from "../../components/category/CategoryForm";

import useFetch from "../../hooks/useFetch";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/cetagory.service";

import "../../styles/category.css";

const PAGE_SIZE = 8;

function CategoryList() {
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

  const fetchCategories = useCallback(
    () => getCategories({ search, page: currentPage, pageSize: PAGE_SIZE }),
    [search, currentPage]
  );
  const { data, isLoading, refetch } = useFetch(fetchCategories);

  const categories = data?.data || [];
  const total = data?.total || 0;

  const openCreate = () => {
    setFormError("");
    setFormTarget({});
  };

  const openEdit = (category) => {
    setFormError("");
    setFormTarget(category);
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
        await updateCategory(formTarget.id, values);
      } else {
        await createCategory(values);
      }
      setFormTarget(null);
      refetch();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (category) => {
    setDeleteError("");
    setDeleteTarget(category);
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
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus kategori.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: "name", header: "Category" },
    {
      key: "menuCount",
      header: "Menus",
      align: "center",
      width: "160px",
      render: (row) => <Badge variant="neutral">{row.menuCount ?? 0}</Badge>,
    },
  ];

  return (
    <>
      <Header title="Manage Categories" />

      <Card
        title="Category List"
        headerAction={
          <div className="category-toolbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search categories..."
            />
            <Button variant="primary" icon={<FiPlus />} onClick={openCreate}>
              Insert New
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={5} />
        ) : categories.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={categories}
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
                    aria-label="Edit kategori"
                    onClick={() => openEdit(row)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<FiTrash2 />}
                    aria-label="Hapus kategori"
                    onClick={() => openDelete(row)}
                  />
                </>
              )}
            />
                        <div className="data-card-list">
              {categories.map((category) => (
                <div key={category.id} className="data-card">
                  <div className="data-card__top">
                    <div className="data-card__title-group">
                      <p className="data-card__title">{category.name}</p>
                    </div>
                    <Badge variant="neutral">{category.menuCount ?? 0} Menus</Badge>
                  </div>
                  <div className="data-card__footer">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiEdit2 />}
                      aria-label="Edit kategori"
                      onClick={() => openEdit(category)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiTrash2 />}
                      aria-label="Hapus kategori"
                      onClick={() => openDelete(category)}
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
            title="Belum ada kategori"
            description={
              search
                ? "Tidak ada kategori yang cocok dengan pencarian saat ini."
                : "Mulai tambahkan kategori pertama untuk mengelompokkan menu."
            }
            actionLabel={!search ? "Insert New" : undefined}
            onAction={openCreate}
          />
        )}
      </Card>

      <Modal
        isOpen={Boolean(formTarget)}
        onClose={closeForm}
        title={formTarget?.id ? "Edit Category" : "Add Category"}
      >
        {formError && <p className="auth-error">{formError}</p>}
        <CategoryForm
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
        title="Hapus Kategori Ini?"
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
            Kategori &quot;{deleteTarget?.name}&quot; akan dihapus permanen. Tindakan ini tidak
            dapat dibatalkan.
          </p>
        )}
      </Modal>
    </>
  );
}

export default CategoryList;