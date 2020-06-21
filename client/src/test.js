function sortListItemsPrioritiesFirst(a, b) {
  if (a.completed && !b.completed) return 1;
  else if (!a.completed && b.completed) return -1;
  else {
    // sort items by priority first
    const priorities = ["low", "medium", "high"];
    const priorityA = priorities.indexOf(a.priority);
    const priorityB = priorities.indexOf(b.priority);
    // if they have the same priority, sort by due date
    if (priorityB === priorityA) {
      if (a.dueDate === "" && b.dueDate !== "") return 1;
      else if (a.dueDate !== "" && b.dueDate === "") return -1;

      // sort items based on due date
      const dateA = new Date(a.dueDate + " 00:00");
      const dateB = new Date(b.dueDate + " 00:00");

      if (a.dueDate !== b.dueDate) return dateA - dateB;
      else {
        // sort by itemID
        const itemIDA = a.itemID;
        const itemIDB = b.itemID;
        return itemIDA - itemIDB;
      }
    } else return priorityB - priorityA;
  }
}

const items = [
  {
    title: "test1",
    description: "",
    dueDate: "2020-06-21",
    priority: "low",
    completed: false,
    itemID: "5eef08c5b5e0f459ffad6269",
  },
  {
    title: "test2",
    description: "",
    dueDate: "2020-06-22",
    priority: "low",
    completed: false,
    itemID: "5eef08c6b5e0f459ffad626a",
  },
  {
    title: "test3",
    description: "",
    dueDate: "2020-06-26",
    priority: "medium",
    completed: false,
    itemID: "5eef08c8b5e0f459ffad626b",
  },
  {
    title: "test4",
    description: "",
    dueDate: "2020-06-22",
    priority: "low",
    completed: false,
    itemID: "5eef08cab5e0f459ffad626c",
  },
  {
    title: "test5",
    description: "",
    dueDate: "2020-06-22",
    priority: "high",
    completed: false,
    itemID: "5eef08dc81acd887868d9b85",
  },
];

items.sort(sortListItemsPrioritiesFirst);

console.log(items);
