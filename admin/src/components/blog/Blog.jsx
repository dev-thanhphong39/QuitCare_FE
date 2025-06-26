import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import BackToTopButton from "../back-to-top/BackToTopButton";
import { Link } from "react-router";

const knowledgePosts = [
  {
    id: "4",
    title: "13 mẹo cai thuốc lá tốt nhất từ trước đến nay",
    date: "22/07/2024",
    category: "Kiến Thức",
    image:
      "https://www.vinmec.com/static/uploads/small_20191028_051013_566979_nicotine_max_1800x1800_jpg_f271d921d5.jpg",
    description: "Tổng hợp các mẹo bỏ thuốc lá hiệu quả, dễ thực hiện.",
    url: "https://www.vinmec.com/vie/bai-viet/13-meo-cai-thuoc-la-tot-nhat-tu-truoc-den-nay-vi",
  },
  {
    id: "5",
    title: "11 điều cần làm để cai thuốc hiệu quả và dễ dàng hơn",
    date: "31/08/2023",
    category: "Kiến Thức",
    image:
      "https://syt.daknong.gov.vn/upload/2005704/fck/admin_sytdn/1(613).jpg",
    description: "Các bước cần thiết giúp quá trình bỏ thuốc thuận lợi hơn.",
    url: "https://syt.daknong.gov.vn/tin-tuc-su-kien/y-te-du-phong/de-viec-cai-thuoc-la-duoc-hieu-qua-va-de-dang-hon-can-thuc-hien-11-dieu-sau-.html",
  },
  {
    id: "6",
    title: "Cách lập kế hoạch để bỏ hút thuốc lá",
    date: "22/07/2024",
    category: "Kiến Thức",
    image:
      "https://www.vinmec.com/static/uploads/small_20211124_135856_765207_cai_thuoc_la_2_max_1800x1800_png_6bb43efac8.png",
    description: "Hướng dẫn chi tiết lập kế hoạch bỏ thuốc có hiệu quả.",
    url: "https://www.vinmec.com/vie/bai-viet/cach-lap-ke-hoach-de-bo-hut-thuoc-la-vi",
  },
  {
    id: "7",
    title: "Một số bí quyết giúp cai thuốc lá hiệu quả",
    date: "15/03/2017",
    category: "Kiến Thức",
    image:
      "data:image/jpeg;base64,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",
    description: "Những bí quyết thực tế đã được kiểm chứng.",
    url: "https://baonamdinh.vn/channel/5091/201703/phong-chong-tac-hai-cua-thuoc-la-mot-so-bi-quyet-giup-cai-thuoc-la-hieu-qua-2517330/",
  },
  {
    id: "8",
    title: "Cai nghiện thuốc lá: dễ hay khó?",
    date: "18/12/2024",
    category: "Kiến Thức",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS785pO63JTSHgcDsEKtjFJZNoKiK7zHKHgJg&s",
    description: "Bài viết chia sẻ góc nhìn về quá trình cai thuốc.",
    url: "https://tuoitre.vn/cai-nghien-thuoc-la-de-hay-kho-20241218111657381.htm",
  },
];

