/*
function getFood() {
    return new Promise((resolve) => {
    setTimeout(() => {
      resolve("🍔 Food ready");  // resove promise
      }, 1000);
      });
      }
      
      getFood().then((food) => {
        console.log(food);
        console.log("😋 Eating food");
        });
        
*/





/*
function getFood() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("🍜 Food ready"), 1000);
  });
}

function eatFood(food) {
  return new Promise((resolve) => {
    setTimeout(() => resolve("😋 Ate " + food), 1000);
  });
}

async function main() {
  const food = await getFood();  // untill promise is not resolved or rejected . stop the execution of function. but not keep run the program
  console.log(food);

  const result = await eatFood(food);
  console.log(result);

  console.log("🏁 Done");
}

main();
*/

// await can be used in async function
// async function menas those functions runs paraellely.

// multi-processing
// Both will run paraelly
// Multi-processing (Multiple core having CPU can do this). NOTE: Entire operating system subject assumes you're using unicore CPU.

// understand how process work and it stops when input come or anyother wait.







async function task1() {
    console.log("Task 1 started");
    await new Promise(res => setTimeout(res, 1000));
    console.log("Task 1 finished");
}

async function task2() {
    console.log("Task 2 started");
    await new Promise(res => setTimeout(res, 500));
    console.log("Task 2 finished");
}

async function runAll() {
    //   await task1();
    //   await task2();
    // Run one by one. Untill one is not complete another will not run

    task1();
    task2();
    // Both run
    console.log("All tasks done");
}

runAll();
