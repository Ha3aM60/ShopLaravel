import { useEffect, useState } from "react";
import { ICategoryItem } from "./types";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);

    useEffect(() => {
        axios.get<ICategoryItem[]>("http://127.0.0.1:8000/api/category")
        .then(resp => {
            setList(resp.data);
            //console.log("axios res", resp);
        })
        .catch(bad => {
            console.log("Bad request", bad);
        });
    }, []);

    const dataView = list.map((category) => (
        <tr key={category.id}>
            <th>
                <img src={category.image} alt="Photo" width={75} />
            </th>
            <td>{category.name}</td>
            <td>{category.description}</td>
        </tr>
    ));

    return (
        <>
            <h1 className="text-center">Category list</h1>
            <Link to="/categories/create" className="btn btn-primary">Add</Link>
            <table className="table text-center">
                <thead>
                    <tr>
                        <th scope="col">Photo</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {dataView}
                </tbody>
            </table>
        </>
    )
};

export default HomePage;