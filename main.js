$(() => {
  let formBtn = $("#login-btn");
  formBtn.click((e) => {
    e.preventDefault();
    const UserName = $("#UserName").val();
    const PassWord = $("#Password").val(); // getting the user input values
    // login validation
    if (!UserName || !PassWord || UserName !== PassWord) {
      localStorage.setItem("userStatus", false);
      alert("Please enter valid credentials!");
    } else {
      localStorage.setItem("userStatus", true);
      alert("Login Successful");
      window.location.href = "OrderListingPage.html";
    }
    $("#sign-in-form")[0].reset();
  });
  // the userStatus in browser is stored in the local storage

  // calling api and fetching data in the orderListingPage Dynamically

  $.get(
    "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders",
    (orderList) => {
      console.log(orderList);
      const orderTable = $("#order-table");
      orderList.forEach((order) => {
        let orderTableRow = `
            <tr class='table-row'>
              <td class="light-black">${order.id}</td>
              <td >${order.customerName}</td>
              <td >${order.orderDate} <br/> <span class="light-black">${order.orderTime}</span></td>
              <td>${order.amount}</td>
              <td class="light-black status">${order.orderStatus}</td>
            </tr>
            `;
        orderTable.append(orderTableRow);
      });
      $("#ordersCount").text("Count " + $(".table-row").length); //count of the orders
      // validating the check boxes and showing order-list-data
      const newOrders = $("#New");
      const packedOrders = $("#Packed");
      const inTransit = $("#InTransit");
      const delivered = $("#Delivered");
      //checkbox validation for new
      newOrders.change((e) => {
        if (newOrders.is(":checked")) {
          let statusArray = $(".status");
          let count = 0;
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "New") {
              $(statusArray[i]).parent().addClass("hidden");
              count++;
              $("#ordersCount").text("Count " + (orderList.length - count));
            }
          }
        } else {
          let statusArray = $(".status");
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "New") {
              $(statusArray[i]).parent().removeClass("hidden");
              $("#ordersCount").text("Count " + orderList.length);
            }
          }
        }
      });

      //checkbox validation for Packed
      packedOrders.change((e) => {
        if (packedOrders.is(":checked")) {
          let statusArray = $(".status");
          let count = 0;
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "Packed") {
              $(statusArray[i]).parent().addClass("hidden");
              count++;
              $("#ordersCount").text("Count " + (orderList.length - count));
            }
          }
        } else {
          let statusArray = $(".status");
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "Packed") {
              $(statusArray[i]).parent().removeClass("hidden");
              $("#ordersCount").text("Count " + orderList.length);
            }
          }
        }
      });
      //checkbox validation for InTransit
      inTransit.change((e) => {
        if (inTransit.is(":checked")) {
          let statusArray = $(".status");
          let count = 0;
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "InTransit") {
              $(statusArray[i]).parent().addClass("hidden");
              count++;
              $("#ordersCount").text("Count " + (orderList.length - count));
            }
          }
        } else {
          let statusArray = $(".status");
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "InTransit") {
              $(statusArray[i]).parent().removeClass("hidden");
              $("#ordersCount").text("Count " + orderList.length);
            }
          }
        }
      });
      //Delivered
      //checkbox validation for Delivered
      delivered.change((e) => {
        if (delivered.is(":checked")) {
          let statusArray = $(".status");
          let count = 0;
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "Delivered") {
              $(statusArray[i]).parent().addClass("hidden");
              count++;
              $("#ordersCount").text("Count " + (orderList.length - count));
            }
          }
        } else {
          let statusArray = $(".status");
          for (let i = 0; i < statusArray.length; i++) {
            if ($(statusArray[i]).text() !== "Delivered") {
              $(statusArray[i]).parent().removeClass("hidden");
              $("#ordersCount").text("Count " + orderList.length);
            }
          }
        }
      });
    }
  ).fail((err) => console.log(err));

  // calling the api for the products
  $.get(
    "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products",
    (productList) => {
      console.log(productList);
      const productTable = $(".productTableRow");
      //validating for the date is expired or not with parameters todays date and the user input date
      function isExpired(formattedDate, date) {
        let todaysdate = formattedDate.split("-");
        let someDate = date.split("-");
        let monthsByIndex = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        if (Number(todaysdate[2]) < Number(someDate[2])) {
          return false;
        } else if (Number(todaysdate[2]) === Number(someDate[2])) {
          if (
            monthsByIndex.indexOf(todaysdate[1]) <
            monthsByIndex.indexOf(someDate[1])
          ) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      }
      // function for validating the stock
      function isLowStock(stock) {
        if (Number(stock) < 100) {
          return true;
        }
        return false;
      }
      // getting the current date and converting in to the required formate
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString("default", { month: "short" });
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      // getting  the checkboxes
      let expired = $("#Expired");
      let lowStock = $("#LowStock");

      const productTableArray = []; // Creating an array to store the table rows
      let count1 = 0;
      productList.forEach((product) => {
        if (
          isExpired(formattedDate, product.expiryDate) === false &&
          isLowStock(product.stock) === false
        ) {
          count1++;

          // Creating the table row and pushing it into the productTableArray
          productTableArray.push(`
              <tr class='table-row productTableRow'>
                <td class="light-black">${product.id}</td>
                <td>${product.medicineName}</td>
                <td class="light-black">${product.medicineBrand}</td>
                <td>${product.expiryDate}</td>
                <td class="light-black status">$${product.unitPrice}</td>
                <td class="light-black status">${product.stock}</td>
              </tr>
            `);
        }
      });

      // Updating the HTML content of the productTable with the joined table rows
      productTable.html(productTableArray.join(""));
      $("#productsCount").text("Count " + count1);

      //adding  functionality to check box
      expired.change(() => {
        if ($(expired).is(":checked") && $(lowStock).is(":checked")) {
          $(lowStock).prop("checked", false);
        }
        let productArrayWithExpiryDates = [];
        let count2 = 0;
        if ($(expired).is(":checked")) {
          productList.forEach((product) => {
            if (
              isExpired(formattedDate, product.expiryDate) === true ||
              isLowStock(product.stock) === false
            ) {
              count2++;
              productArrayWithExpiryDates.push(`
              <tr class='table-row productTableRow'>
                <td class="light-black">${product.id}</td>
                <td>${product.medicineName}</td>
                <td class="light-black">${product.medicineBrand}</td>
                <td>${product.expiryDate}</td>
                <td class="light-black status">$${product.unitPrice}</td>
                <td class="light-black status">${product.stock}</td>
              </tr>
            `);
            }
          });
          productTable.html(productArrayWithExpiryDates.join(""));
          $("#productsCount").text("Count " + count2);
        } else {
          productTable.html(productTableArray.join(""));
          $("#productsCount").text("Count " + count1);
        }
      });
      lowStock.change(() => {
        if ($(expired).is(":checked") && $(lowStock).is(":checked")) {
          $(expired).prop("checked", false);
        }
        let productArrayWithLowStock = [];
        let count3 = 0;
        if ($(lowStock).is(":checked")) {
          productList.forEach((product) => {
            if (
              isExpired(formattedDate, product.expiryDate) === false ||
              isLowStock(product.stock) === true
            ) {
              count3++;
              productArrayWithLowStock.push(`
              <tr class='table-row productTableRow'>
                <td class="light-black">${product.id}</td>
                <td>${product.medicineName}</td>
                <td class="light-black">${product.medicineBrand}</td>
                <td>${product.expiryDate}</td>
                <td class="light-black status">$${product.unitPrice}</td>
                <td class="light-black status">${product.stock}</td>
              </tr>
            `);
            }
          });
          productTable.html(productArrayWithLowStock.join(""));
          $("#productsCount").text("Count " + count3);
        } else {
          productTable.html(productTableArray.join(""));
          $("#productsCount").text("Count " + count1);
        }
      });
    }
  ).fail((err) => console.log(err));
  //userList Page
  $.get(
    "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users",
    (usersInfo) => {
      let userListTable = $(".userListTable");
      let usersInformation = [];
      usersInfo.forEach((userInfo) => {
        usersInformation.push(`
             <tr class='table-row userInfoTable'>
                <td class="light-black">${userInfo.id}</td>
                <td><img src=${userInfo.profilePic}/></td>
                <td class="light-black">${userInfo.fullName}</td>
                <td>${userInfo.dob}</td>
                <td class="light-black status">$${userInfo.gender}</td>
                <td class="light-black status">${userInfo.currentCity}</td>
              </tr>
        `);
      });
      userListTable.html(usersInformation.join(""));

      // adding functionalities to the serch bar in the use list page
      let userSerchForm = $("#userSerchForm");
      userSerchForm.submit((e) => {
        e.preventDefault();
        let userInputSearch = $("#userSerchBar").val().toLowerCase();
        if (userInputSearch.length >= 2) {
          let filteredUsersByName = [];
          usersInfo.forEach((userInfo) => {
            let Name = userInfo.fullName.split(" ");
            let firstName = Name[0];
            let lastName = Name[1];
            if (
              firstName.toLowerCase().includes(userInputSearch) ||
              lastName.toLowerCase().includes(userInputSearch)
            ) {
              filteredUsersByName.push(`
                <tr class='table-row userInfoTable'>
                  <td class="light-black">${userInfo.id}</td>
                  <td><img src=${userInfo.profilePic}/></td>
                  <td class="light-black">${userInfo.fullName}</td>
                  <td>${userInfo.dob}</td>
                  <td class="light-black status">$${userInfo.gender}</td>
                  <td class="light-black status">${userInfo.currentCity}</td>
                </tr>
                `);
            }
          });
          userListTable.html(filteredUsersByName.join(""));
        } else {
          alert("Please enter at least 2 characters");
          userListTable.html(usersInformation.join(""));
        }
        $(userSerchForm)[0].reset();
      });
      let userSerchBtn = $("#userSerchBtn");
      userSerchBtn.click(() => {
        $(userSerchForm)[0].reset();
        userListTable.html(usersInformation.join(""));
      });
    }
  );
  const logOut = $(".Logout");
  logOut.click(() => {
    localStorage.setItem("userStatus", false);
    window.location.href = "index.html";
  });
});