const healthyPosts = [
  {
    id: "9",
    title: "Tập thể dục giúp ích cho việc cai nghiện thuốc lá",
    date: "27/10/2018",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://medlatec.vn/media/3385/content/20221201_tap-the-duc-buoi-toi-1.jpg",
    description:
      "Bài viết nêu bật vai trò của tập thể dục trong việc giảm các triệu chứng cai nghiện nicotine và tăng cường sức khỏe tổng thể.",
    url: "https://baobacgiang.vn/tap-the-duc-giup-ich-cho-viec-cai-nghien-thuoc-la.bbg",
  },
  {
    id: "18",
    title: "Tập thể dục giúp ích cho việc cai nghiện thuốc lá",
    date: "04/01/2018",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://thanhnien.mediacdn.vn/Uploaded/ngocquy/2017_11_05/thieu-ngu-shutterstock_HLRI.jpg",
    description:
      "Nghiên cứu cho thấy tập thể dục có thể làm giảm cảm giác thèm thuốc và cải thiện tâm trạng trong quá trình cai nghiện.",
    url: "https://thanhnien.vn/tap-the-duc-giup-ich-cho-viec-cai-nghien-thuoc-la-185723413.htm",
  },
  {
    id: "21",
    title: "Điều gì xảy ra sau hai tuần bỏ thuốc lá",
    date: "23/5/2025",
    category: "Tập luyện & Sức khỏe",
    image: "https://img.baobacgiang.vn/Medias/568/2024/09/20/1%20copy%203.jpg",
    description:
      "Sau hai tuần bỏ thuốc lá, cơ thể có nhiều thay đổi tích cực như cải thiện nhịp tim, huyết áp, chức năng phổi và vị giác, đồng thời giảm nguy cơ mắc bệnh tim mạch.",
    url: "https://vnexpress.net/dieu-gi-xay-ra-sau-hai-tuan-bo-thuoc-la-4889585.html",
  },
  {
    id: "22",
    title: "Thanh lọc phổi sau khi cai thuốc lá",
    date: "5/10/2023",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://i1-suckhoe.vnecdn.net/2023/10/05/hand-keeping-cigarette-1339-59-2969-7110-1696471668.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=ocvSdgZS_VIfXfHcjXmYAA",
    description:
      "Sau khi bỏ thuốc lá, cơ thể có thể phục hồi đáng kể nhờ các biện pháp như uống nước ấm, xông hơi, hít thở sâu, tập thể dục đều đặn và bổ sung dinh dưỡng hợp lý để thanh lọc phổi.",
    url: "https://vnexpress.net/thanh-loc-phoi-sau-khi-cai-thuoc-la-4661057.html",
  },
  {
    id: "19",
    title: "Lợi ích của việc “cai” thuốc",
    date: "02/07/2008",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://benhvienvanhanh.vn/wp-content/uploads/2024/01/cai-thuoc-la-bang-nhi-cham-1.jpg",
    description:
      'Không ai phủ nhận "cai" thuốc lá là một việc khó, tuy nhiên nếu hiểu rõ bỏ thuốc có tác dụng như thế nào, chắc chắn các đấng mày râu sẽ có thêm động lực để bớt mặn mà với thuốc.',
    url: "https://dantri.com.vn/suc-khoe/loi-ich-cua-viec-cai-thuoc-1215129319.htm",
  },
  {
    id: "12",
    title: "Thực phẩm nên ăn và tránh khi cai thuốc lá",
    date: "20/3/2024",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://i1-suckhoe.vnecdn.net/2023/12/12/tao-ca-chua-1702348380.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=oXDQrNlm6qrb4cSTvmVaDQ",
    description:
      "Các chuyên gia khuyến nghị nên tăng cường trái cây, rau củ, ngũ cốc và tránh rượu bia, caffeine để giảm cảm giác thèm thuốc và hỗ trợ quá trình cai nghiện hiệu quả.",
    url: "https://vnexpress.net/thuc-pham-nen-an-va-tranh-khi-cai-thuoc-la-4724384.html",
  },
  {
    id: "13",
    title: "Tập yoga giúp cai thuốc lá dễ hơn",
    date: "11/01/2015",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/2014/6-chuyen-ay5-1415258536525.jpg",
    description:
      "Nghiên cứu cho thấy tập yoga đều đặn giúp giảm stress và hỗ trợ quá trình cai thuốc lá.",
    url: "https://suckhoedoisong.vn/tap-yoga-giup-cai-thuoc-la-de-hon-16990195.htm",
  },
];

