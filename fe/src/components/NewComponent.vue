<template>
  <div class="main-news">
    <h1><ion-icon name="flame-outline"></ion-icon>Các tin tức mới</h1>
    <div class="main-content">
      <a href="https://www.facebook.com/photo/?fbid=956817393130356&set=a.450091870469580">
        <section class="item-new">
          <p class="text">
            [GÓC UY TÍN]
            🔷 Theo Quyết định 41/2011/QĐ-TTg ngày 03/8/2011 của Thủ tướng Chính phủ, Bưu điện Việt Nam hiện là doanh nghiệp DUY NHẤT được Chính phủ chỉ định thực hiện duy trì...
          </p>
          <img src="../assets/news/image-new-5.jpg" alt="" class="image-new-preview">
        </section>
      </a>
      <a href="https://www.facebook.com/photo/?fbid=950323700446392&set=a.450091867136247">
        <section class="item-new">
          <p class="text">
            📢📢📢 TUYỂN DỤNG NHÂN VIÊN TẠI BƯU ĐIỆN HUYỆN ĐỒNG HỶ:
            👉Ứng tuyển nhanh tại link: https://forms.gle/XLenVgBBPNgRu4eM8
            ⏰....
          </p>
          <img src="../assets/news/image-new-3.jpg" alt="" class="image-new-preview">
        </section>
      </a>
      <a href="https://www.facebook.com/photo/?fbid=950304637114965&set=a.450091870469580">
        <section class="item-new">
          <p class="text">
            🌟🌟🌟 BƯU ĐIỆN PHÚ LƯƠNG CẦN TUYỂN:
            👉Ứng tuyển nhanh tại link: https://forms.gle/XLenVgBBPNgRu4eM8
            ⌚Thời hạn thu hồ sơ: Trước ngày 25/10/2024
            ❓....
          </p>
          <img src="../assets/news/image-new-4.jpg" alt="" class="image-new-preview">
        </section>
      </a>
      <a href="https://www.facebook.com/photo/?fbid=956817393130356&set=a.450091870469580">
        <section class="item-new">
          <p class="text">
            BƯU ĐIỆN TỈNH THÁI NGUYÊN TUYỂN DỤNG NHÂN VIÊN BƯU TÁ (NHÂN VIÊN GIAO HÀNG)
            🌸 Địa điểm: xã Khe Mo, Văn Hán, Hoá Thượng, huyện Đồng Hỷ.
            🌸 Mô tả công việc: ...
          </p>
          <img src="../assets/news/image-new-2.jpg" alt="" class="image-new-preview">
        </section>
      </a>
    </div>
  </div>

</template>
  
<style scoped>
  .main-news {
    padding: 20px 30px;
    /* display: flex; */
  }
  .main-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Khoảng cách giữa các mục */
  }

  a {
    width: calc(50% - 10px); /* Mỗi cột chiếm 50% chiều rộng trừ khoảng cách */
    box-sizing: border-box;
  }

  .item-new {
    display: flex;
    align-items: center;
    /* border: 1px solid rgb(121, 121, 121); */
    background-color: rgba(240, 236, 230, 0.781);
    padding: 10px 20px;
    border-radius: 5px;
    max-width: 100%;
    margin: 10px 0;
    min-height: 164px;
  }
  .item-new:hover {
    background-color: rgba(240, 225, 202, 0.938);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  p.text {
    white-space: nowrap;
    /* Giữ văn bản trên một dòng */
    overflow: hidden;
    /* Ẩn văn bản vượt quá giới hạn */
    text-overflow: ellipsis;
    text-wrap: wrap;
    /* Hiển thị dấu '...' khi văn bản vượt quá */
    width: 80%;
    /* Đặt chiều rộng tối đa cho ô văn bản */
  }

  .image-new-preview {
    width: 20%;
    border-radius: 10px;
    margin-left: 20px;
  }

  h1 {
    font-size: 30px;
    margin: 20px;
    font-weight: bold;
    text-align: left;
  }
</style>
  