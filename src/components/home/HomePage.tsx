import classNames from "classnames";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ICategoryItem, ICategoryResponse, ICategorySearch } from "./types";
import http from "../../http";
import { APP_ENV } from "../../env";
import Modal from 'react-modal';


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


  /* get запрос */
  useEffect(() => {
    /* використання змінної з силкою БД */
    http
      .get<ICategoryResponse>(`api/category`, {
        params: search,
      })
      .then((resp) => {
        setCategory(resp.data);
      })
      .catch((bad) => {
        console.log("Bad request", bad);
      });
  }, [search]);



  /* пагінація */
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

  /* кінець пагінації */


  /* вивід елементів */
  const dataView = data.map(category =>
    <tr key={category.id}>
      {/* використання змінної з силкою БД */}
      <th><img src={`${APP_ENV.BASE_URL}storage/uploads/${category.image}`} alt="Фотка" width={50} /></th>
      <td>{category.name}</td>
      <td>{category.description}</td>
      <button onClick={() => showDeleteModal(category.name)} className="btn"><img src="Close_16px.png" alt="del" /></button>
      <Link className="btn" to={`/categories/${category.name}/edit`}><img width={40} src="edit_16px.png" alt="del" /></Link>
    </tr>
  );

  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [nameToDelete, setNameToDelete] = useState('');

  /* відкриття модального вікна для видалення */
  const showDeleteModal = (name : string) => {
    setNameToDelete(name);
    setShowModal(true);
  };

  /* закриття модального вікна без видалення */
  const handleCancelDelete = () => {
    setShowModal(false);
    setNameToDelete('');
  };
  /* видалення елемента */
  const handleConfirmDelete = () => {
    http
      .delete(`api/category/${nameToDelete}`)
      .then((response) => {
        console.log("Deleted");
        setShowModal(false);
        setNameToDelete('');
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        setShowModal(false);
        setNameToDelete('');
      });
  };


  



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

      <Modal
        isOpen={showModal}
        onRequestClose={handleCancelDelete}
        ariaHideApp={false}
      >
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the category?</p>
        <div>
          <button onClick={handleConfirmDelete} className="btn btn-danger">Delete</button>
          <button onClick={handleCancelDelete} className="btn btn-secondary">Cancel</button>
        </div>
      </Modal>

    </>
  );
};

export default HomePage;
