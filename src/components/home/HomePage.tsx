import axios from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ICategoryItem, ICategoryResponse, ICategorySearch } from "./types";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("page = ", searchParams.get("page"));

  const [search, setSearch] = useState<ICategorySearch>({
    page: searchParams.get("page") || 1,
  });

  const [category, setCategory] = useState<ICategoryResponse>({
    data: [],
    total: 0,
    current_page: 0,
    last_page: 0,
  });

  useEffect(() => {
    axios
      .get<ICategoryResponse>("http://127.0.0.1:8000/api/category", {
        params: search,
      })
      .then((resp) => {
        setCategory(resp.data);
      })
      .catch((bad) => {
        console.log("Bad request", bad);
      });
  }, [search]);




  const { data, last_page, current_page, total } = category;

  const maxButtons = 10;
  const halfButtons = Math.floor(maxButtons / 2);

  const startButton =
    current_page - halfButtons > 1 ? current_page - halfButtons : 1;
  const endButton =
    current_page + halfButtons < last_page
      ? current_page + halfButtons
      : last_page;

  const buttons = [];

  for (let i = startButton; i <= endButton; i++) {
    buttons.push(i);
  }

  const pagination = (
    <ul className="pagination justify-content-center">
      {/* перевірка чи потрібна стрілка назад */}
      {current_page > 1 && (
        <Link className="page-link" to={`?page=${current_page - 1}`} onClick={() => setSearch({ ...search, page: current_page - 1 })}>&laquo;</Link>
      )}
      {/* перевірка чи поточна сторінка не є першою і чи потрібно створювати лінк з номером першої сторінки,та лінк з 3 крапками */}
      {startButton > 1 && (
        <>
          <Link className="page-link" to={`?page=${1}`} onClick={() => setSearch({ ...search, page: 1 })}>1 </Link>
          {startButton > 2 && <Link className="page-link" to={`?page=${current_page - 3}`} onClick={() => setSearch({ ...search, page: current_page - 3 })}>... </Link>}
        </>
      )}
      {/* цикл якій виводить всі інші лінкі */}
      {buttons.map((page) => (
        <Link key={page} className="page-link" to={`?page=${page}`} onClick={() => setSearch({ ...search, page: page })}>{page} </Link>
      ))}
      {/* перевірка чи поточна сторінка не є останньою і чи потрібно створювати лінк з номером останньої сторінки,та лінк з 3 крапками */}
      {endButton < last_page && (
        <>
          {endButton < last_page - 1 && <Link className="page-link" to={`?page=${current_page + 3}`} onClick={() => setSearch({ ...search, page: current_page + 3 })}>...</Link>}
          <Link className="page-link" to={`?page=${last_page}`} onClick={() => setSearch({ ...search, page: last_page })}>{last_page} </Link>
        </>
      )}
      {
        /* перевірка чи потрібна стрілка вперед */
        current_page < last_page && (
          <Link className="page-link" to={`?page=${current_page + 1}`} onClick={() => setSearch({ ...search, page: current_page + 1 })}>»</Link>
        )}
    </ul>
  );

  const dataView = data.map(category =>
    <tr key={category.id}>
      <th><img src={category.image} alt='фотка' width={75}></img></th>
      <td>{category.name}</td>
      <td>{category.description}</td>
    </tr>
  );

  return (
    <>
      <h1 className="text-center">Categories list</h1>
      <Link to="/categories/create" className="btn btn-primary">Add</Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {dataView}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        {pagination}
      </nav>
    </>
  );
};

export default HomePage;
