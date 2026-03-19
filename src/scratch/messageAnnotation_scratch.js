
// Annotation factory
function Annotation(config) {
  return {
    default: config.default || (() => undefined),
    reducer: config.reducer || ((x, y) => y)
  }
}

/* Factory function is function that is used to create + retun an object

```
function createUser(name, age) {
  return {
    name: name,
    age: age,
    greet() {
      console.log("Hello " + name);
    }
  };
}

const user1 = createUser("Mayank", 22);
user1.greet(); // Hello Mayank
```

*/

// Here you might ask a question why we assign undefined as function `default: config.default || (() => undefined),` However, we can directly write `undefined`. 
// Does it is like true || undefined return something and will change the assignment ?

// Answer: The reason is not mainly about "true||undefined". The real reason is to keep "default" always as a function.
// if config.default(i.e. function) exist then use it. otherwise initialize with a function that returns undefined. 

// Everything inside a state should be mostly a function. COde expects to call it like: state.default()


// --------------------------------------


/* A function in javascript is an Object
That means that can have properties and methods just like other objects.

```
function greet(name) {
  return "Hello " + name;
  }
  
  // adding property to function
  greet.language = "English";
  
  // adding a method
  greet.shout = function(name) {
    return ("HELLO " + name).toUpperCase();
  };

  console.log(greet("Mayank"));      // Hello Mayank
  console.log(greet.language);       // English
  console.log(greet.shout("Mayank"));  // HELLO MAYANK
```

```
function test() {}

console.log(typeof test); // "function"
```
Even though typeof shows "funtion", internally it is special type of object called a "Funtion object"

So in javascript : Function = Callable object. 

*/

Annotation.Root = function (schema) {
  const state = {}

  // Initialize
  for (const key in schema) {
    state[key] = schema[key].default()
  }


  return {
    schema,
    state,

    update(partial) {
      for (const key in partial) {        // key = messages
        const field = this.schema[key]    // field = MessageValue

        const oldValue = this.state[key]  // oldValue = []
        const newValue = partial[key]     // newValue = ["hello"]

        this.state[key] = field.reducer(oldValue, newValue)
      }
    }

  }


}

// Implement MessageAnnotation
const MessageAnnotation = Annotation({
  default: () => [],
  reducer: (x,y) => x.concat(y)
})


// Use it
const State = Annotation.Root({ 
  message: MessageAnnotation
})

State.update({
  messages: ["Hello"]
})

State.update({
  messages: ["Hi"]
})

console.log(State.state)

/*

Question:
But the architecture that choose creator of Annotation.Root is very tricky hard to understand. Because Annotation.Root is property of Annotation function that is used by MessageAnnotation .

I mean there can be a separate function that is not created as method of Annotation Function object. then this will be simpler to understand. This creates a pattern-like self dependency or recursion  



Answer: You’re noticing something real. That pattern does feel tricky at first, and many developers react the same way when they see it. Let’s unpack what’s actually happening and why the library designers chose it.

Based on above code it looks like:

Annotation
 ├── function to create annotations
 └── Root method to build the state container

And you're right — this can feel like a self-dependent pattern.
But technically it isn't recursion.


Why did library desingneer did this: They grouped everything under one namespace-like object. 

Instead of exporting many functions:  createAnnotation(), createRootState(), createReducer(), createField()

They grouped then under : Annotation

So the API becomes: 
- Annotation()
- Annotation.Root()
- Annotation.List()
- Annotation.Map()

This is very common pattern in JS libraries. 

Another example:
- React.createElement()
- React.useState()
- React.useEffect()
Here React is also a function/object namespace.



This works because in javascript functions are basically  function objects. so, This works because: function === object

Just a "namespaced method". It keep the related utitlies grouped together 

without API would look like:  Different functions are exported differently.

Instead they provide : assign functions to one Function object as methods.



LangGraph intentionally tries to create a declarative workflow syntax.
declarative = tell what to do, not how to do.

Your idea for separate function is totally valid. This is simple conceptually, especially for beginners. You are thinking in terms of clarity and separation, which is a good engineering instict.

Experienced library desiners sometimes choose the other pattern. Because they optimize for: API  aesthetics, namespacing, extensibility, etc. All under same namespace




Your reaction actually shows good architectural thinking. When something feels overly clever or confusing, it’s worth questioning it.

In real production systems, many teams prefer the simpler factory-function style you described because it improves long-term readability.

The LangGraph team chose a DSL-style API, which trades a bit of clarity for a cleaner schema-like syntax.

Both approaches are valid.


---------------------------------------------


# DSL (Domain-Specific Language)
A DSL is a small language designed for a specific problem/domain

Example:
- SQL  -> database queries
- HTML -> web page structure
- CSS  -> styling

SQL is the language only for the databases, not general programming.


DSL-style API is a normal programming API design to read like a mini language. 
Looks like another programming language. 

```
route("/users").get(handler).post(handler)
```

Here the interface(coding language) is JS. But the coding style is web development style. 
This same style is used in Flask & FastAPI also. there the interface is Python. 


- DSL -> A Specialized language for domain
- DSL-style API -> It looks like small custom programming language for a specific task inside your code. 

*/