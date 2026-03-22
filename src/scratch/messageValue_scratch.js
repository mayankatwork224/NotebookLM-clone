/* for ...in vs for...of loop

for (const variable in object)
  statement

for (const variable of iterable)
  statement 

OR
// You can use for of loop with objects this way
for (const [key, value] of Object.entries(object)) {
  console.log(`${key}: ${value}`);
}

> In Javascript When you see alone word "Object" that means it is JS object. Not some class's object. 

*/


// Implement StateSchema
class StateSchema {
  constructor(schema) {
    this.schema = schema
    this.state = {}

    // initialize default values
    for (const key in schema) {         // key = messages
      const field = schema[key]         // field = MessagesValue
      this.state[key] = field.default() // {messages = []}
    }
  }

  // Update method
  update(partial) {               

    // partil is schema. But not entire schema that we passed to StateSchema, Only some part of it(some fields) that we want to update.  

    for (const key in partial) {        // key = messages
      const field = this.schema[key]    // field = MessageValue

      const oldValue = this.state[key]  // oldValue = []
      const newValue = partial[key]     // newValue = ["hello"]

      this.state[key] = field.reducer(oldValue, newValue)
    }
  }
}



// Implement MessageValue
const MessagesValue = {
  default: () => [],
  reducer: (existing, incoming) => {
    return [...existing, ...incoming]      
  }
  // It takes two array and merge their values in one array. Retun it. 
}


/*

1. Rest Operator(...) --> collect values 
```
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4); 
// numbers = [1, 2, 3, 4]
```


2. Spread Operator(...) --> expand values
```
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

console.log(arr2);
// [1, 2, 3, 4, 5]
```

*/





// Use it 
const State = new StateSchema({
  messages: MessagesValue
})

State.update({
  messages: ["Hello"]
})

State.update({
  messages: ["How are you?"]
})

console.log(State.state)