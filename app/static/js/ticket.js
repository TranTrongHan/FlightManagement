function findflights(){
    const takeoff = document.getElementById('takeoff1').value; // Lấy giá trị của option được chọn
    const landing = document.getElementById('landing1').value;
    const departureTime = document.getElementById('departureTime').value;
    if (takeoff == landing){
        alert("Sân bay đi không thể trùng với sân bay đến.");
        return;
    }
    // Kiểm tra nếu ngày đi chưa được nhập
    if (!departureTime) {
        alert("Vui lòng chọn ngày đi.");
        return;
    }
    const flightData =  {
        takeoff: takeoff,
        landing: landing,
        departureTime: departureTime
    };

    fetch('/api/bookticket',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(flightData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const flights = data.flights;
        const route = data.route;
        flights.forEach(flight => {
            const flightName = flight.name; // Truy xuất thuộc tính name
            const routeId = flight.route_id; // Truy xuất thuộc tính route_id

            console.log(`Flight ID:${flight.id},Flight Name: ${flightName}, Route ID: ${routeId}, Route Name: ${route.name}`);

        });
        const flightTableBody = document.getElementById('flightTableBody');
        flightTableBody.innerHTML = '';

        data.flights.forEach(flight => {
            if (data.route.id == flight.route_id) {
                // Giả sử flight.take_off_time là một đối tượng Date
                let takeOffTime = new Date(flight.take_off_time); // flight.take_off_time cần phải là một định dạng mà Date có thể hiểu
                let formattedTakeOffTime = formatDate(takeOffTime);
                let landingTime = new Date(flight.landing_time); // flight.take_off_time cần phải là một định dạng mà Date có thể hiểu
                let formattedLandingTime = formatDate(landingTime);
                const plane = data.planes.find(plane => plane.id == flight.plane_id) || {};
                const row = `
                    <tr class="text-center">
                        <td>${data.route.name}</td>
                        <td>${flight.id}</td>
                        <td>${flight.name}</td>
                        <td>${plane.name || 'N/A'}</td>
                        <td>${formattedTakeOffTime}</td>
                        <td>${formattedLandingTime}</td>
                        <td>
                            <input type="button" value="Đặt vé" onclick="pendingpayment(${flight.id},${data.user_id},${data.route.id},'${formattedTakeOffTime}')"
                             style="background-color: #0078FF; color: white; padding: 12px 24px; border: none; border-radius: 5px;"/>
                        </td>
                    </tr>
                `;
                flightTableBody.innerHTML += row;
            }
        });

        if (flightTableBody.innerHTML == '') {
            flightTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có chuyến bay nào phù hợp.</td></tr>';
        }
    }).catch(error => console.error('Error:', error));
}
function formatDate(dateString) {
    const pad = (num) => String(num).padStart(2, '0'); // Hàm thêm số 0 vào trước nếu cần

    // Chuyển đổi chuỗi thành đối tượng Date
    const date = new Date(dateString);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}



function pendingpayment(flightId,userId,routeId,takeOffTime){
    fetch('/api/handlebooking', {
        method:'post',
        body: JSON.stringify({
            'flight_id': flightId,
            'user_id' : userId,
            'route_id':routeId,
            'takeoff_time':takeOffTime
        }),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response => {
       if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error); // Lấy thông báo lỗi từ phản hồi
            });
        }
        return response.json(); // Trả về dữ liệu JSON nếu thành công
    }).then(data => {
        // Chuyển hướng đến trang mới nếu không có lỗi
        window.location.href = `/bookticket_process?flight_id=${flightId}&route_id=${routeId}&user_id=${userId}`; // Cập nhật nội dung
    })
    .catch(error => {
        alert(error.message); // Hiển thị lỗi dưới dạng alert
//         Chuyển hướng về trang bookticket
        window.location.href = '/bookticket';
    })
}


