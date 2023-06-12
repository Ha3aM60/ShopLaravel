import { useFormik } from "formik";
import { ICategorySelect, IProductCreate } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import { useEffect, useState } from "react";
import http from "../../../http";
import { APP_ENV } from "../../../env";


const ProductCreatePage = () => {
  const [categories, setCategories] = useState<ICategorySelect[]>([]);

  useEffect(() => {
    http
      .get<ICategorySelect[]>("api/category/select")
      .then((resp) => setCategories(resp.data));
  }, []);


  const initValues: IProductCreate = {
    name: "",
    price: 0,
    category_id: 0,
    images: [],
    description: ""
  };

  const createSchema = yup.object({
    name: yup.string().required("Enter name!!"),
    price: yup
      .number()
      .min(0.00001, "Price must be greater than 0")
      .required("Enter price!!"),
    category_id: yup.number().min(1, "Enter category!!"),
    description: yup.string().required("Enter description!!"),
    images: yup
      .array()
      .of(yup.number())
      .min(1, "At least one photo for the product")
      .required("Choose at least one photo"),
  });

  const onSubmitFormikData = (values: IProductCreate) => {
    console.log("Formik valid data send server", values);
  }

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: createSchema,
    onSubmit: onSubmitFormikData
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = formik;

  const onSelectImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.addEventListener("change", (e: any) => {
      const files = e.target.files;
      if (files) {
        const file = files[0];
        setFieldValue("images", [...values.images, file]);
        /* console.log("Select file ", file); */
      }
    });
    input.click();
  };

  const onDeleteImage = (index: number) => {
    const updatedImages = [...values.images];
    updatedImages.splice(index, 1);
    setFieldValue("images", updatedImages);
  };

  return (
    <>
      <h1 className="text-center">Add product</h1>
      <form className="col-md-6 offset-md-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={classNames("form-control", {
              "is-invalid": errors.name && touched.name,
            })}
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && touched.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="category_id" className="form-label">
            Choose category
          </label>
          <select
            className={classNames("form-select", {
              "is-invalid": errors.category_id && touched.category_id,
            })}
            defaultValue={values.category_id}
            onChange={handleChange}
            name="category_id"
            id="category_id"
          >
            <option value={0} disabled>
              Choose category
            </option>
            {categories.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {errors.category_id && touched.category_id && (
            <div className="invalid-feedback">{errors.category_id}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="text"
            className={classNames("form-control", {
              "is-invalid": errors.price && touched.price,
            })}
            id="price"
            name="price"
            value={values.price}
            onChange={handleChange}
          />
          {errors.price && touched.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className={classNames("form-control", {
              "is-invalid": errors.description && touched.description,
            })}
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
          {errors.description && touched.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-md-3">
              <img
                className="img-fluid"
                src={APP_ENV.BASE_URL + "uploads/plus.png"}
                alt="Оберіть фото"
                style={{ cursor: "pointer" }}
                onClick={onSelectImage}
              />
            </div>
            {values.images.map((img, index) => (
              <div className="col-md-3" key={index}>
                <div>
                  <button className="btn btn-danger" onClick={() => onDeleteImage(index)}>X</button>
                </div>
                <img
                  className="img-fluid"
                  src={URL.createObjectURL(img)}
                  alt="Оберіть фото"
                  style={{ cursor: "pointer" }}
                  onClick={onSelectImage}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </>
  )
}
export default ProductCreatePage;


