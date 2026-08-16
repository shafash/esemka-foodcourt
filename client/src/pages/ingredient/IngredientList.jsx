import { useCallback, useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import SearchBar from "../../components/common/SearchBar";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import IngredientDrawer from "../../components/ingredient/IngredientDrawer";

import useFetch from "../../hooks/useFetch";
import { getMenus } from "../../services/menu.service";
import { getCategoryOptions } from "../../services/cetagory.service";
import { getIngredientCountsByMenuIds } from "../../services/ingredient.service";

import "../../styles/menu.css";
import "../../styles/ingredient.css";

const PAGE_SIZE = 8;

function IngredientList() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [countVersion, setCountVersion] = useState(0);

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
  const { data, isLoading } = useFetch(fetchMenus);
  const { data: categoryOptions } = useFetch(getCategoryOptions);

  const menus = data?.data || [];
  const total = data?.total || 0;

  const menuIds = menus.map((menu) => menu.id);
  const menuIdsKey = menuIds.join(",");

  const fetchCounts = useCallback(
    () => getIngredientCountsByMenuIds(menuIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menuIdsKey, countVersion]
  );
  const { data: countsMap } = useFetch(fetchCounts);

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const columns = [
  {
    key: "name",
    header: "Menu Name",
    render: (row) => (
      <div className="ingredient-menu-cell">
        <span
          className="ingredient-menu-cell__thumb"
          style={
            row.imageUrl
              ? { backgroundImage: `url(${row.imageUrl})` }
              : undefined
          }
        >
          {!row.imageUrl && <GiKnifeFork />}
        </span>

        <span>
          <span className="ingredient-menu-cell__name">
            {row.name}
          </span>

          <span className="ingredient-menu-cell__count">
            {countsMap?.[row.id] ?? 0} ingredients configured
          </span>
        </span>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    width: "220px",
    render: (row) => (
      <Badge variant="neutral">
        {row.category || "-"}
      </Badge>
    ),
  },
];

  return (
    <>
      <Header title="Menu Ingredients" />

      <Card title="Menu Selection">
        <div className="ingredient-toolbar">
          <SearchBar
              className="ingredient-search"
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search menus..."
            />
          <Select
              className="ingredient-filter"
              value={categoryFilter}
              onChange={(event) => handleCategoryChange(event.target.value)}
              options={categoryOptions || []}
              placeholder="Filter"
            />
        </div>

        {isLoading ? (
          <>
            <div className="skeleton-table-rows">
              <LoadingSkeleton variant="table-row" count={6} />
            </div>
            <div className="skeleton-card-list">
              <LoadingSkeleton variant="card" count={4} />
            </div>
          </>
        ) : menus.length > 0 ? (
          <>
            <Table
              key={countVersion}
              columns={columns}
              data={menus}
              getRowId={(row) => row.id}
              actionsAlign="center"
              actionsWidth="220px"
              renderActions={(row) => (
                <Button
                  variant={activeMenu?.id === row.id ? "primary" : "secondary"}
                  size="sm"
                  icon={<FiEdit3 />}
                  onClick={() => setActiveMenu(row)}
                >
                  Edit Ingredients
                </Button>
              )}
            />

            <div className="data-card-list">
              {menus.map((menu) => (
                <div key={menu.id} className="data-card">
                  <div className="data-card__top">
                    <div className="data-card__heading">
                      <span
                        className="data-card__thumb"
                        style={menu.imageUrl ? { backgroundImage: `url(${menu.imageUrl})` } : undefined}
                      >
                        {!menu.imageUrl && <GiKnifeFork />}
                      </span>
                      <div className="data-card__title-group">
                        <p className="data-card__title">{menu.name}</p>
                        <span className="data-card__id">
                          {countsMap?.[menu.id] ?? 0} ingredients configured
                        </span>
                      </div>
                    </div>
                    <Badge variant="neutral">{menu.category || "-"}</Badge>
                  </div>

                  <div className="data-card__footer data-card__footer--stretch">
                    <Button
                      variant={activeMenu?.id === menu.id ? "primary" : "secondary"}
                      size="sm"
                      icon={<FiEdit3 />}
                      onClick={() => setActiveMenu(menu)}
                    >
                      Edit Ingredients
                    </Button>
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
            title="Belum ada menu"
            description="Tambahkan menu terlebih dahulu di Manage Menus sebelum mengatur bahan baku."
          />
        )}
      </Card>

      <IngredientDrawer
        menu={activeMenu}
        onClose={() => setActiveMenu(null)}
        onSaved={() => setCountVersion((v) => v + 1)}
      />
    </>
  );
}

export default IngredientList;