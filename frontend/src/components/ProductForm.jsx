import { useState, useEffect } from "react";
import "../styles/ProductForm.css";

export default function ProductForm({ product, onSubmit, onCancel }) {
  // Load saved form data from localStorage or use defaults
  const getSavedFormData = () => {
    if (product) return null; // If editing, don't use saved data
    
    const saved = localStorage.getItem("productFormDraft");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [formData, setFormData] = useState(getSavedFormData() || {
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    tags: "",
    discount: "0",
    image_url: "",
    additional_images: "[]",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        brand: product.brand || "",
        tags: product.tags || "",
        discount: product.discount || "0",
        image_url: product.image_url || "",
        additional_images: product.additional_images || "[]",
      });
    }
  }, [product]);

  // Save form data to localStorage when it changes (only for new products)
  useEffect(() => {
    if (!product) {
      localStorage.setItem("productFormDraft", JSON.stringify(formData));
    }
  }, [formData, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    const discount = parseFloat(formData.discount);
    if (discount < 0 || discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    // Validate additional_images is valid JSON
    if (formData.additional_images) {
      try {
        JSON.parse(formData.additional_images);
      } catch (e) {
        newErrors.additional_images = "Must be valid JSON array (e.g., [\"url1\", \"url2\"])";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discount: parseFloat(formData.discount),
    };

    const success = await onSubmit(product?.id, submitData);

    setSubmitting(false);

    if (success) {
      // Reset form if adding new product
      if (!product) {
        localStorage.removeItem("productFormDraft"); // Clear saved draft
        setFormData({
          title: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          brand: "",
          tags: "",
          discount: "0",
          image_url: "",
          additional_images: "[]",
        });
      }
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Title */}
        <div className="form-group full-width">
          <label htmlFor="title">
            Product Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product"
            rows="4"
            className={errors.description ? "error" : ""}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">
            Price ($) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.price ? "error" : ""}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        {/* Stock */}
        <div className="form-group">
          <label htmlFor="stock">
            Stock Quantity <span className="required">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={errors.stock ? "error" : ""}
          />
          {errors.stock && <span className="error-text">{errors.stock}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Electronics, Clothing"
          />
        </div>

        {/* Brand */}
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand name"
          />
        </div>

        {/* Discount */}
        <div className="form-group">
          <label htmlFor="discount">Discount (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="0"
            step="0.01"
            min="0"
            max="100"
            className={errors.discount ? "error" : ""}
          />
          {errors.discount && <span className="error-text">{errors.discount}</span>}
        </div>

        {/* Tags */}
        <div className="form-group full-width">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Comma-separated tags (e.g., featured, sale, new)"
          />
          <small>Separate tags with commas</small>
        </div>

        {/* Image URL */}
        <div className="form-group full-width">
          <label htmlFor="image_url">Main Image URL</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {formData.image_url && (
            <div className="image-preview">
              <img src={formData.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div className="form-group full-width">
          <label htmlFor="additional_images">Additional Images (JSON Array)</label>
          <textarea
            id="additional_images"
            name="additional_images"
            value={formData.additional_images}
            onChange={handleChange}
            placeholder='["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
            rows="2"
            className={errors.additional_images ? "error" : ""}
          />
          {errors.additional_images && <span className="error-text">{errors.additional_images}</span>}
          <small>Enter as JSON array format</small>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? "Saving..." : product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
