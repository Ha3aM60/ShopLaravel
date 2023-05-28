import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { IRegister } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import { ChangeEvent } from "react";
import http from "../../../http";


const RegisterPage = () => {

    const navigator = useNavigate();

    const initValues: IRegister = {
        image: null,
        email: "",
        lastName: "",
        name: "",
        phone: "",
        password: "",
        password_confirmation: ""
    };
    const createSchema = yup.object({
        name: yup.string().required("Enter name!"),
        email: yup.string().required("Enter email!"),
        phone: yup.string().required("Enter phone!"),
        password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters'),
            password_confirmation: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
    })

    const onSubmitFormikData = (values: IRegister) => {
        console.log("Formik send data", values);
        http.post("api/auth/register", values, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(resp => {
                console.log("Create date in server", resp);
                navigator("/login");
            }).catch((bad) => {
                console.log("Bad request", bad);
            });

    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData
    });

    const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            formik.setFieldValue(e.target.name, file);
        }
    };

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
        <>
            <h1 className="text-center">Sign up</h1>
            <form className="col-md-6 offset-md-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image URL
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={onImageChangeHandler}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.email && touched.email })}
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                    />
                    {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.lastName && touched.lastName })}
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && touched.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.name && touched.name })}
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                    />
                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.phone && touched.phone })}
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && touched.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.password && touched.password })}
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password_confirmation" className="form-label">
                        Password confirmation
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control", { "is-invalid": errors.password_confirmation && touched.password_confirmation })}
                        id="password_confirmation"
                        name="password_confirmation"
                        value={values.password_confirmation}
                        onChange={handleChange}
                    />
                    {errors.password_confirmation && touched.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                </div>

                <button type="submit" className="btn btn-primary">
                    Sign up
                </button>
            </form>
        </>
    );
}

export default RegisterPage;