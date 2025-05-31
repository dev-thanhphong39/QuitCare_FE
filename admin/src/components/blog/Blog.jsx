import React from "react";
import "./Blog.css";
import Navbar from "../navbar/Navbar";

const healthyPosts = [
  {
    title: "Tập thể dục giúp ích cho việc cai nghiện thuốc lá",
    date: "2018-10-27",
    category: "Tập luyện & Sức khỏe",
    image:
      "data:image/jpeg;base64,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",
    description:
      "Bài viết nêu bật vai trò của tập thể dục trong việc giảm các triệu chứng cai nghiện nicotine và tăng cường sức khỏe tổng thể.",
    url: "https://baobacgiang.vn/tap-the-duc-giup-ich-cho-viec-cai-nghien-thuoc-la.bbg",
  },
  {
    title: "Tập thể dục giúp ích cho việc cai nghiện thuốc lá",
    date: "2018-01-04",
    category: "Tập luyện & Sức khỏe",
    image:
      "https://thanhnien.mediacdn.vn/Uploaded/ngocquy/2017_11_05/thieu-ngu-shutterstock_HLRI.jpg",
    description:
      "Nghiên cứu cho thấy tập thể dục có thể làm giảm cảm giác thèm thuốc và cải thiện tâm trạng trong quá trình cai nghiện.",
    url: "https://thanhnien.vn/tap-the-duc-giup-ich-cho-viec-cai-nghien-thuoc-la-185723413.htm",
  },
  {
    title: "Điều gì xảy ra sau hai tuần bỏ thuốc lá",
    date: "23/5/2025",
    category: "Tập luyện & Sức khỏe",
    image: "https://img.baobacgiang.vn/Medias/568/2024/09/20/1%20copy%203.jpg",
    description:
      "Sau hai tuần bỏ thuốc lá, cơ thể có nhiều thay đổi tích cực như cải thiện nhịp tim, huyết áp, chức năng phổi và vị giác, đồng thời giảm nguy cơ mắc bệnh tim mạch.",
    url: "https://vnexpress.net/dieu-gi-xay-ra-sau-hai-tuan-bo-thuoc-la-4889585.html",
  },
  {
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

const knowledgePosts = [
  {
    title: "13 mẹo cai thuốc lá tốt nhất từ trước đến nay",
    date: "22/07/2024",
    category: "Kiến Thức",
    image:
      "https://www.vinmec.com/static/uploads/small_20191028_051013_566979_nicotine_max_1800x1800_jpg_f271d921d5.jpg",
    description: "Tổng hợp các mẹo bỏ thuốc lá hiệu quả, dễ thực hiện.",
    url: "https://www.vinmec.com/vie/bai-viet/13-meo-cai-thuoc-la-tot-nhat-tu-truoc-den-nay-vi",
  },
  {
    title: "11 điều cần làm để cai thuốc hiệu quả và dễ dàng hơn",
    date: "31/08/2023",
    category: "Kiến Thức",
    image:
      "https://syt.daknong.gov.vn/upload/2005704/fck/admin_sytdn/1(613).jpg",
    description: "Các bước cần thiết giúp quá trình bỏ thuốc thuận lợi hơn.",
    url: "https://syt.daknong.gov.vn/tin-tuc-su-kien/y-te-du-phong/de-viec-cai-thuoc-la-duoc-hieu-qua-va-de-dang-hon-can-thuc-hien-11-dieu-sau-.html",
  },
  {
    title: "Cách lập kế hoạch để bỏ hút thuốc lá",
    date: "22-07-2024",
    category: "Kiến Thức",
    image:
      "https://www.vinmec.com/static/uploads/small_20211124_135856_765207_cai_thuoc_la_2_max_1800x1800_png_6bb43efac8.png",
    description: "Hướng dẫn chi tiết lập kế hoạch bỏ thuốc có hiệu quả.",
    url: "https://www.vinmec.com/vie/bai-viet/cach-lap-ke-hoach-de-bo-hut-thuoc-la-vi",
  },
  {
    title: "Một số bí quyết giúp cai thuốc lá hiệu quả",
    date: "15/03/2017",
    category: "Kiến Thức",
    image:
      "data:image/jpeg;base64,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",
    description: "Những bí quyết thực tế đã được kiểm chứng.",
    url: "https://baonamdinh.vn/channel/5091/201703/phong-chong-tac-hai-cua-thuoc-la-mot-so-bi-quyet-giup-cai-thuoc-la-hieu-qua-2517330/",
  },
  {
    title: "Cai nghiện thuốc lá: dễ hay khó?",
    date: "18/12/2024",
    category: "Kiến Thức",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS785pO63JTSHgcDsEKtjFJZNoKiK7zHKHgJg&s",
    description: "Bài viết chia sẻ góc nhìn về quá trình cai thuốc.",
    url: "https://tuoitre.vn/cai-nghien-thuoc-la-de-hay-kho-20241218111657381.htm",
  },
];

const successPosts = [
  {
    title: "Bỏ thuốc lá thành công sau 15 năm nghiện thuốc",
    date: "18/07/2022",
    category: "Câu Chuyện",
    image:
      "https://medlatec.vn/media/2532/content/20230213_loi-ich-khi-bo-thuoc.jpg",
    description: "Hành trình vượt qua 15 năm nghiện thuốc lá.",
    url: "https://baothaibinh.com.vn/tin-tuc/260/154962/bo-thuoc-la-thanh-cong-sau-15-nam-nghien-thuoc",
  },
  {
    title: "Chia sẻ của người trong cuộc khi cai thuốc lá",
    date: "10/12/2018",
    category: "Câu Chuyện",
    image:
      "https://bvdkla.longan.gov.vn/wp-content/uploads/2022/07/845caithuocla-800x445.jpg",
    description: "Kinh nghiệm bỏ thuốc từ người thực tế.",
    url: "https://mic.gov.vn/cai-thuoc-la-chia-se-cua-nguoi-trong-cuoc-197138305.htm",
  },
  {
    title: "Gương cai nghiện thuốc lá",
    date: " 14/11/2017",
    category: "Câu Chuyện",
    image: "https://cdcbentre.org/uploads/news/2022_05/7anh-thuoc-la.jpg",
    description: "Câu chuyện truyền cảm hứng từ người bỏ thuốc thành công.",
    url: "https://bvquan5.medinet.gov.vn/chuyen-muc/guong-cai-nghien-thuoc-la-c13679-7847.aspx",
  },
  {
    title: "Người đàn ông từng hút 13 năm chia sẻ kinh nghiệm bỏ thuốc",
    date: "19/06/2020",
    category: "Câu Chuyện",
    image: "https://nld.mediacdn.vn/2017/agh-1485239095737.jpg",
    description: "Chia sẻ thực tế từ người đã bỏ thuốc sau nhiều năm.",
    url: "https://vtv.vn/doi-song/kinh-nghiem-bo-thuoc-la-tu-nguoi-dan-ong-tung-hut-13-nam-20200617181734047.htm",
  },
  {
    title: "Cai thuốc lá thành công sau 40 năm vì cháu nội",
    date: "30/7/2019",
    category: "Câu Chuyện",
    image: "https://www.cdchaugiang.org.vn/uploads/news/2024_03/30.png",
    description: "Câu chuyện cảm động về tình cảm gia đình thúc đẩy bỏ thuốc.",
    url: "https://vnexpress.net/cai-thuoc-la-thanh-cong-sau-40-nam-vi-thay-chau-ho-3957870.html",
  },
];

function BlogSection({ title, posts }) {
  return (
    <>
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
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-readmore"
              >
                Đọc Thêm →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Blog() {
  return (
    <div>
      <Navbar />
      <div className="blog-page">
        <h1 className="blog-main-title">📰 Blog Bỏ Thuốc Lá</h1>
        <BlogSection title="📚 Kiến Thức Cai Thuốc" posts={knowledgePosts} />
        <BlogSection title="💪 Tập luyện & sức khỏe" posts={healthyPosts} />
        <BlogSection title="💡 Câu Chuyện Thành Công" posts={successPosts} />
      </div>
    </div>
  );
}

export default Blog;
