import { useLocation } from "react-router-dom";

function useGetParams() {
  const location = useLocation();

  const getParams = (param) => {
    //  Fix lỗi nhiều dấu `?` trong query string
    let fixedSearch = location.search
      .replace(/\?(?=.*=)/g, "&") // thay các ? giữa chuỗi bằng &
      .replace("&", "?");         // đổi lại dấu đầu tiên thành ?

    const data = new URLSearchParams(fixedSearch);
    return data.get(param);
  };

  return getParams;
}

export default useGetParams;
