import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http";
import { ICategoryItem } from "./types";
import { useFormik } from "formik";

const CategoryEditPage = () => {

    const navigator = useNavigate();

    const { id } = useParams();
    const [category, setCategory] = useState<ICategoryItem>({
        name: "",
        image: null,
        description: ""
    });

    useEffect(() => {
        http.get(`/api/category/${id}`)
            .then(response => {
                setCategory(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        http.put(`/api/category/${id}`, category)
          .then(response => {
            console.log("Category updated successfully");
            navigator("/");
          })
          .catch(error => {
            console.log(error);
          });
      };
      const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
          const file =  e.target.files[0];
          category.image = file;
        }
      };

    return (
        <>
            <h1 className="text-center">Edit category</h1>
            <form className="col-md-6 offset-md-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className={classNames("form-control")}
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                    />

                </div>

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

                <div className="form-floating mb-3">
                    <textarea
                        className={classNames("form-control")}
                        placeholder="Description"
                        id="description"
                        name="description"
                        style={{ height: "100px" }}
                        value={category.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Edit</button>
            </form>

        </>
    );

};
export default CategoryEditPage;