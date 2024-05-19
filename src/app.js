document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Teh Hangat", img: "tehhangat.jpg", price: 4000 },
      { id: 2, name: "Es Teh", img: "es teh.jpg", price: 5000 },
      { id: 3, name: "Es Teh Susu", img: "teh susu.jpg", price: 6000 },
      { id: 4, name: "Kopi Hitam", img: "kopi hitam.jpg", price: 5000 },
      { id: 5, name: "Kopi Susu", img: "kopi susu.jpg", price: 6000 },
      { id: 6, name: "Nutrisari", img: "nutrisari.jpg", price: 6000 },
      { id: 7, name: "Good Day", img: "good day freeze.jpg", price: 7000 },
      { id: 8, name: "Milo", img: "milo.jpg", price: 7000 },
      { id: 9, name: "Pop Ice", img: "pop ice.jpg", price: 6000 },
      {
        id: 10,
        name: "Chocolatos (Coklat/Matcha)",
        img: "chocolatos.jpg",
        price: 7000,
      },
      { id: 11, name: "Beng Beng", img: "bengbeng.jpg", price: 7000 },
      {
        id: 12,
        name: "Dancow (Coklat/Vanila)",
        img: "dancow.jpg",
        price: 8000,
      },
      { id: 13, name: "Energen", img: "energen.jpg", price: 7000 },
      { id: 14, name: "Soda Gembira", img: "soda gembira.jpg", price: 10000 },
      {
        id: 15,
        name: "Indomie (Rebus/Goreng)",
        img: "indomie.jpg",
        price: 6000,
      },
      { id: 16, name: "Sosis", img: "sosis.jpg", price: 8000 },
      { id: 17, name: "Kentang Goreng", img: "kentang.jpg", price: 8000 },
      { id: 18, name: "Cireng", img: "cireng.jpg", price: 8000 },
      { id: 19, name: "Otak Otak", img: "otak2.jpg", price: 8000 },
      { id: 20, name: "Tempura", img: "tempura.jpg", price: 8000 },
      { id: 21, name: "Scallop", img: "scallop.jpg", price: 8000 },
      { id: 22, name: "Nugget", img: "nuget.jpg", price: 8000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek barang
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // cart kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // cek jika barang sudah ada, sama atau tidak
        this.items = this.items.map((item) => {
          // jika beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika ada
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      // jika lebih dari 1
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form validasi
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//Kirim data ketika checkout
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  // minta transaksi token ajax/fecth
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    //console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

//format pesan via WA
const formatMessage = (obj) => {
  return `Data Customer 
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
  Alamat: ${obj.alamat}
  Keterangan: ${obj.ket}
  Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )} 
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};

//konfersi mata uang
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
