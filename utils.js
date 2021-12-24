import { readFile, writeFile } from "fs/promises";
let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;
export const help = async () => {
  console.log(usage);
  console.log(await readData());
};
const readData = async () => {
  let data;
  try {
    data = await readFile(new URL("./task.txt", import.meta.url), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    data = [];
    await writeData(data);
    return data;
  }
};
const writeData = async (data) => {
  await writeFile(new URL("./task.txt", import.meta.url), JSON.stringify(data));
};
export const add = async (priority, task) => {
  let tasks = await readData();
  tasks = [...tasks, { priority, task, iscompleted: false }];
  await writeData(tasks);
  console.log(`Added task: "${task}" with priority ${priority}`);
};

export const ls = async () => {
  const data = await readData();
  if (data.length == 0) {
    console.log(`There are no pending tasks!`);
  } else {
    data.sort((a, b) => a.priority - b.priority);
    data.map((value, index) => {
      console.log(`${index + 1}. ${value.task} [${value.priority}]`);
    });
  }
};
export const del = async (index) => {
  let data = await readData();
  let pendingTasks = data.filter((value) => !value.iscompleted);
  let completedTasks = data.filter((value) => value.iscompleted);

  let newTasks;
  if (index > 0 && index <= pendingTasks.length) {
    newTasks = pendingTasks.filter((value, i) => i + 1 != index);
    // console.log('newTasks:', newTasks)
    await writeData([...newTasks, ...completedTasks]);
    console.log(`Deleted task #${index}`);
  } else {
    console.log(
      `Error: task with index #${index} does not exist. Nothing deleted.`
    );
  }
};
export const report = async () => {
  const tasks = await readData();

  // copyTasks = tasks;

  const completedTasks = tasks.filter((task) => task.iscompleted);
  const pendingTasks = tasks.filter((task) => !task.iscompleted);

  console.log(
    `Pending : ${pendingTasks.length}\n${pendingTasks
      .map((ic, idx) => {
        return idx + 1 + ". " + ic.task + " [" + ic.priority + "]";
      })
      .join("\n")}\nCompleted : ${completedTasks.length}\n${completedTasks
      .map((ct, index) => {
        return `${index + 1}. ${ct.task}`;
      })
      .join("\n")}`
  );
};

export const done = async (index) => {
  let data = await readData();

  if (index > 0 && index <= data.length) {
    let finishedTask = data.map((value, i) => {
      if (i + 1 == index) {
        value.iscompleted = true;
        return value;
      }
      return value;
    });
    await writeData(finishedTask);
    console.log(`Marked item as done.`);
  } else {
    console.log(`Error: no incomplete item with index #${index} exists.`);
  }

};
