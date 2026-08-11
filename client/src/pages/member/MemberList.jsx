import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiDownload, FiEdit2, FiTrash2 } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

import useFetch from "../../hooks/useFetch";
import { getMembers, bulkDeleteMembers } from "../../services/user.service";
import { formatDate } from "../../utils/formatDate";

import "../../styles/member.css";

const PAGE_SIZE = 8;

function MemberList() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchMembers = useCallback(
    () => getMembers({ search, page: currentPage, pageSize: PAGE_SIZE }),
    [search, currentPage]
  );
  const { data, isLoading, refetch } = useFetch(fetchMembers);

  const members = data?.data || [];
  const total = data?.total || 0;

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? members.map((member) => member.id) : []);
  };

  const openBulkDelete = () => setDeleteTarget({ ids: selectedIds });
  const closeDeleteModal = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await bulkDeleteMembers(deleteTarget.ids);
      setSelectedIds((prev) => prev.filter((id) => !deleteTarget.ids.includes(id)));
      setDeleteTarget(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = () => {
    if (selectedIds.length !== 1) return;
    navigate(`/members/${selectedIds[0]}/edit`);
  };

  const columns = useMemo(
    () => [
      {
        key: "firstName",
        header: "First Name",
        render: (row) => <span className="table-cell__primary">{row.firstName}</span>,
      },
      {
        key: "lastName",
        header: "Last Name",
        render: (row) => <span className="table-cell__primary">{row.lastName}</span>,
      },
      {
        key: "email",
        header: "Email Address",
        render: (row) => row.email,
      },
      {
        key: "phone",
        header: "Phone",
        render: (row) => row.phone,
      },
      {
        key: "memberSince",
        header: "Member Since",
        render: (row) => formatDate(row.memberSince),
      },
    ],
    []
  );

  return (
    <>
      <Header
        title="Manage Members"
      />

      <Card>
        <div className="member-toolbar">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search members by name or email..."
          />

          <div className="member-toolbar__actions">
            {selectedIds.length > 0 && (
              <span className="member-toolbar__count">{selectedIds.length} selected</span>
            )}
            <Button variant="secondary" icon={<FiDownload />}>
              Export
            </Button>
            <Link to="/members/create">
              <Button variant="primary" icon={<FiPlus />}>
                Insert
              </Button>
            </Link>
            <Button
              variant="secondary"
              icon={<FiEdit2 />}
              disabled={selectedIds.length !== 1}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button
              variant="danger"
              icon={<FiTrash2 />}
              disabled={selectedIds.length === 0}
              onClick={openBulkDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={6} />
        ) : members.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={members}
              selectable
              selectedIds={selectedIds}
              onSelectRow={toggleSelectRow}
              onSelectAll={toggleSelectAll}
              onRowClick={(row) => toggleSelectRow(row.id)}
              getRowId={(row) => row.id}
            />
            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalItems={total}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState
            title="Belum ada member"
            description={
              search
                ? "Tidak ada member yang cocok dengan pencarian saat ini."
                : "Mulai tambahkan member pertama untuk foodcourt ini."
            }
            actionLabel={!search ? "Insert New" : undefined}
            onAction={() => navigate("/members/create")}
          />
        )}
      </Card>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        title="Hapus Member Terpilih?"
        footer={
          <>
            <Button variant="secondary" onClick={closeDeleteModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-muted">
          {deleteTarget?.ids.length} member akan dihapus permanen. Tindakan ini tidak dapat
          dibatalkan.
        </p>
      </Modal>
    </>
  );
}

export default MemberList;
