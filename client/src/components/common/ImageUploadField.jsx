import { useRef } from "react";
import { FiUpload } from "react-icons/fi";

function ImageUploadField({ label, value, onChange, error, hint }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onChange?.(file, previewUrl);
  };

  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}

      <button
        type="button"
        className={`image-upload ${error ? "image-upload--error" : ""}`.trim()}
        onClick={() => inputRef.current?.click()}
        style={value ? { backgroundImage: `url(${value})` } : undefined}
        aria-label="Unggah gambar menu"
      >
        {!value && (
          <span className="image-upload__placeholder">
            <FiUpload size={20} />
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