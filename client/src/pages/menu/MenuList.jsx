import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

import useFetch from "../../hooks/useFetch";
import { getMenus, deleteMenu, bulkDeleteMenus, MOCK_CATEGORIES } from "../../services/menu.service";
import { formatCurrency } from "../../utils/formatCurrency";

import "../../styles/menu.css";

const PAGE_SIZE = 9;

function MenuList() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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

  const fetchMenus = useCallback(
    () => getMenus({ search, category: categoryFilter, page: currentPage, pageSize: PAGE_SIZE }),
    [search, categoryFilter, currentPage]
  );
  const { data, isLoading, refetch } = useFetch(fetchMenus);

  const menus = data?.data || [];
  const total = data?.total || 0;

  const categoryOptions = useMemo(
    () => MOCK_CATEGORIES.map((category) => ({ value: category, label: category })),
    []
  );

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? menus.map((menu) => menu.id) : []);
  };

  const openSingleDelete = (id) => setDeleteTarget({ type: "single", ids: [id] });
  const openBulkDelete = () => setDeleteTarget({ type: "bulk", ids: selectedIds });
  const closeDeleteModal = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "bulk") {
        await bulkDeleteMenus(deleteTarget.ids);
      } else {
        await deleteMenu(deleteTarget.ids[0]);
      }
      setSelectedIds((prev) => prev.filter((id) => !deleteTarget.ids.includes(id)));
      setDeleteTarget(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (row) => (
        <div
          className="menu-thumbnail"
          style={row.imageUrl ? { backgroundImage: `url(${row.imageUrl})` } : undefined}
        >
          {!row.imageUrl && <GiKnifeFork />}
        </div>
      ),
    },
    { key: "name", header: "Menu" },
    {
      key: "category",
      header: "Category",
      render: (row) => <Badge variant="neutral">{row.category}</Badge>,
    },
    {
      key: "description",
      header: "Description",
      render: (row) => <span className="menu-description-cell">{row.description}</span>,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (row) => formatCurrency(row.price),
    },
  ];

  const hasActiveFilter = Boolean(search || categoryFilter);

  return (
    <>
      <Header title="Manage Menus" />

      <Card
        title="Menu Inventory"
        headerAction={
          <div className="menu-toolbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search menus..."
            />
            <Select
              value={categoryFilter}
              onChange={(event) => handleCategoryChange(event.target.value)}
              options={categoryOptions}
              placeholder="All Categories"
            />
            <Button
              variant="danger"
              disabled={selectedIds.length === 0}
              onClick={openBulkDelete}
              icon={<FiTrash2 />}
            >
              Bulk Delete
            </Button>
            <Link to="/menu/create">
              <Button variant="primary" icon={<FiPlus />}>
                Insert New
              </Button>
            </Link>
          </div>
        }
      >
        {isLoading ? (
          <LoadingSkeleton variant="table-row" count={6} />
        ) : menus.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={menus}
              selectable
              selectedIds={selectedIds}
              onSelectRow={toggleSelectRow}
              onSelectAll={toggleSelectAll}
              getRowId={(row) => row.id}
              renderActions={(row) => (
                <>
                  <Link to={`/menu/${row.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiEdit2 />}
                      aria-label="Edit menu"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<FiTrash2 />}
                    aria-label="Hapus menu"
                    onClick={() => openSingleDelete(row.id)}
                  />
                </>
              )}
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
            title="Belum ada menu"
            description={
              hasActiveFilter
                ? "Tidak ada menu yang cocok dengan pencarian/filter saat ini."
                : "Mulai tambahkan menu pertama untuk foodcourt ini."
            }
            actionLabel={!hasActiveFilter ? "Insert New" : undefined}
            onAction={() => navigate("/menu/create")}
          />
        )}
      </Card>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        title={deleteTarget?.type === "bulk" ? "Hapus Menu Terpilih?" : "Hapus Menu Ini?"}
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
          {deleteTarget?.type === "bulk"
            ? `${deleteTarget?.ids.length} menu akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
            : "Menu ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."}
        </p>
      </Modal>
    </>
  );
}

export default MenuList;