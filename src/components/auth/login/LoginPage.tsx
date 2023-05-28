import { useNavigate } from "react-router-dom";
import { ILogin, ILoginResult, IUser } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import http from "../../../http";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthUserActionType } from "../types";
import jwtDecode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const initValues: ILogin = {
        email: "",
        password: "",
    };
    
    const [message, setMessage] = useState<string>("");

    const createSchema = yup.object({
        email: yup
            .string()
            .required("Вкажіть назву")
            .email("Пошта вказана не вірно"),
        password: yup.string().required("Вкажіть опис"),
    });

    const onSubmitFormikData = async (values: ILogin) => {
        try {
            console.log("Formik send data", values);
            const result = await http.post<ILoginResult>("api/auth/login", values);
            const { access_token } = result.data;
            const user = jwtDecode(access_token) as IUser;
            console.log(user);
            
            localStorage.token = access_token;
            http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
            dispatch({
                type: AuthUserActionType.LOGIN_USER, payload: {
                    email: user.email,
                    name: user.name
                }
            });
            navigator("/");
        }
        catch (error) {
            console.log("Error auth", error);
        }
        
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData,
    });

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
        <>
            <h1 className="text-center">Login</h1>

            <form className="col-md-6 offset-md-3" onSubmit={handleSubmit}>
                {message && (
                    <div className="alert alert-danger" role="alert">
                        {message}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        E-mail
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
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className={classNames("form-control", { "is-invalid": errors.password && touched.password })}
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary">
                    Go
                </button>
            </form>
        </>
    );
};
export default LoginPage;