import { useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";

function ImageUploadField({ label, value, onChange, onError, error, hint }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      onError?.("Ukuran file maksimal 2MB.");
      event.target.value = "";
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onChange?.(file, previewUrl);
  };

  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}

      <button
        type="button"
        className={`image-upload ${error ? "image-upload--error" : ""} ${value ? "image-upload--filled" : ""}`.trim()}
        onClick={() => inputRef.current?.click()}
        style={value ? { backgroundImage: `url(${value})` } : undefined}
        aria-label="Unggah gambar menu"
      >
        <span className="image-upload__placeholder">
          <FiUploadCloud size={20} />
        </span>
        {!value && (
          <span className="image-upload__copy">
            <strong>Upload Photo</strong>
            <span>JPG/PNG, maks 2MB</span>
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="image-upload__input"
          onChange={handleFileChange}
        />
      </button>

      {error ? (
        <span className="field__error">{error}</span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

export default ImageUploadField;