const successPosts = [
  {
    id: "14",
    title: "Bỏ thuốc lá thành công sau 15 năm nghiện thuốc",
    date: "18/07/2022",
    category: "Câu Chuyện",
    image:
      "https://medlatec.vn/media/2532/content/20230213_loi-ich-khi-bo-thuoc.jpg",
    description: "Hành trình vượt qua 15 năm nghiện thuốc lá.",
    url: "https://baothaibinh.com.vn/tin-tuc/260/154962/bo-thuoc-la-thanh-cong-sau-15-nam-nghien-thuoc",
  },
  {
    id: "15",
    title: "Chia sẻ của người trong cuộc khi cai thuốc lá",
    date: "10/12/2018",
    category: "Câu Chuyện",
    image:
      "https://bvdkla.longan.gov.vn/wp-content/uploads/2022/07/845caithuocla-800x445.jpg",
    description: "Kinh nghiệm bỏ thuốc từ người thực tế.",
    url: "https://mic.gov.vn/cai-thuoc-la-chia-se-cua-nguoi-trong-cuoc-197138305.htm",
  },
  {
    id: "20",
    title: "Gương cai nghiện thuốc lá",
    date: "14/11/2017",
    category: "Câu Chuyện",
    image: "https://cdcbentre.org/uploads/news/2022_05/7anh-thuoc-la.jpg",
    description: "Câu chuyện truyền cảm hứng từ người bỏ thuốc thành công.",
    url: "https://bvquan5.medinet.gov.vn/chuyen-muc/guong-cai-nghien-thuoc-la-c13679-7847.aspx",
  },
  {
    id: "16",
    title: "Người đàn ông từng hút 13 năm chia sẻ kinh nghiệm bỏ thuốc",
    date: "19/06/2020",
    category: "Câu Chuyện",
    image: "https://nld.mediacdn.vn/2017/agh-1485239095737.jpg",
    description: "Chia sẻ thực tế từ người đã bỏ thuốc sau nhiều năm.",
    url: "https://vtv.vn/doi-song/kinh-nghiem-bo-thuoc-la-tu-nguoi-dan-ong-tung-hut-13-nam-20200617181734047.htm",
  },
  {
    id: "17",
    title: "Cai thuốc lá thành công sau 40 năm vì cháu nội",
    date: "30/7/2019",
    category: "Câu Chuyện",
    image: "https://www.cdchaugiang.org.vn/uploads/news/2024_03/30.png",
    description: "Câu chuyện cảm động về tình cảm gia đình thúc đẩy bỏ thuốc.",
    url: "https://vnexpress.net/cai-thuoc-la-thanh-cong-sau-40-nam-vi-thay-chau-ho-3957870.html",
  },
];

function BlogSection({ id, title, posts }) {
  return (
    <div id={id}>
      <h2 className="section-title">{title}</h2>
      <div className="blog-grid">
        {posts.map((post, index) => (
          <div key={index} className="blog-card">
            <div className="blog-img">
              <img src={post.image} alt={post.title} />
              <div className="blog-meta">
                <span>{post.date}</span> · <span>{post.category}</span>
              </div>
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-description">{post.description}</p>
              <Link to={`/blog/${post.id}`} className="blog-readmore">
                Đọc Thêm →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Blog() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const section = ["knowledge", "healthy", "success"];
      for (let id of section) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="blog-container">
        <div className="blog-page">
          <div className="blog-nav">
            <a
              href="#knowledge"
              className={`blog-nav-link ${activeSection === "knowledge" ? "active" : ""
                }`}
            >
              📚 Kiến Thức Cai Thuốc
            </a>
            <a
              href="#healthy"
              className={`blog-nav-link ${activeSection === "healthy" ? "active" : ""
                }`}
            >
              💪 Tập luyện & sức khỏe
            </a>
            <a
              href="#success"
              className={`blog-nav-link ${activeSection === "success" ? "active" : ""
                }`}
            >
              💡 Câu Chuyện Thành Công
            </a>
          </div>

          <BlogSection
            id="knowledge"
            title="📚 Kiến Thức Cai Thuốc"
            posts={knowledgePosts}
          />
          <BlogSection
            id="healthy"
            title="💪 Tập luyện & sức khỏe"
            posts={healthyPosts}
          />
          <BlogSection
            id="success"
            title="💡 Câu Chuyện Thành Công"
            posts={successPosts}
          />
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default Blog;
