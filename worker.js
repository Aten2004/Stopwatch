let startTime             // ตัวแปรเก็บเวลาเริ่มต้น (performance.now() ให้ความแม่นยำสูง)
let elapsedPausedTime = 0 // เวลาที่หยุดไว้
let intervalId            // ตัวแปรเก็บ ID ของ setInterval เพื่อใช้ในการหยุดการทำงาน
let isPaused = false      // สถานะจับเวลา (เริ่มต้น: ไม่หยุด)

self.onmessage = function(e) { // ฟังก์ชันรับข้อความจากไฟล์หลัก
  if (e.data === 'start' && !isPaused) { // ถ้ารับข้อความ 'start' และยังไม่หยุดจับเวลา
    startTime = performance.now() // กำหนดเวลาเริ่มต้น
    intervalId = setInterval(calculateTime, 1) // เรียกใช้ calculateTime ทุก 1 มิลลิวินาที
  } else if (e.data === 'pause') { // ถ้ารับข้อความ 'pause'
    clearInterval(intervalId) // หยุดการเรียกใช้ calculateTime ซ้ำๆ
    elapsedPausedTime = performance.now() - startTime // คำนวณเวลาที่หยุดไป
    isPaused = true; // ตั้งสถานะเป็นหยุดจับเวลา
  } else if (e.data === 'continue') { // ถ้ารับข้อความ 'continue' และกำลังหยุดอยู่
    startTime = performance.now() - elapsedPausedTime // ปรับเวลาเริ่มต้นใหม่ให้ถูกต้อง
    intervalId = setInterval(calculateTime, 1) // เริ่มเรียกใช้ calculateTime อีกครั้ง
    isPaused = false; // ตั้งสถานะเป็นไม่หยุดจับเวลา
  }
};

function calculateTime() { // ฟังก์ชันคำนวณเวลา
  const now = performance.now() // เวลาปัจจุบัน
  const elapsedTime = now - startTime // เวลาที่ผ่านไป

  // คำนวณ ชั่วโมง, นาที, วินาที, มิลลิวินาที จาก elapsedTime
  let milliseconds = Math.floor(elapsedTime % 1000)
  let seconds = Math.floor(elapsedTime / 1000) % 60
  let minutes = Math.floor(elapsedTime / 60000) % 60
  let hours = Math.floor(elapsedTime / 3600000)

  // ส่งข้อมูลเวลากลับไปยังไฟล์หลัก
  self.postMessage({ milliseconds, seconds, minutes, hours })
}
