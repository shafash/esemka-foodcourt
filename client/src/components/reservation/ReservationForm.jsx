import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";
import Loader from "../common/Loader";
import Card from "../common/Card";
import FloorPlan from "./FloorPlan";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getTables } from "../../services/reservation.service";
import { getMenus } from "../../services/menu.service";
import { getCategoryOptions } from "../../services/cetagory.service";
import { formatCurrency } from "../../utils/formatCurrency";

const RESERVATION_FEE = 50000;
const TAX_RATE = 0.1;

function ReservationForm({ onSubmit, isSubmitting = false, submitError }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: tables, isLoading: isTablesLoading } = useFetch(getTables);

  const [selectedTable, setSelectedTable] = useState(null);
  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: "",
      guests: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const fetchMenus = () => getMenus({ search: menuSearch, page: 1, pageSize: 6 });
  const { data: menuData } = useFetch(fetchMenus);
  const { data: categoryOptions } = useFetch(getCategoryOptions);

  const menuResults = menuData?.data || [];

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
      memberId: user?.id,
      date: values.date,
      guests: Number(values.guests),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
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
        <div className="reserve-step__title" style={{ padding: "var(--space-5) var(--space-5) 0" }}>
          <span className="reserve-step__badge">2</span> Select Table
        </div>
        {isTablesLoading ? (
          <Loader centered label="Memuat denah meja..." />
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
          <p className="reserve-step__title" style={{ marginRight: "auto" }}>
            <span className="reserve-step__badge">4</span> Pre-order Menu (Optional)
          </p>
          <SearchBar value={menuSearch} onChange={setMenuSearch} placeholder="Search Menu..." />
          <Select options={categoryOptions || []} placeholder="All Categories" />
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {menuResults.map((menu) => (
              <Button
                key={menu.id}
                type="button"
                variant="secondary"
                size="sm"
                icon={<FiPlus />}
                onClick={() => addMenuItem(menu)}
              >
                {menu.name}
              </Button>
            ))}
          </div>
        </div>

        {orderItems.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Menu</th>
                <th style={{ textAlign: "center" }}>Quantity</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
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
                  <td style={{ textAlign: "right" }}>{formatCurrency(item.price)}</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(item.price * item.qty)}</td>
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
        )}
      </div>

      <div className="reserve-summary">
        <div className="reserve-summary__totals">
          <span>
            Reservation fee
            <strong>{formatCurrency(RESERVATION_FEE)}</strong>
          </span>
          <span>
            Menu total
            <strong>{formatCurrency(menuTotal)}</strong>
          </span>
          <span>
            Grand Total
            <strong>{formatCurrency(grandTotal)}</strong>
          </span>
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
        <p className="auth-error" style={{ gridColumn: "1 / -1" }}>
          {formError || submitError}
        </p>
      )}
    </form>
  );
}

export default ReservationForm;
