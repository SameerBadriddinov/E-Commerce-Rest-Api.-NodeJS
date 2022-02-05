const toCurrency = (price) => {
  return new Intl.NumberFormat("us-US", {
    currency: "usd",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat("us-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".price").forEach((c) => {
  c.textContent = toCurrency(c.textContent);
});

document.querySelectorAll(".data").forEach((s) => {
  s.textContent = toDate(s.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;

      fetch("/card/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.notebooks.length) {
            const dynamicHtml = card.notebooks
              .map((c) => {
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                  </td>
                </tr>
              `;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = dynamicHtml;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = `
              <div class="mt-100">
                <div class="row bascket">
                  <div class="col-md-12">
                    <div class="card bascket">
                      <div class="card-body cart">
                        <div class="col-sm-12 empty-cart-cls text-center">
                          <img
                            src="https://i.imgur.com/dCdflKN.png"
                            width="130"
                            height="130"
                            class="img-fluid mb-4 mr-3"
                          />
                          <h3><strong>Your Cart is Empty</strong></h3>
                          <h4>Add something to make me happy :)</h4>
                          <a
                            href="/notebooks"
                            class="btn btn-primary cart-btn-transform m-3"
                            data-abc="true"
                          >continue shopping</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll(".tabs"));

let panel = document.querySelector("#panel");
panel.classList.add("panel");