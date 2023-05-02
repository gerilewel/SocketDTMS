async function someFunction() {
    console.log('This async function is called from another file');
  
    // Simulate an asynchronous operation that takes 2 seconds to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    console.log('Async function completed');
  }
  
  module.exports = {
    someFunction: someFunction
  };