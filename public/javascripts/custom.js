var socket = io.connect();

socket.on('update kitchen display', function (data) {
  // console.log(data);

  var order = document.getElementById(data._id);
  if (order) {
    order.childNodes[1].innerText = data.quantity;
    order.childNodes[4].removeChild(order.childNodes[4].firstChild);
    order.childNodes[4].appendChild(createButton(data));
  } else {
    var display = document.getElementById('display');
    display.appendChild(createNewRecord(data));
  }
});

function createButton(data) {
  var span = document.createElement("span");
  span.classList.add("glyphicon");
  span.classList.add("glyphicon-ok");

  var button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add("btn-success");
  button.appendChild(span);

  button.addEventListener('click', function () { changeStatus(data); });

  var td = document.createElement("td");
  td.appendChild(button);

  return td;
}

function createNewRecord(order) {
  var tr = document.createElement('tr');
  tr.setAttribute("id", order._id);
  var name = document.createElement('td');
  name.innerText = order.name;
  tr.appendChild(name);

  var quantity = document.createElement('td');
  quantity.innerText = order.quantity;
  tr.appendChild(quantity);

  var createdTillNow = document.createElement('td');
  createdTillNow.innerText = order.createdTillNow;
  tr.appendChild(createdTillNow);

  var predicted = document.createElement('td');
  predicted.innerText = order.predicted;
  tr.appendChild(predicted);

  var button = createButton(order);
  tr.appendChild(button);

  return tr;
}

socket.on('status done', function (data) {
  // console.log("status done", data);
  var quantity = document.getElementById(data._id).childNodes[1];
  quantity.innerText = data.quantity;
  var createdTillNow = document.getElementById(data._id).childNodes[2];
  createdTillNow.innerText = data.createdTillNow;
  var status = document.getElementById(data._id).childNodes[4];
  status.innerHTML = "<button class='btn btn-success' disabled> <span>Completed</span> </button>"
});

socket.on('predicted updated', function (data) {
  // console.log("predicted", data);
  var status = document.getElementById(data._id).childNodes[3];
  status.innerText = data.predicted;
});

function changeStatus(order) {
  if (order.status == false) {
    order.status = true;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("success");
      }
    };

    xhttp.open("PUT", "/orders/status", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(order));
  }
}
