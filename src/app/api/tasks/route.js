import connnectDB from "@/app/lib/db";
import Task from "@/app/models/Task";

export async function GET() {
  await connnectDB();
  const tasks = await Task.find();
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(request) {
  await connnectDB();
  const { title, description, dueDate } = await request.json();
  const task = new Task({ title, description, dueDate });
  await task.save();
  return new Response(JSON.stringify(task), { status: 201 });
}

export async function PUT(request) {
  await connnectDB();
  const { id, title, description, dueDate, completed } = await request.json();
  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, dueDate, completed },
    { new: true }
  );
  return new Response(JSON.stringify(task), { status: 200 });
}

export async function DELETE(request) {
  await connnectDB();
  const { id } = await request.json();
  await Task.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
