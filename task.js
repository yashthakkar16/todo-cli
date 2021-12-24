import { add, del, done, help, ls, report } from "./utils.js";
const args = process.argv;
let commands = args.slice(2);

switch (commands[0]) {
  case undefined:
    help();
    break;

  case "help":
    help();
    break;

  case "add":
    if (!commands[2]) {
      console.log(" Error: Missing tasks string. Nothing added!");
    } else {
      add(commands[1], commands[2]);
    }
    break;

  case "ls":
    ls();
    break;

  case "del":
    if (commands[1]) {
        del(commands[1]);
    }
    else{
        console.log("Error: Missing NUMBER for deleting tasks.");
    }
    
    break;

  case "report":
    report();
    break;

  case "done":
    if (commands[1]) {
        done(commands[1]);
    }
    else{
        console.log("Error: Missing NUMBER for marking tasks as done.");
    }
    break;

  default:
    break;
}
