import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiAlertTriangle } from "react-icons/fi";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";
import Loader from "../common/Loader";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import FloorPlan from "./FloorPlan";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import useResponsiveColumns from "../../hooks/useResponsiveColumns";
import { getTables } from "../../services/reservation.service";
import { getMenus } from "../../services/menu.service";
import { getCategoryOptions } from "../../services/cetagory.service";
import { formatCurrency } from "../../utils/formatCurrency";

const RESERVATION_FEE = 50000;
const TAX_RATE = 0.1;

function ReservationForm({ onSubmit, isSubmitting = false, submitError }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedTable, setSelectedTable] = useState(null);
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [menuPage, setMenuPage] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  const menuPageSize = useResponsiveColumns();

  useEffect(() => {
    setMenuPage(1);
  }, [menuPageSize]);

  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: "",
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      guests: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const selectedDate = watch("date");
  const selectedTime = watch("time");

  const fetchTables = useCallback(
    () => getTables(selectedDate, selectedTime),
    [selectedDate, selectedTime]
  );
  const {
    data: tables,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useFetch(fetchTables);

  const fetchMenus = useCallback(
    () =>
      getMenus({
        search: menuSearch,
        category: menuCategory,
        page: menuPage,
        pageSize: menuPageSize,
      }),
    [menuSearch, menuCategory, menuPage, menuPageSize]
  );
  const { data: menuData, isLoading: isMenuLoading } = useFetch(fetchMenus);
  const { data: categoryOptions } = useFetch(getCategoryOptions);

  const menuResults = menuData?.data || [];
  const menuResultsTotal = menuData?.total || 0;

  const handleMenuSearch = (value) => {
    setMenuSearch(value);
    setMenuPage(1);
  };

  const handleMenuCategory = (value) => {
    setMenuCategory(value);
    setMenuPage(1);
  };

  const toggleUseAccountInfo = (checked) => {
    setUseAccountInfo(checked);
    if (checked && user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    }
  };

  const addMenuItem = (menu) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { menuId: menu.id, name: menu.name, price: menu.price, qty: 1 }];
    });
  };

  const changeQty = (menuId, delta) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.menuId === menuId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter(Boolean)
    );
  };

  const removeItem = (menuId) => {
    setOrderItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const menuTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [orderItems]
  );
  const tax = Math.round(menuTotal * TAX_RATE);
  const grandTotal = menuTotal + tax + RESERVATION_FEE;

  const submitHandler = (values) => {
    setFormError("");

    if (!selectedTable) {
      setFormError("Silakan pilih meja pada denah terlebih dahulu.");
      return;
    }
    if (orderItems.length === 0) {
      setFormError("Tambahkan minimal satu menu untuk pre-order.");
      return;
    }

    onSubmit({
      tableId: selectedTable.id,
      tableDbId: selectedTable.tableDbId,
      memberId: user?.id,
      useAccountData: useAccountInfo,
      date: values.date,
      guests: Number(values.guests),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      time: values.time,
      items: orderItems,
    });
  };

  return (
    <form className="reserve-page" onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="reserve-page__steps">
        <div className="reserve-step">
          <p className="reserve-step__title">
            <span className="reserve-step__badge">1</span> Reservation Details
          </p>
          <Input
            label="Reservation Date"
            type="date"
            error={errors.date?.message}
            {...register("date", { required: "Tanggal reservasi wajib diisi." })}
          />
          <Input
            label="Reservation Time"
            type="time"
            error={errors.time?.message}
            {...register("time", { required: "Waktu reservasi wajib diisi." })}
          />
          <Input
            label="Number of Guests"
            type="number"
            min="1"
            placeholder="e.g. 4"
            error={errors.guests?.message}
            {...register("guests", {
              required: "Jumlah tamu wajib diisi.",
              min: { value: 1, message: "Minimal 1 tamu." },
            })}
          />
        </div>

        <div className="reserve-step">
          <p className="reserve-step__title">
            <span className="reserve-step__badge">3</span> Guest Information
          </p>
          <div className="form-row">
            <Input
              label="First Name"
              error={errors.firstName?.message}
              {...register("firstName", { required: "Nama depan wajib diisi." })}
            />
            <Input
              label="Last Name"
              error={errors.lastName?.message}
              {...register("lastName", { required: "Nama belakang wajib diisi." })}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register("email", { required: "Email wajib diisi." })}
          />
          <Input
            label="Phone Number"
            error={errors.phone?.message}
            {...register("phone", { required: "Nomor telepon wajib diisi." })}
          />
          <label className="reserve-step__checkbox">
            <input
              type="checkbox"
              checked={useAccountInfo}
              onChange={(event) => toggleUseAccountInfo(event.target.checked)}
            />
            Use my account information
          </label>
        </div>
      </div>

      <Card noPadding className="reserve-page__floor">
        <div className="reserve-step__title reserve-step__title--panel">
          <span className="reserve-step__badge">2</span> Select Table
        </div>
        {isTablesLoading ? (
          <Loader centered label="Memuat denah meja..." />
        ) : tablesError ? (
          <EmptyState
            icon={<FiAlertTriangle size={22} />}
            title="Unable to load availability"
            description={tablesError}
            actionLabel="Retry"
            onAction={refetchTables}
          />
        ) : (
          <FloorPlan
            tables={tables || []}
            selectedId={selectedTable?.id}
            onSelect={(table) => setSelectedTable(table)}
          />
        )}
      </Card>

      <div className="reserve-order">
                <div className="reserve-order__toolbar">
          <p className="reserve-step__title reserve-order__toolbar-title">
            <span className="reserve-step__badge">4</span> Pre-order Menu
          </p>
        </div>

        <div className="reserve-order__filters">
          <SearchBar
            className="reserve-order__search"
            value={menuSearch}
            onChange={handleMenuSearch}
            placeholder="Search Menu..."
          />
          <Select
            className="reserve-order__filter"
            options={categoryOptions || []}
            placeholder="All Categories"
            value={menuCategory}
            onChange={(event) => handleMenuCategory(event.target.value)}
          />
        </div>

                {isMenuLoading && menuResults.length === 0 ? (
          <Loader centered label="Memuat menu..." />
        ) : menuResults.length === 0 ? (
          <EmptyState title="Menu tidak ditemukan" description="Coba kata kunci atau kategori lain." />
        ) : (
          <>
          <div className={`reserve-order__grid${isMenuLoading ? " is-loading" : ""}`}>
              {menuResults.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  className="menu-card"
                  onClick={() => addMenuItem(menu)}
                >
                  <span className="menu-card__image">
                    {menu.imageUrl ? (
                      <img src={menu.imageUrl} alt={menu.name} />
                    ) : (
                      <span className="menu-card__placeholder">No Image</span>
                    )}
                  </span>
                  <span className="menu-card__name">{menu.name}</span>
                  {menu.description && (
                    <span className="menu-card__description">{menu.description}</span>
                  )}
                  <span className="menu-card__price">{formatCurrency(menu.price)}</span>
                </button>
              ))}
            </div>

            <Pagination
              currentPage={menuPage}
              pageSize={menuPageSize}
              totalItems={menuResultsTotal}
              onPageChange={setMenuPage}
            />
          </>
        )}

        {orderItems.length > 0 && (
          <div className="reserve-order__table-wrapper">
          <table className="table reserve-order__table">
            <thead>
              <tr>
                <th>Menu</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Price</th>
                <th className="text-right">Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.menuId}>
                  <td>{item.name}</td>
                  <td>
                    <div className="reserve-order__qty">
                      <button
                        type="button"
                        className="reserve-order__qty-btn"
                        onClick={() => changeQty(item.menuId, -1)}
                        aria-label="Kurangi jumlah"
                      >
                        <FiMinus size={12} />
                      </button>
                      {item.qty}
                      <button
                        type="button"
                        className="reserve-order__qty-btn"
                        onClick={() => changeQty(item.menuId, 1)}
                        aria-label="Tambah jumlah"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="text-right">{formatCurrency(item.price)}</td>
                  <td className="text-right">{formatCurrency(item.price * item.qty)}</td>
                  <td>
                    <button
                      type="button"
                      className="reserve-order__remove"
                      onClick={() => removeItem(item.menuId)}
                      aria-label={`Hapus ${item.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <div className="reserve-summary">
        <div className="reserve-summary__totals">
          <div className="reserve-summary__row">
            <span>Reservation fee</span>
            <strong>{formatCurrency(RESERVATION_FEE)}</strong>
          </div>
          <div className="reserve-summary__row">
            <span>Menu total</span>
            <strong>{formatCurrency(menuTotal)}</strong>
          </div>
          <div className="reserve-summary__row reserve-summary__row--total">
            <span>Grand Total</span>
            <strong>{formatCurrency(grandTotal)}</strong>
          </div>
        </div>

        <div className="reserve-summary__actions">
          <Button type="button" variant="secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Reservation"}
          </Button>
        </div>
      </div>

      {(formError || submitError) && (
        <p className="auth-error reserve-page__error">{formError || submitError}</p>
      )}
    </form>
  );
}

export default ReservationForm;