let timeRecord = document.getElementById("time_record")
let milliRecord = document.getElementById("milli_record")
let startButton = document.getElementById("button-start")
let resetButton = document.getElementById("button-reset")
let clearButton = document.getElementById("clear")
let worker = null // ตัวแปรสำหรับเก็บ Web Worker (เริ่มต้นเป็น null)
let isPaused = true
let counter = 1 

// ปุ่ม start --> pause --> continue
startButton.addEventListener("click", () => {
  if (!worker) {
    // เริ่มจับเวลา
    worker = new Worker('worker.js') // สร้าง Web Worker เพื่อรันโค้ดจับเวลาใน background
    worker.onmessage = (event) => { // ฟังก์ชันที่ทำงานเมื่อได้รับข้อความจาก Worker (อัปเดตเวลา)
        const { milliseconds, seconds, minutes, hours } = event.data
        timeRecord.textContent = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
        milliRecord.textContent = ` . ${milliseconds.toString().padStart(3, '0')}`
        // แสดงเวลาบน tap เบราว์เซอร์
        document.title = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')} . ${milliseconds.toString().padStart(3, '0')}`; 
    }; // Start --> Pause
    worker.postMessage('start') // ส่งข้อความ 'start' ไปยัง Worker เพื่อเริ่มจับเวลา
    startButton.textContent = "Pause" // เปลี่ยนข้อความปุ่มเป็น "Pause"
    startButton.style.backgroundColor = '#d1ab00'
    startButton.style.border = '#d1ab00'
    resetButton.style.backgroundColor = '#b60000'
    resetButton.style.border = '#b60000'
    isPaused = false
  } else { // Continue --> Pause(กดซ้ำได้หลายรอบ)
    if (isPaused) {
        worker.postMessage('continue') // ส่งข้อความ 'continue' ไปยัง Worker
        startButton.textContent = "Pause" // เปลี่ยนข้อความปุ่มเป็น "Pause"
        startButton.style.backgroundColor = '#d1ab00'
        startButton.style.border = '#d1ab00'
        isPaused = false
    } else { // Pause --> Continue
        worker.postMessage('pause') // ส่งข้อความ 'pause' ไปยัง Worker
        startButton.textContent = "Continue" // เปลี่ยนข้อความปุ่มเป็น "Continue"
        startButton.style.backgroundColor = '#008d47'
        startButton.style.border = '#008d47'
        isPaused = true
    }
  }
});

// ปุ่ม reset และ เพิ่มประวัติ
resetButton.addEventListener("click", () => { // Event Listener สำหรับปุ่ม Reset
  if (worker) {
    // Reset
    worker.terminate() // หยุด Worker
    worker = null
    startButton.textContent = "Start" // เปลี่ยนข้อความปุ่มกลับเป็น "Start"
    resetButton.style.backgroundColor = '#585858'
    resetButton.style.border = '#585858'
    startButton.style.backgroundColor = '#008d47'
    startButton.style.border = '#008d47'
 
    // เพิ่มประวัติพร้อมลบข้อความ 'ยังไม่มีเวลาที่บันทึก'
    let history = document.getElementById('history_label')
    let word = document.getElementById('word')
    if (history) {
      if (word.textContent === 'ยังไม่มีเวลาที่บันทึก') {
        word.textContent = ''
      }
      
      var paragraph = document.createElement('p')
      paragraph.classList.add('paragraph-styling')
      // เพิ่มจำนวน counter) เวลาที่หยุด
      paragraph.innerText = counter++ + ') ' + timeRecord.textContent + milliRecord.textContent
      history.appendChild(paragraph)
    }
    
    timeRecord.textContent = "00 : 00 : 00" // รีเซ็ตค่าเวลา
    milliRecord.textContent = " . 000" // รีเซ็ตค่ามิลลิวินาที
    document.title = "Stopwatch"
    isPaused = true
}
});

// ลบรายการประวัติทั้งหมด
clearButton.addEventListener("click", () => {
  // ตรวจสอบและล้างประวัติ
  let history = document.getElementById('history_label')
  let word = document.getElementById('word')

  if (history) {
    history.innerHTML = '' // ล้างประวัติทั้งหมด
    counter = ''
  }

  counter++

  if (word) {
    word.textContent = 'ยังไม่มีเวลาที่บันทึก' // รีเซ็ตข้อความ
  }
})