function selltickets(){
    const takeoff = document.getElementById('takeoff1').value; // Lấy giá trị của option được chọn
    const landing = document.getElementById('landing1').value;
    const departureTime = document.getElementById('departureTime').value;
    if (takeoff == landing){
        alert("Sân bay đi không thể trùng với sân bay đến.");
        return;
    }
    // Kiểm tra nếu ngày đi chưa được nhập
    if (!departureTime) {
        alert("Vui lòng chọn ngày đi.");
        return;
    }
    const flightData =  {
        takeoff: takeoff,
        landing: landing,
        departureTime: departureTime
    };

    fetch('/api/selltickets',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(flightData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const flights = data.flights;
        const route = data.route;
        const flightTableBody = document.getElementById('flightTableBody');
        flightTableBody.innerHTML = '';

        data.flights.forEach(flight => {
            if (data.route.id == flight.route_id) {
                // Giả sử flight.take_off_time là một đối tượng Date
                let takeOffTime = new Date(flight.take_off_time); // flight.take_off_time cần phải là một định dạng mà Date có thể hiểu
                let formattedTakeOffTime = formatDate(takeOffTime);
                let landingTime = new Date(flight.landing_time); // flight.take_off_time cần phải là một định dạng mà Date có thể hiểu
                let formattedLandingTime = formatDate(landingTime);
                const plane = data.planes.find(plane => plane.id == flight.plane_id) || {};
                const row = `
                    <tr class="text-center">
                        <td>${data.route.name}</td>
                        <td>${flight.id}</td>
                        <td>${flight.name}</td>
                        <td>${plane.name || 'N/A'}</td>
                        <td>${formattedTakeOffTime}</td>
                        <td>${formattedLandingTime}</td>
                        <td>
                            <input type="button" value="Bán vé" onclick="pendingticket(${flight.id})"
                             style="background-color: #0078FF; color: white; padding: 12px 24px; border: none; border-radius: 5px;"/>
                        </td>
                    </tr>
                `;
                flightTableBody.innerHTML += row;
            }
        });

        if (flightTableBody.innerHTML == '') {
            flightTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có chuyến bay nào phù hợp.</td></tr>';
        }
    }).catch(error => console.error('Error:', error));
}
function pendingticket(flightId){
     console.log(flightId)
     fetch('/api/ticketdetails', {
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            'flight_id': flightId,
        })

    }).then(response => {
       if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error); // Lấy thông báo lỗi từ phản hồi
            });
        }
        return response.json(); // Trả về dữ liệu JSON nếu thành công
    }).then(data => {
        // Chuyển hướng đến trang mới nếu không có lỗi
        window.location.href = `/pendingticket?flight_id=${flightId}&first_seat=${data.first_seat}&second_seat=${data.second_seat}`; // Cập nhật nội dung
    })
    .catch(error => {
        alert(error.message); // Hiển thị lỗi dưới dạng alert
        window.location.href = '/selltickets';
    })
}
function confirmSell(){
    // Lấy id khách hàng
    const customerId = document.getElementById('customerSelect').value;
    console.log(customerId); // In ra giá trị
    // Lấy id chuyến bay
    const flightIdElement = document.getElementById('flightid').value;
    console.log(flightIdElement); // In ra giá trị
    // Lấy số lượng vé
    const quantity = document.getElementById('ticket-quantity').value;
    console.log(quantity)
    // Lấy hạng vé
    const fareclass = document.getElementById('fareClassSelect').value;
    console.log(fareclass)
    // Lấy vé hạng 1
    const firstSeat = document.getElementById('firstSeat').value;
    console.log(firstSeat)
    const secondSeat = document.getElementById('secondSeat').value;
    console.log(secondSeat)
    fetch('/api/confirmsell', {
        method:'post',
        body: JSON.stringify({
            'customer_id': customerId,
            'flight_id':flightIdElement,
            'quantity':quantity,
            'fareclass_id':fareclass,
            'firstseat':firstSeat,
            'secondseat':secondSeat
        }),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response => {
       if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error);
            });
        }
        return response.json(); // Trả về dữ liệu JSON nếu thành công
    }).then(data => {
        alert("Bán vé thành công")
        window.location.href = '/selltickets';
    })
    .catch(error => {
        alert(error.message); // Hiển thị lỗi dưới dạng alert
//         Chuyển hướng về trang sellticket
        window.location.href = '/selltickets';
    })
}
