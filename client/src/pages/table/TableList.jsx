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
import TableForm from "../../components/table/TableForm";

import useFetch from "../../hooks/useFetch";
import {
  getTablesPaginated,
  createTable,
  updateTable,
  deleteTable,
} from "../../services/table.service";

import "../../styles/category.css";

const PAGE_SIZE = 8;

function TableList() {
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

  const fetchTables = useCallback(
    () => getTablesPaginated({ search, page: currentPage, pageSize: PAGE_SIZE }),
    [search, currentPage]
  );
  const { data, isLoading, refetch } = useFetch(fetchTables);

  const tables = data?.data || [];
  const total = data?.total || 0;

  const openCreate = () => {
    setFormError("");
    setFormTarget({});
  };

  const openEdit = (table) => {
    setFormError("");
    setFormTarget(table);
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
        await updateTable(formTarget.id, values);
      } else {
        await createTable(values);
      }
      setFormTarget(null);
      refetch();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan meja.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDelete = (table) => {
    setDeleteError("");
    setDeleteTarget(table);
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
      await deleteTable(deleteTarget.id);
      setDeleteTarget(null);
      if (tables.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        refetch();
      }
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus meja.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [{ key: "name", header: "Table" }];

  return (
    <>
      <Header title="Manage Tables" />

      <Card
        title="Table List"
        headerAction={
          <div className="category-toolbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search tables..."
            />
            <Button variant="primary" icon={<FiPlus />} onClick={openCreate}>
              Insert New
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={5} />
        ) : tables.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={tables}
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
                    aria-label="Edit meja"
                    onClick={() => openEdit(row)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<FiTrash2 />}
                    aria-label="Hapus meja"
                    onClick={() => openDelete(row)}
                  />
                </>
              )}
            />
            <div className="data-card-list">
              {tables.map((table) => (
                <div key={table.id} className="data-card">
                  <div className="data-card__top">
                    <div className="data-card__title-group">
                      <p className="data-card__title">Table {table.name}</p>
                    </div>
                  </div>
                  <div className="data-card__footer">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiEdit2 />}
                      aria-label="Edit meja"
                      onClick={() => openEdit(table)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiTrash2 />}
                      aria-label="Hapus meja"
                      onClick={() => openDelete(table)}
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
            title="Belum ada meja"
            description={
              search
                ? "Tidak ada meja yang cocok dengan pencarian saat ini."
                : "Mulai tambahkan meja pertama untuk digunakan pada reservasi."
            }
            actionLabel={!search ? "Insert New" : undefined}
            onAction={openCreate}
          />
        )}
      </Card>

      <Modal
        isOpen={Boolean(formTarget)}
        onClose={closeForm}
        title={formTarget?.id ? "Edit Table" : "Add Table"}
      >
        {formError && <p className="auth-error">{formError}</p>}
        <TableForm
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
        title="Delete This Table?"
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
            Table &quot;{deleteTarget?.name}&quot; will be permanently deleted. If this table
            still has reservation history, the deletion may be rejected by the system.
          </p>
        )}
      </Modal>
    </>
  );
}

export default TableList;